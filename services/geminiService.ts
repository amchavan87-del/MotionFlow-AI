
import { GoogleGenAI } from "@google/genai";
import { ValidationResult, MotionData, CinematicSettings } from "../types";

const COLOR_GRADE_PROMPTS: Record<string, string> = {
  'teal-orange': "high-contrast teal and orange cinematic color grading, professional Hollywood look",
  'noir': "moody black and white cinematic noir, dramatic shadows and lighting",
  'cyber': "vibrant neon cyberpunk aesthetic, pink and blue accents, high saturation",
  'golden': "warm golden hour lighting, soft sun-drenched atmosphere, amber tones"
};

const FX_PROMPTS: Record<string, string> = {
  'particles': "subtle floating dust particles and micro-embers in the air",
  'mist': "ethereal low-lying mist and soft atmospheric fog",
  'flares': "cinematic anamorphic lens flares and subtle light leaks"
};

export async function validateMediaInputs(imageBase64: string, videoBase64: string): Promise<ValidationResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Analyze these two inputs:
    1. An image
    2. A video (encoded in base64)
    CRITICAL VALIDATION RULES:
    - The IMAGE must contain exactly ONE realistic human character.
    - The VIDEO must contain exactly ONE human performer.
    - No anime, cartoon, illustration, CGI, or multiple people.
    - No identity guessing or real-person naming.
    If inputs are valid, return "VALID". If not, provide a polite reason why.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: imageBase64, mimeType: 'image/png' } },
          { inlineData: { data: videoBase64, mimeType: 'video/mp4' } }
        ]
      },
      config: { temperature: 0.1 }
    });
    const result = response.text?.trim();
    return result === 'VALID' ? { isValid: true, message: 'Valid inputs' } : { isValid: false, message: result || 'Validation failed' };
  } catch (error) {
    return { isValid: false, message: 'Error communicating with validation engine.' };
  }
}

export async function extractMotionDescription(videoBase64: string): Promise<MotionData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Analyze the provided video for full-body motion and performance style. 
    IGNORE identity/clothing. EXTRACT ONLY:
    - Movement rhythm/energy
    - Specific actions/dance steps
    - Hand/head coordination
    Produce a detailed motion description for a cinematic transfer.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: videoBase64, mimeType: 'video/mp4' } }
        ]
      }
    });
    return { description: response.text || "Graceful rhythmic motion", keyMoments: [] };
  } catch (error) {
    throw new Error('Failed to extract motion data.');
  }
}

export async function generateUniversalVideo(
  mode: 'TRANSFER' | 'DREAM',
  settings: CinematicSettings,
  input: { imageBase64?: string; motionDescription?: string; userPrompt?: string }
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Synthesize Final Prompt
  let coreConcept = mode === 'TRANSFER' 
    ? `Perform a cinematic motion transfer. Target Identity: Provided image. Action: ${input.motionDescription}. Preserve skin texture, clothing, and facial structure perfectly.`
    : `Generate a high-fidelity cinematic video of: ${input.userPrompt}. Focus on realistic textures and physics.`;

  const gradeAddon = settings.colorGrade !== 'none' ? ` Style with ${COLOR_GRADE_PROMPTS[settings.colorGrade]}.` : "";
  const fxAddon = settings.fx !== 'none' ? ` Include ${FX_PROMPTS[settings.fx]}.` : "";
  
  const finalPrompt = `${coreConcept}${gradeAddon}${fxAddon} Highest quality neural render, stabilized camera, sharp detail.`;

  const videoConfig: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt: finalPrompt,
    config: {
      numberOfVideos: 1,
      resolution: settings.resolution,
      aspectRatio: settings.aspectRatio
    }
  };

  if (mode === 'TRANSFER' && input.imageBase64) {
    videoConfig.image = {
      imageBytes: input.imageBase64,
      mimeType: 'image/png',
    };
  }

  let operation = await ai.models.generateVideos(videoConfig);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error('Generation failed: No output URI.');

  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
}
