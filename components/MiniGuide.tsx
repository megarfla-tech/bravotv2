
import React from 'react';
import { Channel } from '../types';
import { Search } from 'lucide-react';

interface MiniGuideProps {
  channels: Channel[];
  currentIndex: number;
  onSelect: (index: number) => void;
  visible: boolean;
}

export const MiniGuide: React.FC<MiniGuideProps> = ({ channels, currentIndex, onSelect, visible }) => {
  return (
    <div className={`fixed inset-y-0 left-0 w-96 bg-black/80 backdrop-blur-2xl border-r border-white/10 z-40 transition-transform duration-300 shadow-2xl overflow-hidden flex flex-col ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 border-b border-white/5">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Bravo Guide</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar canal ou número..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-white/20 transition-all"
            readOnly
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
        {channels.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => onSelect(idx)}
            className={`w-full flex items-center p-3 rounded-xl transition-all group ${
              idx === currentIndex 
                ? 'bg-white text-black shadow-xl scale-[1.02]' 
                : 'hover:bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <span className={`text-lg font-bold w-10 shrink-0 ${idx === currentIndex ? 'text-black' : 'text-zinc-600'}`}>
              {ch.number}
            </span>
            <div className={`w-10 h-10 rounded-lg overflow-hidden p-1 mr-4 flex items-center justify-center shrink-0 ${idx === currentIndex ? 'bg-black/5' : 'bg-white/5'}`}>
              <img src={ch.logo} alt={ch.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-start overflow-hidden">
              <span className="font-bold truncate w-full text-left">{ch.name}</span>
              <span className={`text-[10px] uppercase tracking-wider font-medium truncate ${idx === currentIndex ? 'text-black/60' : 'text-zinc-500'}`}>
                {ch.group}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="p-6 bg-white/5 text-center text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
        Setas: Mudar | OK: Confirmar
      </div>
    </div>
  );
};
