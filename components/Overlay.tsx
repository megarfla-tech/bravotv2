
import React, { useState, useEffect } from 'react';
import { Channel } from '../types';
import { Wifi, Clock } from 'lucide-react';

interface OverlayProps {
  channel: Channel;
  visible: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({ channel, visible }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Top Left: Channel Number & Logo */}
      <div className="absolute top-10 left-10 flex items-start space-x-6 animate-slide-in-left">
        <div className="flex flex-col items-center">
          <span className="text-7xl font-bold leading-none tracking-tighter drop-shadow-2xl">
            {channel.number}
          </span>
          <div className="w-12 h-1 bg-white/80 mt-2 rounded-full shadow-lg"></div>
        </div>
        <div className="mt-2 flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
            <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight drop-shadow-md">{channel.name}</span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">{channel.group}</span>
          </div>
        </div>
      </div>

      {/* Top Right: Clock */}
      <div className="absolute top-10 right-10 flex items-center space-x-3 bg-black/30 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/5 animate-fade-in">
        <Clock size={16} className="text-zinc-400" />
        <span className="text-xl font-medium tracking-tight">{currentTime}</span>
      </div>

      {/* Bottom: Channel Info Bar */}
      <div className="absolute bottom-10 left-10 right-10 animate-slide-in-bottom">
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <span className="px-2 py-0.5 bg-red-600 text-[10px] font-bold uppercase rounded-sm">Live</span>
                <span className="text-lg font-medium text-white/90">{channel.epgCurrent}</span>
              </div>
              <p className="text-sm text-zinc-400">Próximo: {channel.epgNext}</p>
            </div>
            
            <div className="flex items-center space-x-6 ml-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase text-zinc-500 font-bold mb-1 tracking-wider">Qualidade</span>
                <span className="text-sm font-bold text-green-400">FULL HD</span>
              </div>
              <div className="flex items-center space-x-2">
                 <Wifi size={18} className="text-green-500" />
                 <div className="flex space-x-1 items-end h-4">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <div className="w-1 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-white/5">
            <div className="h-full w-[35%] bg-white/30 rounded-r-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
