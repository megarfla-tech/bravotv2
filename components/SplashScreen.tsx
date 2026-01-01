
import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    setOpacity(1);
    
    // Auto complete after 2 seconds
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 800);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 transition-opacity duration-1000" style={{ opacity }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tighter text-white mb-2">
          BRAVO<span className="text-red-600">TV</span>
        </h1>
        <p className="text-zinc-500 text-sm tracking-widest uppercase">The Premium Experience</p>
      </div>
      
      <div className="absolute bottom-12 flex space-x-2">
        <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};
