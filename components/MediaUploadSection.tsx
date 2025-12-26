
import React from 'react';
import { MediaInput, GenerationMode } from '../types';

interface MediaUploadSectionProps {
  mode: GenerationMode;
  sourceImage: MediaInput;
  setSourceImage: (val: MediaInput) => void;
  refVideo: MediaInput;
  setRefVideo: (val: MediaInput) => void;
  dreamPrompt: string;
  setDreamPrompt: (val: string) => void;
  onStart: () => void;
  isProcessing: boolean;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  mode,
  sourceImage,
  setSourceImage,
  refVideo,
  setRefVideo,
  dreamPrompt,
  setDreamPrompt,
  onStart,
  isProcessing
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      const preview = URL.createObjectURL(file);
      if (type === 'image') setSourceImage({ file, preview, base64 });
      else setRefVideo({ file, preview, base64 });
    };
    reader.readAsDataURL(file);
  };

  const isReady = mode === 'TRANSFER' ? (sourceImage.file && refVideo.file) : dreamPrompt.trim().length > 0;

  return (
    <div className="space-y-8">
      {mode === 'TRANSFER' ? (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
          {/* Source Image */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Target Identity</h3>
            <label className={`relative group block h-80 rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer ${sourceImage.preview ? 'border-transparent' : 'border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
              {sourceImage.preview ? (
                <img src={sourceImage.preview} className="w-full h-full object-cover" alt="Source" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
                  <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="font-medium text-slate-300">Target Identity (Image)</span>
                </div>
              )}
            </label>
          </div>
          {/* Reference Video */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Motion Reference</h3>
            <label className={`relative group block h-80 rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer ${refVideo.preview ? 'border-transparent' : 'border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/5'}`}>
              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} />
              {refVideo.preview ? (
                <video src={refVideo.preview} className="w-full h-full object-cover" autoPlay loop muted />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
                  <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span className="font-medium text-slate-300">Reference Motion (Video)</span>
                </div>
              )}
            </label>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Visual Script</h3>
            <textarea 
              value={dreamPrompt}
              onChange={(e) => setDreamPrompt(e.target.value)}
              placeholder="Describe your cinematic sequence... (e.g., A futuristic robot exploring a neon jungle, high-speed camera chase)"
              className="w-full h-48 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-xl text-slate-200 placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all resize-none"
            />
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={onStart}
          disabled={!isReady || isProcessing}
          className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl flex items-center justify-center gap-3 ${
            isReady && !isProcessing 
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-[1.01] active:scale-[0.99] text-white cursor-pointer' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Neural Synthesis Active...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
              Generate Cinematic Video
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MediaUploadSection;
