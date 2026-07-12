// Vercel Edge Function — proxies all /api/gradio-proxy/* requests to the
// HuggingFace Space, so the browser only ever talks to our own domain
// (same-origin, no CORS issue) while this function does the actual
// cross-origin call server-side, where CORS restrictions don't apply.
//
// This is the production equivalent of Vite's dev-server proxy — same
// job, different mechanism, because Vite's proxy only exists while its
// dev server is running and disappears entirely in a static production
// build.
//
// Uses the Edge runtime (not the default Node.js serverless runtime)
// specifically because Gradio's response is a Server-Sent Events (SSE)
// stream, and Edge Functions can pass a streaming body straight through
// using standard Web Request/Response objects — no manual chunk-reading
// or buffering required.

export const config = { runtime: "edge" };

const TARGET = "https://cain0508-hasya-scoring.hf.space";

export default async function handler(request) {
  const url = new URL(request.url);

  // Strip the /api/gradio-proxy prefix, forward whatever's left
  // (e.g. /gradio_api/call/score_laugh) straight to the real Space.
  const targetPath = url.pathname.replace(/^\/api\/gradio-proxy/, "");
  const targetUrl = `${TARGET}${targetPath}${url.search}`;

  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.delete("host"); // let fetch set the correct upstream host

  const init = {
    method: request.method,
    headers: forwardedHeaders,
  };

  // Only attach a body for methods that have one — GET/HEAD requests
  // (used for the SSE result-polling step) must not include a body.
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half"; // required by the fetch spec when streaming a request body
  }

  const upstreamResponse = await fetch(targetUrl, init);

  // Pass the upstream response straight through, including its SSE stream
  // body untouched — we're not buffering or re-encoding anything here.
  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set("Access-Control-Allow-Origin", "*");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
