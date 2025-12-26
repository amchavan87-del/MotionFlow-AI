
import React from 'react';
import { GenerationMode } from '../types';

interface ResultViewProps {
  videoUrl: string;
  sourceImage?: string | null;
  mode: GenerationMode;
  dreamPrompt?: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ videoUrl, sourceImage, mode, dreamPrompt, onReset }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Synthesis Finalized</h2>
        <p className="text-slate-400">{mode === 'TRANSFER' ? 'Character performance synthesized.' : 'Dream sequence generated.'}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <div className="relative group rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-[0_0_50px_rgba(139,92,246,0.3)] min-h-[400px]">
            <video src={videoUrl} className="w-full max-h-[70vh] object-contain" controls autoPlay loop />
            <div className="absolute top-4 left-4">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                NEURAL RENDER
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className="p-6 glass rounded-2xl space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-widest text-slate-400">Input Signature</h4>
            {mode === 'TRANSFER' && sourceImage ? (
              <div className="aspect-square rounded-xl overflow-hidden border border-slate-700">
                <img src={sourceImage} className="w-full h-full object-cover" alt="Identity" />
              </div>
            ) : (
              <p className="text-sm text-slate-300 italic line-clamp-6">"{dreamPrompt}"</p>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Neural Confidence</span>
                <span className="text-emerald-400 font-bold">High</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-emerald-500"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a href={videoUrl} download="motionflow-export.mp4" className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export Video
            </a>
            <button onClick={onReset} className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700">
              New Sequence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
