import { useState } from 'react';
import { useHasya } from '../context/HasyaContext';

export default function Leaderboard({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('global'); // 'global' (rewards) or 'college' (scores)
  const { leaderboardData: globalData, bestScoreLeaderboardData: bestScoreData, loadingLeaderboard: loading } = useHasya();

  const leaderboardData = activeTab === 'global' ? globalData : bestScoreData;

  const getTop3 = () => leaderboardData.slice(0, 3);
  const getRest = () => leaderboardData.slice(3);

  const top3 = getTop3();
  const rest = getRest();

  const getAvatar = (seed) => `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;

  return (
    <main className="pt-24 pb-16 px-6 max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10">
      {/* Sidebar Shell */}
      <aside className="hidden md:flex flex-col h-[calc(100vh-120px)] w-64 border-r border-outline-variant p-6 gap-2 shrink-0 sticky top-24">
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-primary">Hasya</p>
              <p className="font-label text-sm text-secondary opacity-70">Laugh-to-Earn</p>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all">
            <span className="material-symbols-outlined">rocket_launch</span>
            <span className="font-label text-sm">Mission</span>
          </button>
          <button 
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all"
            onClick={() => setCurrentPage('results')}
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span className="font-label text-sm">Dashboard</span>
          </button>
          <button 
            className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-xl font-bold transition-all"
            onClick={() => setCurrentPage('leaderboard')}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>emoji_events</span>
            <span className="font-label text-sm">Leaderboard</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="font-label text-sm">Wallet</span>
          </button>
        </nav>
        
        <button 
          className="mt-auto w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95"
          onClick={() => setCurrentPage('score')}
        >
          <span className="material-symbols-outlined">sentiment_very_satisfied</span>
          Start Laughing
        </button>
      </aside>

      {/* Content Canvas */}
      <div className="flex-1 space-y-10">
        {/* Header & Tabs */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl text-primary tracking-tight font-extrabold">On-Chain Joy Board</h1>
              <p className="text-lg text-secondary mt-2">Fueling the world's happiness, block by block.</p>
            </div>
            
            <div className="flex p-1 bg-surface-container-high rounded-2xl">
              <button 
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'global' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}
                onClick={() => setActiveTab('global')}
              >
                Global Rewards
              </button>
              <button 
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'college' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}
                onClick={() => setActiveTab('college')}
              >
                Best Scores
              </button>
            </div>
          </div>

          {/* Top 3 Podium */}
          {!loading && leaderboardData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
              
              {/* Silver (Rank 2) */}
              {top3[1] && (
                <div className="order-2 md:order-1 glass-card p-6 rounded-[32px] flex flex-col items-center text-center top-3-hover cursor-pointer border-t-4 border-slate-300">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-200 overflow-hidden bg-slate-50">
                      <img className="w-full h-full object-cover" src={getAvatar(top3[1][1])} alt="Avatar" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-on-surface">2</div>
                  </div>
                  <p className="font-display text-xl text-on-surface font-bold truncate w-full px-2" title={top3[1][1]}>{top3[1][1].slice(0, 10)}...</p>
                  <p className="text-sm text-secondary mb-6">Global User</p>
                  <div className="flex justify-center w-full mt-auto pt-6 border-t border-outline-variant">
                    <div>
                      <p className="text-xs font-bold text-primary">{activeTab === 'global' ? 'REWARD' : 'SCORE'}</p>
                      <p className="text-2xl text-primary font-bold">{top3[1][2]}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gold (Rank 1) */}
              {top3[0] && (
                <div className="order-1 md:order-2 glass-card p-6 rounded-[32px] flex flex-col items-center text-center top-3-hover cursor-pointer border-t-8 border-primary-container relative overflow-hidden md:scale-105 z-10 shadow-lg">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                  </div>
                  <div className="relative mb-4">
                    <div className="w-28 h-28 rounded-full border-4 border-primary-container overflow-hidden bg-primary-container/10">
                      <img className="w-full h-full object-cover" src={getAvatar(top3[0][1])} alt="Avatar" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary-container w-10 h-10 rounded-full flex items-center justify-center font-bold text-on-primary-container text-lg">1</div>
                  </div>
                  <p className="font-display text-2xl text-primary font-extrabold truncate w-full px-2" title={top3[0][1]}>{top3[0][1].slice(0, 10)}...</p>
                  <p className="text-sm text-secondary mb-6">Champion</p>
                  <div className="flex justify-center w-full mt-auto pt-6 border-t border-outline-variant">
                    <div>
                      <p className="text-xs font-bold text-primary">{activeTab === 'global' ? 'REWARD' : 'SCORE'}</p>
                      <p className="text-3xl text-primary font-extrabold">{top3[0][2]}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bronze (Rank 3) */}
              {top3[2] && (
                <div className="order-3 glass-card p-6 rounded-[32px] flex flex-col items-center text-center top-3-hover cursor-pointer border-t-4 border-orange-300">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full border-4 border-orange-200 overflow-hidden bg-orange-50">
                      <img className="w-full h-full object-cover" src={getAvatar(top3[2][1])} alt="Avatar" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-orange-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-on-surface">3</div>
                  </div>
                  <p className="font-display text-xl text-on-surface font-bold truncate w-full px-2" title={top3[2][1]}>{top3[2][1].slice(0, 10)}...</p>
                  <p className="text-sm text-secondary mb-6">Global User</p>
                  <div className="flex justify-center w-full mt-auto pt-6 border-t border-outline-variant">
                    <div>
                      <p className="text-xs font-bold text-primary">{activeTab === 'global' ? 'REWARD' : 'SCORE'}</p>
                      <p className="text-2xl text-primary font-bold">{top3[2][2]}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </section>

        {/* Leaderboard Table */}
        <section className="glass-card rounded-[32px] overflow-hidden">
          <div className="px-6 py-6 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-display text-2xl font-bold text-on-surface">Rankings</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
              <input 
                className="pl-10 pr-6 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary-container outline-none" 
                placeholder="Find a user..." 
                type="text"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-secondary uppercase tracking-wider bg-surface-container-lowest">
                  <th className="px-6 py-4 font-semibold">Rank</th>
                  <th className="px-6 py-4 font-semibold">User Wallet</th>
                  <th className="px-6 py-4 font-semibold text-right">{activeTab === 'global' ? 'Reward' : 'Score'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-secondary">
                      <span className="material-symbols-outlined animate-spin text-3xl">refresh</span>
                    </td>
                  </tr>
                ) : leaderboardData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-secondary">No data found.</td>
                  </tr>
                ) : (
                  rest.map((row, index) => (
                    <tr key={index} className="hover:bg-primary-container/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-bold text-secondary">#{row[0]}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img className="w-8 h-8 rounded-full bg-surface-container" src={getAvatar(row[1])} alt="Avatar" />
                          <span className="font-bold text-on-surface group-hover:text-primary transition-colors font-mono text-sm">{row[1]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary">
                        {row[2]}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
