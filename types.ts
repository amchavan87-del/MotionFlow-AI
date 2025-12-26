
export type AppState = 'IDLE' | 'API_KEY_REQUIRED' | 'VALIDATING' | 'ANALYZING' | 'GENERATING' | 'COMPLETED' | 'ERROR';

export type GenerationMode = 'TRANSFER' | 'DREAM';
export type AspectRatio = '9:16' | '16:9';
export type ColorGrade = 'none' | 'teal-orange' | 'noir' | 'cyber' | 'golden';
export type AtmosphericFX = 'none' | 'particles' | 'mist' | 'flares';
export type VideoResolution = '720p' | '1080p';

export interface CinematicSettings {
  aspectRatio: AspectRatio;
  colorGrade: ColorGrade;
  fx: AtmosphericFX;
  resolution: VideoResolution;
}

export interface MediaInput {
  file: File | null;
  preview: string | null;
  base64: string | null;
}

export interface ProcessingLog {
  id: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface MotionData {
  description: string;
  keyMoments: string[];
}
