import { useState, useRef, useCallback, useEffect } from 'react';
import { scoreLaugh } from '../api/gradioClient';
import { useHasya } from '../context/HasyaContext';

const DEFAULT_PREVIEW = "https://lh3.googleusercontent.com/aida-public/AB6AXuCyWsg6SpYkLfbWNZd4tfFv4-zFo7vTQGRltodwCxaXaHDpivXN0XYnM18-E-TQ56dk_PMtZk1BcW_69lSlpCuSeHRLmMXZrqBDgVaiHh91lvJ9M4HUYArjsHPHzX6RSZkjhMjhdZlU3CXdY97qz-mevtusbhT7iByHpIzWC8LOLfgIB6gO4CXyrFmDEZShkBCL4Hy9SEhTzUCAYjeEgshP01G97yzcfhJNoyzK3_noAM3wEoYAE3x4";

export default function ScoreLaugh({ setCurrentPage }) {
  const { wallet, setLatestScore, updateLeaderboards, pendingImage, setPendingImage } = useHasya();
  
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_PREVIEW);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  //  Camera state 
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Auto-submit pending image if coming back from login
  useEffect(() => {
    if (wallet && pendingImage) {
      setImage(pendingImage);
      setPreviewUrl(URL.createObjectURL(pendingImage));
      setPendingImage(null);
      
      const submitPending = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await scoreLaugh(pendingImage, wallet);
          setResult(res);
          setLatestScore(res);
          updateLeaderboards();
        } catch (err) {
          console.error(err);
          setError("Failed to score laugh. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      submitPending();
    }
  }, [wallet, pendingImage, setLatestScore, updateLeaderboards, setPendingImage]);

  // Start the webcam stream
  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
        };
      }
      setCameraActive(true);
      // Clear any previously selected file
      setImage(null);
      setResult(null);
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera access denied. Please allow camera permissions and try again.');
    }
  }, []);

  // Stop the webcam stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraReady(false);
  }, []);

  // Snap a photo from the webcam
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    // Mirror horizontally so selfie looks natural
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setImage(file);
        setPreviewUrl(URL.createObjectURL(blob));
        setResult(null);
        stopCamera();
      }
    }, 'image/jpeg', 0.92);
  }, [stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      stopCamera();
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
      setResult(null);
    }
  };

  const handleScore = async () => {
    if (!image) {
      // If no image is selected yet, trigger file picker instead
      fileInputRef.current?.click();
      return;
    }
    
    // 🐴 ponytail: redirect to login if no wallet, store pending image to auto-submit later
    if (!wallet) {
      setPendingImage(image);
      setCurrentPage('login');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await scoreLaugh(image, wallet);
      setResult(res);
      setLatestScore(res);
      
      // Fire and forget leaderboard refresh so it's ready when user navigates
      updateLeaderboards();
    } catch (err) {
      console.error(err);
      setError("Failed to score laugh. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    stopCamera();
    setImage(null);
    setResult(null);
    setError(null);
    setPreviewUrl(DEFAULT_PREVIEW);
  };
//CODE FOR GETTING AUTHENTICITY OF THE PHOTO UPLOADED
  const getMetric = (index, fallbackLabel, fallbackValue) => {
    if (!result || !result.components) return { label: fallbackLabel, value: fallbackValue };
    const entries = Object.entries(result.components);
    if (entries.length > index) {
      return { 
        label: entries[index][0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
        value: typeof entries[index][1] === 'number' ? Math.round(entries[index][1] <= 1 ? entries[index][1] * 100 : entries[index][1]) : fallbackValue
      };
    }
    return { label: fallbackLabel, value: fallbackValue };
  };

  return (
    <>
      <main className="pt-24 pb-12 px-6 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
        {/* Left Column: Camera Viewfinder */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative w-full aspect-[4/3] bg-surface-dim rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
            {/* Viewfinder: either live camera or static preview */}
            <div className="absolute inset-0 z-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                style={{ transform: 'scaleX(-1)' }}
              />
              <img 
                className={`w-full h-full object-cover ${cameraActive ? 'hidden' : 'block'}`}
                alt="Viewfinder" 
                src={previewUrl}
              />
            </div>
            
            {/* Hidden canvas for capturing webcam frames */}
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 camera-overlay pointer-events-none"></div>
            
            {loading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary-container/60 rounded-3xl flex items-center justify-center z-10">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary-container rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary-container rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary-container rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary-container rounded-br-xl"></div>
                <div className="scan-effect w-full h-0.5 bg-primary-container/40 blur-sm"></div>
              </div>
            )}
            
            {/* Status badge */}
            <div className="absolute top-6 left-6 flex flex-col gap-1 z-10">
              <div className="bg-black/30 backdrop-blur-md text-white px-6 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  loading ? 'bg-error animate-pulse' 
                  : cameraActive ? 'bg-green-400 animate-pulse' 
                  : image ? 'bg-primary' 
                  : 'bg-white/50'
                }`}></span>
                {loading ? 'REC • AI ANALYZING' 
                 : cameraActive ? 'CAMERA LIVE' 
                 : image ? 'READY' 
                 : 'STANDBY'}
              </div>
            </div>
            
            <div className="absolute top-6 right-6 z-10">
              <div className="glass-card px-6 py-1 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>mood</span>
                <span className="font-label text-sm font-bold text-primary">TRACKING JOY</span>
              </div>
            </div>
            
            {/* Smile meter (hidden when camera is live) */}
            {!cameraActive && (
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1 z-10">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-white font-bold drop-shadow-md text-xl">SMILE METER</span>
                  <span className="text-primary-container font-extrabold text-xl">
                    {result ? `${Math.round(result.score <= 1 ? result.score * 100 : result.score)}%` : (image ? '?' : '94%')}
                  </span>
                </div>
                <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full smile-meter-gradient transition-all duration-300 ease-out" 
                    style={{width: result ? `${result.score <= 1 ? result.score * 100 : result.score}%` : (image ? '0%' : '94%')}}
                  ></div>
                </div>
              </div>
            )}

            {/* Shutter overlay when camera is live */}
            {cameraActive && cameraReady && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                <button
                  className="w-20 h-20 rounded-full bg-white/90 border-4 border-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                  onClick={capturePhoto}
                >
                  <div className="w-16 h-16 rounded-full border-4 border-primary"></div>
                </button>
              </div>
            )}
          </div>
          
          {/* Control bar */}
          <div className="flex justify-center items-center gap-10 py-2">
            {/* Gallery / file upload */}
            <button 
              className="w-16 h-16 rounded-full border-2 border-outline flex items-center justify-center text-secondary hover:bg-surface-container-high transition-all"
              onClick={() => { stopCamera(); fileInputRef.current?.click(); }}
            >
              <span className="material-symbols-outlined scale-125">photo_library</span>
            </button>

            {/* Camera toggle / Score button */}
            {cameraActive ? (
              // While camera is live, the center button snaps a photo
              <button 
                className="w-24 h-24 rounded-full bg-white border-4 border-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group"
                onClick={capturePhoto}
              >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined !text-[48px] text-on-primary group-hover:scale-110 transition-transform" style={{fontVariationSettings: "'FILL' 1"}}>photo_camera</span>
                </div>
              </button>
            ) : (
              // When camera is off, center button scores or opens file picker
              <button 
                className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg hover:scale-105 active:scale-95 transition-all group"
                onClick={handleScore}
                disabled={loading}
              >
                <div className="w-20 h-20 rounded-full border-4 border-on-primary/30 flex items-center justify-center">
                  {loading ? (
                    <span className="material-symbols-outlined !text-[48px] animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined !text-[48px] group-hover:scale-110 transition-transform" style={{fontVariationSettings: "'FILL' 1"}}>add_a_photo</span>
                  )}
                </div>
              </button>
            )}

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {/* Camera toggle / Reset */}
            {cameraActive ? (
              // Close camera
              <button 
                className="w-16 h-16 rounded-full border-2 border-error/50 flex items-center justify-center text-error hover:bg-error/10 transition-all"
                onClick={stopCamera}
              >
                <span className="material-symbols-outlined scale-125">close</span>
              </button>
            ) : (
              // Open camera
              <button 
                className="w-16 h-16 rounded-full border-2 border-outline flex items-center justify-center text-secondary hover:bg-surface-container-high transition-all"
                onClick={startCamera}
                title="Open camera"
              >
                <span className="material-symbols-outlined scale-125">videocam</span>
              </button>
            )}
          </div>

          {/* Reset button row (only when we have an image or result) */}
          {(image || result) && !cameraActive && (
            <div className="flex justify-center">
              <button
                className="flex items-center gap-2 text-secondary hover:text-primary font-label text-sm font-semibold transition-colors"
                onClick={handleReset}
              >
                <span className="material-symbols-outlined text-base">autorenew</span>
                Reset &amp; Try Again
              </button>
            </div>
          )}

          {error && <div className="text-center text-error font-medium">{error}</div>}
        </section>

        {/* Right Column: Results & Analytics */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-[24px] p-6 shadow-lg flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-on-surface">Authenticity Breakdown</h2>
              <span className="material-symbols-outlined text-primary">verified</span>
            </div>
            
            <div className="space-y-4">
              {[
                getMetric(0, "Micro-expression Match", 98),
                getMetric(1, "Eye Crinkle Intensity", 89),
                getMetric(2, "Genuine Spark", 95)
              ].map((metric, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-secondary">{metric.label}</span>
                    <span className="font-bold text-on-surface">{metric.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{width: `${metric.value}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-2 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 italic text-base text-on-surface-variant">
              {result?.tier ? `You achieved a ${result.tier} tier smile! This session confirmed your joy on the blockchain.` : `"Your Duchenne smile shows deep neurological engagement. This session boosted your serotonin score by 12%."`}
            </div>
          </div>

          <div className={`bg-primary-container rounded-[24px] p-10 shadow-xl border-2 border-primary/20 relative overflow-hidden flex flex-col items-center text-center gap-3 transform transition-all duration-700 ${result ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-50'}`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 rotate-45 -translate-y-full animate-[shimmer_3s_infinite]"></div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-2 z-10">
              <span className="material-symbols-outlined text-primary !text-[40px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            </div>
            <h3 className="font-display text-3xl font-bold text-on-primary-container z-10">
              {result ? `Authenticity: ${Math.round(result.score <= 1 ? result.score * 100 : result.score)}%` : 'Authenticity: --%'}
            </h3>
            <p className="font-body text-lg text-on-primary-container/80 z-10">Proof of Joy validated on HASYA Protocol.</p>
            
            <div className="mt-6 bg-white/40 backdrop-blur-sm px-10 py-3 rounded-2xl border border-white/40 z-10 w-full">
              <span className="text-sm block text-primary font-bold uppercase tracking-widest">Reward Claimed</span>
              <span className="font-display text-4xl font-extrabold text-on-primary-container">
                {result?.payout?.reward ? result.payout.reward : (result ? '0.000 ETH' : '-- ETH')}
              </span>
            </div>
            
            <button 
              className="mt-6 w-full bg-on-primary-container text-white font-bold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all z-10 disabled:opacity-50"
              onClick={() => setCurrentPage('leaderboard')}
              disabled={!result}
            >
              View on Leaderboard
            </button>
          </div>
        </section>
      </main>
      
      <footer className="bg-surface-container-highest w-full py-16 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 max-w-[1200px] mx-auto gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <h4 className="font-display text-2xl font-bold text-on-surface">HASYA</h4>
            <p className="text-sm text-secondary">© 2024 HASYA Protocol. Built for the next generation of joy.</p>
          </div>
          <div className="flex gap-10">
            <a className="text-sm font-semibold text-secondary hover:text-primary transition-colors" href="#">Whitepaper</a>
            <a className="text-sm font-semibold text-secondary hover:text-primary transition-colors" href="#">Terms</a>
            <a className="text-sm font-semibold text-secondary hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="text-sm font-semibold text-secondary hover:text-primary transition-colors" href="#">Discord</a>
          </div>
        </div>
      </footer>
    </>
  );
}
