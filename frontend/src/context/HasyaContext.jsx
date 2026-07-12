import { createContext, useContext, useState, useEffect } from 'react';
import { refreshLeaderboard, refreshBestScoreLeaderboard } from '../api/gradioClient';

const HasyaContext = createContext();

export function useHasya() {
  return useContext(HasyaContext);
}

export function HasyaProvider({ children }) {
  const [wallet, setWallet] = useState('0x123...abc'); // Mock wallet or connect to web3
  const [latestScore, setLatestScore] = useState(null); // Result of the most recent score_laugh
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [bestScoreLeaderboardData, setBestScoreLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Auto-refresh leaderboards periodically or when explicitly called
  const updateLeaderboards = async () => {
    setLoadingLeaderboard(true);
    try {
      const globalData = await refreshLeaderboard();
      setLeaderboardData(globalData || []);
      
      const bestData = await refreshBestScoreLeaderboard();
      setBestScoreLeaderboardData(bestData || []);
    } catch (err) {
      console.error("Failed to fetch leaderboards:", err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    updateLeaderboards();
  }, []);

  const value = {
    wallet,
    setWallet,
    latestScore,
    setLatestScore,
    leaderboardData,
    bestScoreLeaderboardData,
    loadingLeaderboard,
    updateLeaderboards
  };

  return (
    <HasyaContext.Provider value={value}>
      {children}
    </HasyaContext.Provider>
  );
}
