
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Channel, AppState, PlayerSettings } from './types';
import { fetchPlaylist } from './services/iptvService';
import { SplashScreen } from './components/SplashScreen';
import { Player } from './components/Player';
import { Overlay } from './components/Overlay';
import { MiniGuide } from './components/MiniGuide';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);
  const [settings, setSettings] = useState<PlayerSettings>({
    aspectRatio: 'fit',
    bufferSize: 'medium',
    quality: 'auto'
  });

  const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showOverlay = useCallback(() => {
    setOverlayVisible(true);
    if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
    overlayTimeoutRef.current = setTimeout(() => {
      setOverlayVisible(false);
    }, 5000);
  }, []);

  const changeChannel = useCallback((direction: 'up' | 'down') => {
    if (channels.length === 0) return;
    
    setCurrentIndex(prev => {
      let nextIndex = prev + (direction === 'up' ? -1 : 1);
      if (nextIndex < 0) nextIndex = channels.length - 1;
      if (nextIndex >= channels.length) nextIndex = 0;
      return nextIndex;
    });
    showOverlay();
  }, [channels.length, showOverlay]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPlaylist();
      if (data && data.length > 0) {
        setChannels(data);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (appState === AppState.SPLASH) return;

      switch (e.key) {
        case 'ArrowUp':
          if (guideVisible) {
            setCurrentIndex(p => Math.max(0, p - 1));
          } else {
            changeChannel('up');
          }
          break;
        case 'ArrowDown':
          if (guideVisible) {
            setCurrentIndex(p => Math.min(channels.length - 1, p + 1));
          } else {
            changeChannel('down');
          }
          break;
        case 'ArrowLeft':
          setGuideVisible(true);
          break;
        case 'ArrowRight':
          setGuideVisible(false);
          break;
        case 'Enter':
          if (guideVisible) {
            setGuideVisible(false);
            showOverlay();
          } else {
            showOverlay();
          }
          break;
        case 'Escape':
        case 'Backspace':
          setGuideVisible(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, changeChannel, guideVisible, channels.length, showOverlay]);

  if (appState === AppState.SPLASH) {
    return <SplashScreen onComplete={() => setAppState(AppState.PLAYER)} />;
  }

  const currentChannel = channels[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden"
      onMouseMove={() => !guideVisible && showOverlay()}
      onClick={() => !guideVisible && showOverlay()}
    >
      {currentChannel ? (
        <>
          <Player 
            channel={currentChannel} 
            settings={settings}
            onError={() => {}}
            onSuccess={() => {}}
          />
          <Overlay 
            channel={currentChannel} 
            visible={overlayVisible && !guideVisible} 
          />
          <MiniGuide 
            channels={channels} 
            currentIndex={currentIndex} 
            onSelect={(idx) => {
              setCurrentIndex(idx);
              setGuideVisible(false);
              showOverlay();
            }} 
            visible={guideVisible} 
          />
          {/* Efeito de transição suave ao trocar de canal */}
          <div 
            key={currentChannel.id} 
            className="fixed inset-0 bg-black pointer-events-none z-50 animate-zapping"
          ></div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 animate-pulse bg-black">
          <h2 className="text-2xl font-bold tracking-[0.3em] uppercase mb-4">BRAVO TV</h2>
          <span className="text-xs uppercase tracking-widest font-light">Sintonizando canais...</span>
        </div>
      )}
    </div>
  );
};

export default App;
