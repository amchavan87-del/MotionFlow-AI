
import React from 'react';
import { CinematicSettings, AspectRatio, ColorGrade, AtmosphericFX, VideoResolution } from '../types';

interface CinematicLabProps {
  settings: CinematicSettings;
  setSettings: (val: CinematicSettings) => void;
}

const CinematicLab: React.FC<CinematicLabProps> = ({ settings, setSettings }) => {
  return (
    <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-8 animate-in fade-in duration-1000">
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.509.553l-3.654-.365a.707.707 0 01-.639-.703V11.12a1 1 0 01.316-.725l1.39-1.391a2 2 0 00.586-1.414l.075-2.099a.5.5 0 01.501-.482l2.365.059a.5.5 0 01.446.307l.863 1.613a2 2 0 001.46 1.059l2.13.426a1 1 0 01.783.841l.243 1.343a2 2 0 001.125 1.543l2.03.903a.5.5 0 01.223.682l-.653 1.276a2 2 0 01-1.04.929z" /></svg>
        <h2 className="text-xl font-bold tracking-tight">Cinematic Lab</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Aspect Ratio */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Screen Format</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: '9:16', label: 'Vertical', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
              { id: '16:9', label: 'Landscape', icon: 'M7 4h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z' }
            ].map(ratio => (
              <button
                key={ratio.id}
                onClick={() => setSettings({ ...settings, aspectRatio: ratio.id as AspectRatio })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${settings.aspectRatio === ratio.id ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ratio.icon} /></svg>
                <span className="text-[10px] font-bold uppercase">{ratio.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Grading */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Color Grade</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: 'Flat', color: 'bg-slate-700' },
              { id: 'teal-orange', label: 'Hollywood', color: 'bg-orange-500' },
              { id: 'noir', label: 'Noir', color: 'bg-white' },
              { id: 'cyber', label: 'Neon', color: 'bg-pink-500' },
              { id: 'golden', label: 'Golden', color: 'bg-amber-400' }
            ].map(grade => (
              <button
                key={grade.id}
                onClick={() => setSettings({ ...settings, colorGrade: grade.id as ColorGrade })}
                className={`p-2 rounded-lg border text-[10px] font-bold transition-all truncate ${settings.colorGrade === grade.id ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-slate-800 bg-slate-950/50 text-slate-500'}`}
              >
                <div className={`w-full h-1 mb-1 rounded-full ${grade.color}`}></div>
                {grade.label}
              </button>
            ))}
          </div>
        </div>

        {/* FX */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Atmospheric FX</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: 'Clean' },
              { id: 'particles', label: 'Dust/Ember' },
              { id: 'mist', label: 'Mist/Fog' },
              { id: 'flares', label: 'Lens Flares' }
            ].map(fx => (
              <button
                key={fx.id}
                onClick={() => setSettings({ ...settings, fx: fx.id as AtmosphericFX })}
                className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${settings.fx === fx.id ? 'border-pink-500 bg-pink-500/10 text-pink-400' : 'border-slate-800 bg-slate-950/50 text-slate-500'}`}
              >
                {fx.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Resolution</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: '720p', label: '720p (Fast)' },
              { id: '1080p', label: '1080p (HQ)' }
            ].map(res => (
              <button
                key={res.id}
                onClick={() => setSettings({ ...settings, resolution: res.id as VideoResolution })}
                className={`p-2.5 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-between ${settings.resolution === res.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-950/50 text-slate-500'}`}
              >
                <span>{res.label}</span>
                {settings.resolution === res.id && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </button>
            ))}
            <div className="p-2 border border-slate-800/50 bg-slate-950/30 rounded-lg text-[9px] text-slate-600 italic">
              Note: 4K rendering is simulated via 1080p neural enhancement for speed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicLab;
