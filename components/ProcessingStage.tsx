
import React from 'react';
import { AppState, ProcessingLog } from '../types';

interface ProcessingStageProps {
  appState: AppState;
  logs: ProcessingLog[];
  sourceImage: string;
  refVideo: string;
}

const ProcessingStage: React.FC<ProcessingStageProps> = ({ appState, logs, sourceImage, refVideo }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Status Indicators */}
        {[
          { key: 'VALIDATING', label: 'Validation', color: 'blue' },
          { key: 'ANALYZING', label: 'Analysis', color: 'purple' },
          { key: 'GENERATING', label: 'Synthesis', color: 'pink' },
          { key: 'COMPLETED', label: 'Final Output', color: 'emerald' },
        ].map((step, idx) => {
          const isActive = appState === step.key;
          const isDone = ['ANALYZING', 'GENERATING', 'COMPLETED'].includes(appState) && idx === 0 ||
                         ['GENERATING', 'COMPLETED'].includes(appState) && idx === 1 ||
                         ['COMPLETED'].includes(appState) && idx === 2;
          
          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                isActive ? `border-${step.color}-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-${step.color}-500/10` : 
                isDone ? `bg-${step.color}-500 border-${step.color}-500` : 'border-slate-800 bg-slate-900'
              }`}>
                {isDone ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-sm font-bold ${isActive ? `text-${step.color}-500` : 'text-slate-600'}`}>{idx + 1}</span>
                )}
              </div>
              <span className={`text-xs font-medium uppercase tracking-widest ${isActive ? `text-${step.color}-400` : isDone ? 'text-slate-200' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[400px]">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-300">Live Synthesis Logs</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-emerald-500 uppercase font-bold">Active Engine</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-3">
            {logs.length === 0 && <div className="text-slate-600">Waiting for engine startup...</div>}
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-3">
                <span className="text-slate-600 whitespace-nowrap">[{log.timestamp.toLocaleTimeString()}]</span>
                <span className={
                  log.type === 'success' ? 'text-emerald-400' : 
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'warning' ? 'text-amber-400' : 'text-slate-300'
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 h-40">
                <p className="px-3 py-1.5 text-[10px] uppercase font-bold bg-slate-800 text-slate-400">Target Identity</p>
                <img src={sourceImage} className="w-full h-full object-cover grayscale opacity-50" />
            </div>
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 h-40">
                <p className="px-3 py-1.5 text-[10px] uppercase font-bold bg-slate-800 text-slate-400">Motion Extraction</p>
                <video src={refVideo} className="w-full h-full object-cover grayscale opacity-50" autoPlay loop muted />
            </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-slate-500 text-sm animate-pulse">
            Neural network is processing frame-by-frame. Please do not close the window.
        </p>
      </div>
    </div>
  );
};

export default ProcessingStage;
