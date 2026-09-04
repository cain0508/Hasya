import { useEffect } from 'react';
import { useHasya } from '../context/HasyaContext';

export default function Login({ setCurrentPage }) {
  const { setWallet } = useHasya();

  useEffect(() => {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    const particleCount = 12;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'joy-particle';
      const size = Math.random() * 200 + 100;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      
      container.appendChild(particle);
      particles.push({
          element: particle,
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: size
      });
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    let animationId;
    function animate() {
      particles.forEach(p => {
          // Natural drift
          p.x += p.vx;
          p.y += p.vy;

          // React to mouse
          const dx = mouseX - (p.x + p.size/2);
          const dy = mouseY - (p.y + p.size/2);
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 400) {
              const force = (400 - dist) / 400;
              p.x -= dx * force * 0.02;
              p.y -= dy * force * 0.02;
          }

          // Wrap around screen
          if (p.x < -p.size) p.x = window.innerWidth;
          if (p.x > window.innerWidth) p.x = -p.size;
          if (p.y < -p.size) p.y = window.innerHeight;
          if (p.y > window.innerHeight) p.y = -p.size;

          p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
      });
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      container.innerHTML = '';
    };
  }, []);

  const handleLogin = () => {
    // 🐴 ponytail: minimum that works, hardcode mock wallet
    setWallet('0x123...abc');
    setCurrentPage('score');
  };

  return (
    <div className="bg-background text-on-surface overflow-hidden min-h-screen font-body text-base relative">
      <style>{`
        .glass-card {
            background: rgba(243, 244, 245, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 8px 32px 0 rgba(112, 93, 0, 0.08);
        }

        .joy-particle {
            position: absolute;
            pointer-events: none;
            border-radius: 50%;
            background: radial-gradient(circle, #ffd700 0%, transparent 70%);
            opacity: 0.4;
            transition: transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);
            filter: blur(8px);
        }

        .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.02); opacity: 0.95; }
        }

        .btn-hover-lift {
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .btn-hover-lift:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 10px 20px -5px rgba(112, 93, 0, 0.3);
        }
      `}</style>

      {/* Interactive Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_#fff_0%,_#f3f4f5_100%)]">
        <div id="particle-container" className="absolute inset-0"></div>
        {/* Floating Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-container/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content Wrapper */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Brand Identity */}
        <div className="mb-16 text-center">
          <h1 className="font-display text-5xl font-extrabold text-primary tracking-tight mb-1 drop-shadow-sm">HASYA</h1>
          <p className="font-label text-xs text-secondary uppercase tracking-[0.2em]">Laugh-to-Earn Protocol</p>
        </div>

        {/* Login Card */}
        <div className="glass-card w-full max-w-[440px] rounded-[32px] p-6 md:p-10 flex flex-col items-center gap-6">
          <div className="text-center mb-2">
            <h2 className="font-display text-2xl font-bold text-on-surface mb-1">Unlock your Smile</h2>
            <p className="font-body text-base text-on-surface-variant">Earn your ETH by spreading joy.</p>
          </div>

          {/* Login Options */}
          <div className="w-full flex flex-col gap-2">
            {/* Primary Action: Wallet */}
            <button 
              onClick={handleLogin}
              className="btn-hover-lift w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              <span className="font-display text-[18px]">Connect Wallet</span>
            </button>
            <div className="relative w-full flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
              <span className="relative bg-surface px-3 text-xs font-label text-outline uppercase tracking-widest">or</span>
            </div>
            {/* Unique Feature: Login with Smile */}
            <button 
              onClick={handleLogin}
              className="btn-hover-lift w-full bg-surface-container-lowest border-2 border-primary/20 text-primary font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary/5 active:scale-95 transition-transform group"
            >
              <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">face</span>
              <span className="font-display text-[18px]">Login with Smile</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-variant overflow-hidden">
                <img className="w-full h-full object-cover" alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0H9KhYAe8sLItTEdlnIYRwK8BNPLWi-3it14_llv1wGeGvBEqCV0MXGMHJ5OgxF4J1AhCaEZnkvAF8efsMMX7-kn2JL7ROIUIgX08681-QOUn3CKoJHt01kSwDEeAcVXNb-Bf9FDI8P7nwXUJhxbiCK-FBVON6kIW6BL1VpItdcB3GBovJRvsN7_l3zhoKM9YJXMHKikk0OfhI8zk7d7Wtv1X8-kXZlObrv5PmZ5jCneJTGepqTm5" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-variant overflow-hidden">
                <img className="w-full h-full object-cover" alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUQeHKqejzPNaw6YqqLbf6Z_JsFUD_vh3w76UWHc1-DIIsYE4iIlESe9wg5aP0wWX4Yk4J-C0RyviEfwl0Hdk0yZsCxcmSV5zBQL-epj4P9cAGT57muITWol4zkKTl0DHFH5_LArmkMCkyTYbUBegcoEtdT1DBxhryGJnFIjDzzWLJ7hXcVFU6Um2Ooonahd3ZLneiYUCRVWII4QBzItKTU4nVbibDNaP0acuc_W-nB9jxHQWal6BO" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-variant overflow-hidden">
                <img className="w-full h-full object-cover" alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWh55E957Fe1tSMPmJRrXoCzySDye170vC-ENzCwIXHd61zaPMvboipwYxFPHd4bDVIOtI9-CVDpSt6SDRG74EThY9Y7WVHMbvEagRVxZz4Lt2Xel-g1LWZ-d_GXColqxAWJauaXhnvZThxmpo4iQNt1ieG7-J2xJ4Jh4VJ9RYYT4IEPbQ0Qy_p2m6nf47UOBzEEPdmTdDEuskQ-d903qPK6QtPTAdmFq37cVBcVS4dHQ2qwNSLq9T" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-primary-container flex items-center justify-center">
                <span className="text-on-primary-container font-label text-[10px] font-bold">+12k</span>
              </div>
            </div>
            <p className="font-label text-sm text-on-surface-variant">Join <span className="text-primary font-bold">12.4k students</span> earning joy daily.</p>
          </div>
        </div>

        {/* Secondary Imagery (Hidden on Mobile) */}
        <div className="hidden lg:block absolute left-16 bottom-16 max-w-xs p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 rotate-[-2deg]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-primary-container rounded-lg">
              <span className="material-symbols-outlined text-on-primary-container">trending_up</span>
            </div>
            <span className="font-label text-sm text-on-surface">Joy Yield</span>
          </div>
          <div className="h-12 w-full bg-surface-variant/30 rounded-lg overflow-hidden flex items-end">
            <div className="w-1/5 h-[40%] bg-primary/40 mx-[1px]"></div>
            <div className="w-1/5 h-[60%] bg-primary/50 mx-[1px]"></div>
            <div className="w-1/5 h-[85%] bg-primary/70 mx-[1px]"></div>
            <div className="w-1/5 h-[70%] bg-primary/60 mx-[1px]"></div>
            <div className="w-1/5 h-[100%] bg-primary mx-[1px]"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full z-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 py-6 max-w-[1200px] mx-auto gap-2">
          <p className="font-label text-xs text-secondary">
            © 2024 HASYA Protocol. Built for the next generation of joy.
          </p>
          <div className="flex gap-6">
            <a className="font-label text-xs text-secondary hover:text-primary transition-colors duration-200" href="#">Whitepaper</a>
            <a className="font-label text-xs text-secondary hover:text-primary transition-colors duration-200" href="#">Terms</a>
            <a className="font-label text-xs text-secondary hover:text-primary transition-colors duration-200" href="#">Privacy</a>
            <a className="font-label text-xs text-secondary hover:text-primary transition-colors duration-200" href="#">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
