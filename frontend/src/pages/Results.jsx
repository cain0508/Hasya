import { useState, useEffect } from 'react';
import { useHasya } from '../context/HasyaContext';
import { refreshDashboard } from '../api/gradioClient';

export default function Results({ setCurrentPage }) {
  const { wallet, latestScore } = useHasya();

  const [dashboardData, setDashboardData] = useState({
    summary: "0.000000 ETH lifetime earned",
    streak: "0",
    gallery: [],
    loading: true,
    error: null
  });

  // Fetch dashboard data when the component mounts, or when wallet/latestScore changes
  useEffect(() => {
    async function loadDashboard() {
      if (!wallet || wallet.length < 42) return;

      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      try {
        const {
          summary,
          streak,
          trendChart,
          weeklyCheckmarks,
          recentPosts
        } = await refreshDashboard(wallet);

        setDashboardData({
          summary: summary || "0 ETH",
          streak: streak || "0",
          trendChart: trendChart || [],
          weeklyCheckmarks: weeklyCheckmarks || [],
          recentLaughs: recentPosts || [],
          loading: false,
          error: null
        });
      } catch (err) {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard data"
        }));
      }
    }

    loadDashboard();
  }, [wallet, latestScore]);

  // Extract ETH amount from summary
  const ethAmount = (dashboardData.summary || "0.000000").split(" ")[0] || "0.000000";

  // TODO: Fetch real ETH/USD rate. Using a placeholder for now.
  const USD_RATE = 3241.90;
  const usdEquivalent = (parseFloat(ethAmount) * USD_RATE).toFixed(2);

  return (
    <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10 bg-background pt-24 pb-16">
      <div className="max-w-[1000px] mx-auto flex flex-col gap-10">

        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-extrabold text-on-surface">GM, Sunshine! ☀️</h1>
            <p className="font-body text-lg text-secondary mt-2">Your mood is up 12% today. Keep the energy flowing.</p>
          </div>

          {/* Capture Joy Button */}
          <button
            className="joy-gradient px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 group"
            onClick={() => setCurrentPage('score')}
          >
            <span className="material-symbols-outlined text-on-primary-container text-3xl transition-transform group-hover:rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>camera_alt</span>
            <span className="font-display text-xl font-bold text-on-primary-container">Capture Joy</span>
          </button>
        </section>

        {/* Top Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
          {/* Happiness Balance Widget */}
          <div className="md:col-span-7 glass-card rounded-[24px] p-10 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-0 relative overflow-hidden">
            <div className="relative z-10">
              <span className="font-label text-sm font-semibold text-secondary uppercase tracking-widest">
                Happiness Balance
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-[48px] lg:text-[56px] font-extrabold text-on-surface">
                  {dashboardData.loading ? "..." : ethAmount}
                </span>
                <span className="font-display text-2xl font-bold text-primary">ETH</span>
              </div>
              <span className="font-body text-lg text-secondary">
                ≈ ${usdEquivalent} USD
              </span>
            </div>

            <div className="mt-10 flex gap-4 relative z-10">
              <button className="bg-surface-container-high px-6 py-3 rounded-xl font-label text-sm font-semibold hover:bg-outline-variant/30 transition-colors">Withdraw</button>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label text-sm font-semibold hover:brightness-95 transition-colors">Stake Joy</button>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 joy-gradient opacity-20 rounded-full blur-3xl"></div>
          </div>

          {/* Laughter Streak Tracker */}
          <div className="md:col-span-5 glass-card rounded-[24px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-0">
            <div className="flex justify-between items-center mb-6">
              <span className="font-label text-sm font-semibold text-secondary uppercase tracking-widest">Laughter Streak</span>
              <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label text-xs font-semibold">
                🔥 {dashboardData.loading ? "..." : (dashboardData.streak || "0")} Days
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {dashboardData.loading ? (
                ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-xs text-secondary">{day}</span>
                    <div className="w-full aspect-square bg-surface-container-high rounded-lg streak-dot"></div>
                  </div>
                ))
              ) : (
                dashboardData.weeklyCheckmarks.map((entry, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-xs text-secondary">{entry.day}</span>
                    {entry.has_laugh ? (
                      <div className="w-full aspect-square joy-gradient rounded-lg streak-dot flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs">done</span>
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-surface-container-high rounded-lg streak-dot"></div>
                    )}
                  </div>
                ))
              )}
            </div>
            <p className="mt-6 text-center font-label text-xs font-medium text-secondary">2 days left to hit next Reward Box!</p>
          </div>
        </section>

        {/* Bottom Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Mood Trend Graph */}
          <div className="lg:col-span-8 glass-card rounded-[24px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] h-[320px] flex flex-col border-0">
            <div className="flex justify-between items-center mb-10">
              <span className="font-label text-sm font-semibold text-secondary uppercase tracking-widest">Positive Affect Trend</span>
              <div className="flex gap-3">
                <span className="flex items-center gap-1 font-label text-xs font-medium text-tertiary">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span> You
                </span>
                <span className="flex items-center gap-1 font-label text-xs font-medium text-secondary">
                  <span className="w-2 h-2 rounded-full bg-secondary opacity-30"></span> Avg.
                </span>
              </div>
            </div>

            <div className="flex-1 w-full relative flex items-end justify-between px-6 pb-6 mt-4">
              {dashboardData.loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="w-12 bg-surface-container-high rounded-t-xl relative animate-pulse" style={{ height: '50%' }}></div>
                ))
              ) : (
                dashboardData.trendChart.map((point, i) => {
                  const h = point.score || 10;
                  return (
                    <div key={i} className="w-12 flex flex-col items-center gap-2">
                      <div className="w-full bg-tertiary/10 rounded-t-xl relative group cursor-pointer" style={{ height: `${h}px` }}>
                        <div className={`absolute bottom-0 w-full bg-tertiary rounded-t-xl transition-all h-[${h - 20 > 0 ? h - 20 : 10}%] group-hover:h-[${h - 5}%]`}></div>
                      </div>
                      <span className="text-xs text-secondary">{point.day}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Captures */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-card rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex-1 overflow-hidden border-0 flex flex-col">
              <span className="font-label text-sm font-semibold text-secondary uppercase tracking-widest mb-6 block">Recent Laughter</span>
              <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar max-h-[220px]">
                {dashboardData.loading ? (
                  <div className="flex justify-center p-4">
                    <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                  </div>
                ) : !dashboardData.recentLaughs || dashboardData.recentLaughs.length === 0 ? (
                  <div className="text-center p-4 text-secondary text-sm">
                    No laughs yet — go score one!
                  </div>
                ) : (
                  dashboardData.recentLaughs.map((item, i) => {
                    const imgUrl = item.url || '';
                    const score = item.score !== null ? item.score : "?";

                    return (
                      <div key={i} className="flex items-center gap-4 p-2 hover:bg-surface-container rounded-xl transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-highest overflow-hidden shrink-0">
                          <img className="w-full h-full object-cover" src={imgUrl} alt="Capture" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-label text-sm font-semibold truncate">Laugh Capture</h4>
                          <p className="text-xs text-secondary">Recent</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-primary font-bold text-sm block">
                            {score}
                          </span>
                          <span className="text-[10px] text-secondary uppercase">Score</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <button className="w-full mt-auto pt-6 text-center text-primary font-label text-sm font-semibold hover:underline border-t border-surface-container-high">View History</button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
