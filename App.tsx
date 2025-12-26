
import React, { useState, useCallback } from 'react';
import { AppState, MediaInput, ProcessingLog, GenerationMode, CinematicSettings } from './types';
import Header from './components/Header';
import MediaUploadSection from './components/MediaUploadSection';
import ProcessingStage from './components/ProcessingStage';
import ResultView from './components/ResultView';
import CinematicLab from './components/CinematicLab';
import { validateMediaInputs, extractMotionDescription, generateUniversalVideo } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [mode, setMode] = useState<GenerationMode>('TRANSFER');
  const [sourceImage, setSourceImage] = useState<MediaInput>({ file: null, preview: null, base64: null });
  const [refVideo, setRefVideo] = useState<MediaInput>({ file: null, preview: null, base64: null });
  const [dreamPrompt, setDreamPrompt] = useState('');
  const [cinematic, setCinematic] = useState<CinematicSettings>({
    aspectRatio: '9:16',
    colorGrade: 'none',
    fx: 'none',
    resolution: '1080p'
  });
  
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addLog = useCallback((message: string, type: ProcessingLog['type'] = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: new Date(),
      type
    }, ...prev]);
  }, []);

  const checkApiKey = useCallback(async () => {
    // @ts-ignore
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) return false;
    return true;
  }, []);

  const handleStartGeneration = async () => {
    try {
      if (!(await checkApiKey())) {
        setAppState('API_KEY_REQUIRED');
        return;
      }

      setErrorMsg(null);
      setLogs([]);

      if (mode === 'TRANSFER') {
        if (!sourceImage.base64 || !refVideo.base64) {
          addLog('Missing required media files', 'error');
          return;
        }

        setAppState('VALIDATING');
        addLog('Validating human subjects...');
        const validation = await validateMediaInputs(sourceImage.base64, refVideo.base64);
        if (!validation.isValid) {
          setErrorMsg(validation.message);
          setAppState('ERROR');
          addLog(validation.message, 'error');
          return;
        }

        setAppState('ANALYZING');
        addLog('Extracting motion data from reference...');
        const motion = await extractMotionDescription(refVideo.base64);
        
        setAppState('GENERATING');
        addLog(`Synthesizing motion onto character with ${cinematic.colorGrade} grading at ${cinematic.resolution}...`);
        const url = await generateUniversalVideo('TRANSFER', cinematic, {
          imageBase64: sourceImage.base64,
          motionDescription: motion.description
        });
        setResultUrl(url);
      } else {
        if (!dreamPrompt.trim()) {
          addLog('Please enter a prompt for Dream Engine', 'error');
          return;
        }
        setAppState('GENERATING');
        addLog(`Dreaming cinematic sequence with ${cinematic.fx} effects at ${cinematic.resolution}...`);
        const url = await generateUniversalVideo('DREAM', cinematic, {
          userPrompt: dreamPrompt
        });
        setResultUrl(url);
      }
      
      setAppState('COMPLETED');
      addLog('Neural Synthesis Complete.', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Generation failed.');
      setAppState('ERROR');
    }
  };

  const handleReset = () => {
    setAppState('IDLE');
    setSourceImage({ file: null, preview: null, base64: null });
    setRefVideo({ file: null, preview: null, base64: null });
    setDreamPrompt('');
    setResultUrl(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-12">
          {appState === 'IDLE' || appState === 'API_KEY_REQUIRED' || appState === 'ERROR' ? (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  MotionFlow Engine
                </h1>
                
                {/* Mode Selector */}
                <div className="flex justify-center mt-6">
                  <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-1">
                    <button 
                      onClick={() => setMode('TRANSFER')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'TRANSFER' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Neural Transfer
                    </button>
                    <button 
                      onClick={() => setMode('DREAM')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'DREAM' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Dream Engine
                    </button>
                  </div>
                </div>
              </div>

              {appState === 'API_KEY_REQUIRED' && (
                <div className="max-w-md mx-auto p-6 bg-amber-900/20 border border-amber-500/30 rounded-xl text-center">
                  <h3 className="text-amber-400 font-semibold mb-2">API Key Required</h3>
                  <button onClick={() => window.aistudio.openSelectKey().then(handleStartGeneration)} className="w-full py-3 bg-amber-500 text-black font-bold rounded-lg">Select Key</button>
                </div>
              )}

              {appState === 'ERROR' && (
                <div className="max-w-md mx-auto p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                  <p className="text-red-400 font-medium">{errorMsg}</p>
                </div>
              )}

              <MediaUploadSection 
                mode={mode}
                sourceImage={sourceImage}
                setSourceImage={setSourceImage}
                refVideo={refVideo}
                setRefVideo={setRefVideo}
                dreamPrompt={dreamPrompt}
                setDreamPrompt={setDreamPrompt}
                onStart={handleStartGeneration}
                isProcessing={false}
              />

              <CinematicLab settings={cinematic} setSettings={setCinematic} />
            </div>
          ) : appState === 'COMPLETED' ? (
            <ResultView 
              videoUrl={resultUrl!} 
              onReset={handleReset} 
              sourceImage={sourceImage.preview}
              mode={mode}
              dreamPrompt={dreamPrompt}
            />
          ) : (
            <ProcessingStage 
              appState={appState} 
              logs={logs} 
              sourceImage={sourceImage.preview!}
              refVideo={refVideo.preview!}
            />
          )}
        </div>
      </main>
      <footer className="py-8 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; 2024 MotionFlow AI Engine. High-Fidelity Neural Synthesis.</p>
      </footer>
    </div>
  );
};

export default App;
