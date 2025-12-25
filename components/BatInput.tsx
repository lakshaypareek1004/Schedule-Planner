import React, { useState } from 'react';
import { Terminal, Send, Activity } from 'lucide-react';

interface BatInputProps {
  onGenerate: (input: string) => Promise<void>;
  isLoading: boolean;
}

const BatInput: React.FC<BatInputProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input);
      setInput('');
    }
  };

  return (
    <div className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
      <div className="flex items-center gap-2 mb-2 text-cyan-500 font-mono-tech text-sm uppercase tracking-widest">
        <Terminal size={16} />
        <span>Mission Parameters Input</span>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter daily objectives (e.g., 'Study Math for 2 hours, Gym at 5pm, Read History')..."
          className="w-full bg-slate-950 text-slate-200 p-4 pr-12 rounded border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none h-32 resize-none font-mono placeholder-slate-600 transition-all"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute bottom-4 right-4 bg-cyan-900 hover:bg-cyan-700 text-cyan-100 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Activity className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
      <div className="mt-2 flex justify-between text-xs text-slate-500 font-mono-tech">
        <span>STATUS: {isLoading ? 'PROCESSING...' : 'AWAITING INPUT'}</span>
        <span>SYS.VER. 3.4.1</span>
      </div>
    </div>
  );
};

export default BatInput;