import { useState } from 'react';
import Header from './components/Header';
import ScoreLaugh from './pages/ScoreLaugh';
import Leaderboard from './pages/Leaderboard';
import Results from './pages/Results';
import Login from './pages/Login';
import { HasyaProvider } from './context/HasyaContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div className="bg-background font-body text-on-background min-h-screen overflow-x-hidden">
      {currentPage !== 'login' && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      
      {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
      {currentPage === 'score' && <ScoreLaugh setCurrentPage={setCurrentPage} />}
      {currentPage === 'leaderboard' && <Leaderboard setCurrentPage={setCurrentPage} />}
      {currentPage === 'results' && <Results setCurrentPage={setCurrentPage} />}
    </div>
  );
}

function App() {
  return (
    <HasyaProvider>
      <AppContent />
    </HasyaProvider>
  );
}

export default App;

