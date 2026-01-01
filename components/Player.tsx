
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Channel, PlayerSettings } from '../types';
import { Signal, RefreshCw, AlertCircle } from 'lucide-react';

interface PlayerProps {
  channel: Channel;
  settings: PlayerSettings;
  onError: () => void;
  onSuccess: () => void;
}

export const Player: React.FC<PlayerProps> = ({ channel, settings, onError, onSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [hasSignal, setHasSignal] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  const initPlayer = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        maxBufferLength: settings.bufferSize === 'high' ? 30 : settings.bufferSize === 'medium' ? 15 : 5,
        enableWorker: true,
      });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
            console.log("Autoplay blocked");
        });
        setHasSignal(true);
        onSuccess();
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setHasSignal(false);
          onError();
          retry();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url;
      video.addEventListener('loadedmetadata', () => {
        video.play();
        setHasSignal(true);
        onSuccess();
      });
      video.addEventListener('error', () => {
        setHasSignal(false);
        onError();
      });
    }
  };

  const retry = () => {
    if (isRetrying) return;
    setIsRetrying(true);
    setTimeout(() => {
      initPlayer();
      setIsRetrying(false);
    }, 5000);
  };

  useEffect(() => {
    initPlayer();
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [channel, settings]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        className={`w-full h-full transition-all duration-700 ${
          settings.aspectRatio === 'fill' ? 'object-cover' : 'object-contain'
        } ${!hasSignal ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        playsInline
      />
      
      {!hasSignal && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="absolute inset-0 noise-bg pointer-events-none"></div>
          <div className="relative z-20 flex flex-col items-center animate-pulse">
            <div className="mb-6 p-6 rounded-full bg-white/10 backdrop-blur-md">
              <AlertCircle size={80} className="text-white/40" />
            </div>
            <h2 className="text-4xl font-light tracking-widest text-white/80 uppercase mb-2">Sem Sinal</h2>
            <p className="text-zinc-500 text-sm">Tentando reconectar automaticamente...</p>
            <button 
              onClick={initPlayer}
              className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full flex items-center space-x-3 transition-all border border-white/5 active:scale-95"
            >
              <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
              <span className="text-sm font-medium tracking-wide uppercase">Tentar Agora</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
