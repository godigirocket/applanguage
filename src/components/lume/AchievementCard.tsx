import { Share2, Download, Trophy } from 'lucide-react';

interface AchievementCardProps {
  name: string;
  stats: {
    conversations: number;
    minutes: number;
    expressions: number;
  };
  onClose: () => void;
}

export function AchievementCard({ name, stats, onClose }: AchievementCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-[#F7F4EF] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
        {/* Top Decoration */}
        <div className="absolute top-0 inset-x-0 h-32 bg-terra opacity-10 blur-3xl -mt-16" />
        
        <div className="relative p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-terra/10 flex items-center justify-center mb-6">
            <Trophy className="text-terra" size={32} />
          </div>
          
          <h3 className="font-display text-2xl text-[#1C1C1A]">Weekly Achievement</h3>
          <p className="mt-2 text-[#6B6B63]">Beautiful progress, {name.split(' ')[0]}!</p>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-display text-terra">{stats.conversations}</p>
              <p className="text-[10px] uppercase tracking-wider text-[#6B6B63]">Convs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display text-terra">{stats.minutes}</p>
              <p className="text-[10px] uppercase tracking-wider text-[#6B6B63]">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display text-terra">{stats.expressions}</p>
              <p className="text-[10px] uppercase tracking-wider text-[#6B6B63]">Saved</p>
            </div>
          </div>
          
          <div className="mt-10 p-4 rounded-2xl bg-[#EFEFEA] border border-[#E0DDD6] text-left">
            <p className="text-xs italic text-[#1C1C1A]/70 leading-relaxed">
              "Lume is where I find my voice. Every conversation is a step closer to confidence."
            </p>
            <p className="mt-2 text-[10px] font-medium text-terra uppercase tracking-widest">— Practice with Lume</p>
          </div>
          
          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Lume Progress',
                    text: `I've practiced ${stats.minutes} minutes and saved ${stats.expressions} new expressions on Lume this week!`,
                    url: window.location.origin,
                  });
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-primary text-white text-sm font-medium hover:brightness-110 transition-all"
            >
              <Share2 size={16} /> Share
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-[#E0DDD6] text-sm font-medium hover:bg-[#EFEFEA] transition-all"
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="bg-[#EFEFEA] py-3 text-center border-t border-[#E0DDD6]">
          <p className="text-[10px] text-[#6B6B63] uppercase tracking-[0.2em]">Lume — AI Speaking Companion</p>
        </div>
      </div>
    </div>
  );
}
