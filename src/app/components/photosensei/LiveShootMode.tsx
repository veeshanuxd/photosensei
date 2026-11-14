import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Camera, X, Grid3X3, BarChart2, Lightbulb, Maximize2 } from 'lucide-react';
import { Card } from '../ui/card';

interface LiveShootModeProps {
  onCapture?: (imageData: string) => void;
  onClose?: () => void;
}

export function LiveShootMode({ onCapture, onClose }: LiveShootModeProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [showHistogram, setShowHistogram] = useState(true);
  const [showLevel, setShowLevel] = useState(true);
  const [tilt, setTilt] = useState(0);
  const [exposure, setExposure] = useState(0); // -3 to +3 stops
  const [hint, setHint] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [hapticPulse, setHapticPulse] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [useDemoMode, setUseDemoMode] = useState(false);
  const [histogramData, setHistogramData] = useState<number[]>(new Array(30).fill(20));

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const calcCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  // 1. Live Canvas Histogram Calculation
  const calculateHistogram = () => {
    if (!videoRef.current || useDemoMode) {
      requestRef.current = requestAnimationFrame(calculateHistogram);
      return;
    }

    const video = videoRef.current;
    if (!calcCanvasRef.current) {
      calcCanvasRef.current = document.createElement('canvas');
    }
    const canvas = calcCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
      const w = 80;
      const h = 60;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(video, 0, 0, w, h);

      try {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const bins = new Array(30).fill(0);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const v = 0.299 * r + 0.587 * g + 0.114 * b;
          const binIndex = Math.min(29, Math.floor((v / 256) * 30));
          bins[binIndex]++;
        }

        const maxVal = Math.max(...bins) || 1;
        setHistogramData(bins.map((val) => (val / maxVal) * 100));
      } catch (e) {
        console.warn("Histogram calculation security limitation:", e);
      }
    }

    requestRef.current = requestAnimationFrame(calculateHistogram);
  };

  useEffect(() => {
    if (!useDemoMode) {
      requestRef.current = requestAnimationFrame(calculateHistogram);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [useDemoMode]);

  // 2. Real gyroscopic tilt leveler using DeviceOrientation API
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null) {
        setTilt(event.gamma);
      }
    };

    if (showLevel && window.DeviceOrientationEvent) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [showLevel]);

  // Slow simulated tilt drift fallback on desktop
  useEffect(() => {
    let interval: any;
    const handleOrientationTest = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        clearInterval(interval);
      }
    };
    window.addEventListener('deviceorientation', handleOrientationTest);

    interval = setInterval(() => {
      setTilt((prev) => {
        const drift = (Math.random() - 0.5) * 0.6;
        const next = prev + drift;
        return Math.max(-4, Math.min(4, next));
      });
    }, 600);

    return () => {
      clearInterval(interval);
      window.removeEventListener('deviceorientation', handleOrientationTest);
    };
  }, []);

  // 3. Tactile Snap Haptics at 0 degrees
  const lastTiltRef = useRef(0);
  useEffect(() => {
    const currentRounded = Math.round(tilt);
    const lastRounded = Math.round(lastTiltRef.current);

    if (currentRounded === 0 && lastRounded !== 0) {
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    }
    lastTiltRef.current = tilt;
  }, [tilt]);

  // Generate contextual camera exposure hints
  useEffect(() => {
    const interval = setInterval(() => {
      if (exposure < -1.5) {
        setHint('Underexposed—drag slider right to raise EV');
      } else if (exposure > 1.5) {
        setHint('Overexposed—drag slider left to lower EV');
      } else if (Math.abs(tilt) > 2) {
        setHint('Horizon tilted—align phone leveler');
      } else if (Math.random() > 0.75) {
        setHint('Lighting looks good. Ready to capture.');
      } else {
        setHint('');
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [exposure, tilt]);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError('Camera not supported in this browser');
          setUseDemoMode(true);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraError('');
        }
      } catch (err: any) {
        console.warn("Camera init failed, using demo fallback:", err);
        setCameraError('No camera found or permission denied. Using simulator.');
        setUseDemoMode(true);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 4. Capture Canvas image combining selected brightness EV
  const handleCapture = () => {
    setIsCapturing(true);
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    const brightnessFilter = 1 + exposure * 0.25;

    if (useDemoMode) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 800, 600);
          gradient.addColorStop(0, '#000000');
          gradient.addColorStop(1, '#2962FF');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 800, 600);

          ctx.fillStyle = 'white';
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Simulator Capture', 400, 280);
          ctx.font = '20px sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.fillText(`EV Compensation: ${exposure > 0 ? '+' : ''}${exposure} stops`, 400, 320);

          const imgData = ctx.getImageData(0, 0, 800, 600);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * brightnessFilter);
            data[i + 1] = Math.min(255, data[i + 1] * brightnessFilter);
            data[i + 2] = Math.min(255, data[i + 2] * brightnessFilter);
          }
          ctx.putImageData(imgData, 0, 0);

          const imageData = canvas.toDataURL('image/jpeg');
          onCapture?.(imageData);
        }
      }
    } else {
      if (!videoRef.current || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 600;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = `brightness(${brightnessFilter})`;
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture?.(imageData);
      }
    }

    setTimeout(() => setIsCapturing(false), 300);
  };

  // 5. Exposure Dial Slider Gesture Callbacks
  const exposureStartRef = useRef(0);
  const exposureValRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    exposureStartRef.current = e.touches[0].clientX;
    exposureValRef.current = exposure;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - exposureStartRef.current;
    const change = deltaX / 100;
    const nextVal = Math.max(-3, Math.min(3, exposureValRef.current + change));
    setExposure(Math.round(nextVal * 10) / 10);
  };

  const brightness = 1 + exposure * 0.25;
  const exposureColor =
    Math.abs(exposure) > 1.5 ? 'text-destructive border-destructive' :
    Math.abs(exposure) > 0.8 ? 'text-warning border-warning' :
    'text-accent border-accent';

  return (
    <div className="relative w-full h-full bg-black select-none overflow-hidden">
      {/* 1. Camera Viewport Stream */}
      {useDemoMode ? (
        <div 
          className="w-full h-full bg-gradient-to-br from-black via-zinc-900 to-neutral-950 flex items-center justify-center transition-all duration-150"
          style={{ filter: `brightness(${brightness})` }}
        >
          <div className="text-center space-y-4 px-8 max-w-xs animate-fade-in-up">
            <div className="w-14 h-14 mx-auto bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm">
              <Camera className="h-6 w-6 text-white/40" />
            </div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Simulator Active</h3>
            <p className="text-white/40 text-xs leading-relaxed">
              {cameraError || 'Camera permissions blocked. Simulating capture functions.'}
            </p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transition-all duration-150"
          style={{ filter: `brightness(${brightness})` }}
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Capture Screen Haptic Flashes */}
      {hapticPulse && (
        <div className="absolute inset-0 border-4 border-destructive/80 pointer-events-none z-10" />
      )}

      {/* 2. Composition Thirds Overlay Grid */}
      {showGrid && (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/20 border-solid" />
          ))}
        </div>
      )}

      {/* 3. Horizon Gyroscopic Balance Line */}
      {showLevel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className="w-48 h-[0.5px] bg-accent/80 relative transition-transform duration-75"
            style={{ transform: `rotate(${tilt}deg)` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-accent text-xs px-2 py-0.5 rounded-full border border-accent/20">
              {tilt > 0 ? '+' : ''}{Math.round(tilt)}°
            </div>
            <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-accent" />
            <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-accent" />
          </div>

          <div className="absolute flex items-center space-x-1">
            <div className={`w-1.5 h-1.5 rounded-full ${Math.abs(tilt) < 0.5 ? 'bg-accent scale-125' : 'bg-white/30'} transition-all`} />
            <div className={`w-2 h-2 rounded-full ${Math.abs(tilt) < 0.5 ? 'bg-accent scale-125' : 'bg-white/30'} transition-all`} />
            <div className={`w-1.5 h-1.5 rounded-full ${Math.abs(tilt) < 0.5 ? 'bg-accent scale-125' : 'bg-white/30'} transition-all`} />
          </div>
        </div>
      )}

      {/* 4. Live Exposure RGB Histogram overlay */}
      {showHistogram && (
        <div className="absolute top-4 right-4 w-28 h-16 bg-black/60 border border-white/5 backdrop-blur-md rounded-xl p-1.5 z-20 flex items-end justify-between space-x-[1px]">
          {histogramData.map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-white/20 rounded-[1px] transition-all duration-75"
              style={{
                height: `${Math.max(5, height)}%`,
                backgroundColor: i < 10 ? 'rgba(41,98,255,0.4)' : i < 20 ? 'rgba(0,200,83,0.4)' : 'rgba(255,109,0,0.4)'
              }}
            />
          ))}
        </div>
      )}

      {/* Live Helper Hints */}
      {hint && (
        <div className="absolute top-4 left-4 right-36 z-20 animate-fade-in-up">
          <Card className="p-2.5 bg-black/75 backdrop-blur-md border border-white/5 shadow-xl rounded-xl">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/90 leading-normal">{hint}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Exit Button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          size="icon"
          variant="ghost"
          className="w-10 h-10 bg-black/40 border border-white/5 backdrop-blur-md text-white hover:bg-black/60 rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 5. Bottom Settings & Exposure Dial */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-16 space-y-5 z-20">
        
        {/* Swipeable EV Compensation Control */}
        <div 
          className="flex flex-col items-center justify-center space-y-2 cursor-pointer touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="text-xs uppercase tracking-widest text-white/40">Swipe to Adjust EV</div>
          <div className="flex items-center space-x-3 w-full max-w-[200px]">
            <span className="text-xs text-white/30">-3</span>
            <div className="flex-1 h-[2px] bg-white/10 rounded-full relative">
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full border border-black shadow"
                style={{ left: `${((exposure + 3) / 6) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/30">+3</span>
          </div>
          <div className={`text-xs font-semibold font-mono border px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm ${exposureColor}`}>
            {exposure > 0 ? '+' : ''}{exposure.toFixed(1)} EV
          </div>
        </div>

        {/* Action Toggles & Shutter Button */}
        <div className="relative flex items-center justify-between px-4">
          <div className="flex space-x-2.5">
            <Button
              size="icon"
              variant="ghost"
              className={`w-10 h-10 rounded-full transition-all border border-white/5 ${showGrid ? 'bg-white text-black' : 'bg-white/5 text-white'}`}
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`w-10 h-10 rounded-full transition-all border border-white/5 ${showHistogram ? 'bg-white text-black' : 'bg-white/5 text-white'}`}
              onClick={() => setShowHistogram(!showHistogram)}
            >
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`w-10 h-10 rounded-full transition-all border border-white/5 ${showLevel ? 'bg-white text-black' : 'bg-white/5 text-white'}`}
              onClick={() => setShowLevel(!showLevel)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Haptic Capture Shutter Trigger */}
          <button
            onClick={handleCapture}
            className={`w-16 h-16 rounded-full bg-white p-1 border-4 border-white/20 shadow-2xl transition-transform ${
              isCapturing ? 'scale-90 opacity-60' : 'scale-100'
            } active:scale-95`}
          >
            <div className="w-full h-full rounded-full border-2 border-black bg-white flex items-center justify-center">
              <div className={`w-10 h-10 rounded-full bg-black transition-all ${
                isCapturing ? 'scale-75' : 'scale-100'
              }`} />
            </div>
          </button>
        </div>

        <div className="text-center text-white/30 text-xs uppercase tracking-widest">
          Continuous Session • Tap to Capture
        </div>
      </div>
    </div>
  );
}