import { useHasya } from '../context/HasyaContext';

export default function Header({ currentPage, setCurrentPage }) {
  const { wallet, setWallet } = useHasya();

  // Deterministic avatar index based on wallet address
  // Currently N=1 because we only have a placeholder avatar
  const numAvatars = 1;
  const avatarIndex = wallet && wallet.length > 10
    ? (parseInt(wallet.slice(2, 10), 16) || 0) % numAvatars
    : 0;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md shadow-sm h-16">
      <div className="flex justify-between items-center px-6 py-2 max-w-[1200px] mx-auto h-full">

        <div
          className="font-display text-2xl font-extrabold text-[#705d00] tracking-tight scale-95 active:scale-90 transition-transform cursor-pointer"
          onClick={() => setCurrentPage('score')}
        >
          HASYA
        </div>

        <div className="hidden md:flex gap-10 items-center">
          <button
            className={`font-medium transition-colors duration-200 ${currentPage === 'score' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
            onClick={() => setCurrentPage('score')}
          >
            Score a Laugh
          </button>
          <button
            className={`font-medium transition-colors duration-200 ${currentPage === 'results' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
            onClick={() => setCurrentPage('results')}
          >
            Dashboard
          </button>
          <button
            className={`font-medium transition-colors duration-200 ${currentPage === 'leaderboard' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
            onClick={() => setCurrentPage('leaderboard')}
          >
            Leaderboard
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-primary px-3 py-1.5 hover:bg-primary-container/20 rounded-full transition-all flex items-center gap-2 border border-outline/20">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="font-label text-sm bg-transparent outline-none w-24 sm:w-[120px] ml-1 text-on-surface"
              placeholder="0x..."
              title="Edit Wallet Address"
            />
          </div>
          <button className="material-symbols-outlined text-primary p-2 hover:bg-primary-container/20 rounded-full transition-all">
            notifications
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container ml-2">
            <img
              className="w-full h-full object-cover bg-white"
              alt="Profile avatar"
              src={`/avatars/avatar-${avatarIndex}.svg`}
            />
          </div>
        </div>

      </div>
    </header>
  );
}
