/**
 * Gradio REST Client — Direct fetch through Vite proxy.
 *
 * We bypass @gradio/client entirely because it has CORS issues
 * when connecting from localhost to HuggingFace Spaces.
 * Instead, we use Vite's dev server proxy + the /gradio_api prefix
 * discovered from the Space's /config endpoint.
 *
 * Gradio's newer API uses a two-step pattern:
 *   1. POST /gradio_api/call/<endpoint_name> → returns { event_id }
 *   2. GET  /gradio_api/call/<endpoint_name>/<event_id> → SSE stream with result
 */

const PROXY_BASE = "/api/gradio-proxy/gradio_api";

/**
 * Helper: call a Gradio endpoint and return the parsed result.
 * Handles the two-step call/result SSE pattern.
 */
async function gradioCall(endpointName, data = []) {
  const callRes = await fetch(`${PROXY_BASE}/call/${endpointName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  if (!callRes.ok) {
    const text = await callRes.text();
    throw new Error(`Gradio call failed (${callRes.status}): ${text}`);
  }

  const { event_id } = await callRes.json();

  const resultRes = await fetch(
    `${PROXY_BASE}/call/${endpointName}/${event_id}`
  );

  if (!resultRes.ok) {
    const text = await resultRes.text();
    throw new Error(`Gradio result failed (${resultRes.status}): ${text}`);
  }

  const sseText = await resultRes.text();
  const lines = sseText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("event: complete")) {
      const dataLine = lines[i + 1];
      if (dataLine && dataLine.startsWith("data: ")) {
        return JSON.parse(dataLine.slice(6));
      }
    }
    if (lines[i].startsWith("event: error")) {
      const dataLine = lines[i + 1];
      const errorMsg = dataLine?.startsWith("data: ")
        ? dataLine.slice(6)
        : "Unknown Gradio error";
      throw new Error(errorMsg);
    }
  }

  throw new Error("No complete event found in Gradio SSE response");
}

/**
 * Helper: upload a file to Gradio's upload endpoint.
 * Returns the server-side path to use in predict calls.
 */
async function gradioUpload(file) {
  const formData = new FormData();
  formData.append("files", file);

  const res = await fetch(`/api/gradio-proxy/gradio_api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`File upload failed (${res.status})`);
  }

  const paths = await res.json();
  return paths[0];
}

/**
 * Score a Laugh
 *
 * @param {Blob|File} imageFile - The image to score
 * @param {string} wallet - Ethereum wallet address (0x...)
 * @returns {Object} Parsed result with score, tier, components, payout, photo_url, etc.
 */
export async function scoreLaugh(imageFile, wallet) {
  const uploadedPath = await gradioUpload(imageFile);

  const result = await gradioCall("score_laugh", [
    { path: uploadedPath, meta: { _type: "gradio.FileData" } },
    wallet,
  ]);

  const raw = result[0];
  if (typeof raw === "string") {
    const parsed = JSON.parse(raw);
    if (parsed.error) {
      throw new Error(parsed.error);
    }
    return parsed;
  }

  throw new Error("Unexpected response format from score_laugh");
}

/**
 * Refresh the Top Earners leaderboard (cumulative ETH earned)
 *
 * @returns {Array<Array>} Rows: [[rank, wallet, "X.XXXXXX ETH"], ...]
 */
export async function refreshLeaderboard() {
  try {
    const result = await gradioCall("refresh_leaderboard");
    const df = result[0];
    if (df && Array.isArray(df.data)) return df.data;
    if (Array.isArray(df)) return df;
    return [];
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return [];
  }
}

/**
 * Refresh the Best Laughs leaderboard (best single score)
 *
 * @returns {Array<Array>} Rows: [[rank, wallet, best_score], ...]
 */
export async function refreshBestScoreLeaderboard() {
  try {
    const result = await gradioCall("refresh_best_score_leaderboard");
    const df = result[0];
    if (df && Array.isArray(df.data)) return df.data;
    if (Array.isArray(df)) return df;
    return [];
  } catch (err) {
    console.error("Error fetching best score leaderboard:", err);
    return [];
  }
}

/**
 * Refresh the Dashboard for a given wallet
 *
 * Backend: def refresh_dashboard(wallet)
 *   returns 6 outputs in this exact order:
 *     0. summary: string, e.g. "0.003960 ETH lifetime earned"
 *     1. streak: string containing an integer, e.g. "1"
 *     2. gallery_items: array of [image_url, caption] pairs (legacy display
 *        caption has "Score: N" as plain text — prefer recentPosts below
 *        for a structured, numeric score field)
 *     3. trend_df: Gradio Dataframe wrapper { headers, data, metadata } —
 *        data is [[day_label, avg_score], ...], 7 rows, oldest first
 *     4. weekly_checkmarks: JSON string of [{day, has_laugh}, ...], 7 entries,
 *        oldest first — drives the 7-day streak checkmark row
 *     5. recent_posts: JSON string of [{url, score, created_at}, ...],
 *        up to 3 entries, newest first — score is a real number here,
 *        not embedded in display text
 *
 * @param {string} wallet - 0x-prefixed wallet address
 * @returns {Object} { summary, streak, trendChart, weeklyCheckmarks, recentPosts }
 */
export async function refreshDashboard(wallet) {
  try {
    const result = await gradioCall("refresh_dashboard", [wallet]);

    const summary = result[0];
    const streak = parseInt(result[1], 10) || 0;

    const trendWrapper = result[3];
    const trendChart = (trendWrapper && Array.isArray(trendWrapper.data))
      ? trendWrapper.data.map(([day, score]) => ({ day, score }))
      : [];

    const weeklyCheckmarks = JSON.parse(result[4] || "[]");
    const recentPosts = JSON.parse(result[5] || "[]");

    return { summary, streak, trendChart, weeklyCheckmarks, recentPosts };
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    return {
      summary: "Error loading dashboard",
      streak: 0,
      trendChart: [],
      weeklyCheckmarks: [],
      recentPosts: [],
    };
  }
}