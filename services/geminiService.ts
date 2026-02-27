import { GoogleGenAI } from "@google/genai";

// Initialize safely - UI will handle if key is missing
const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generatePromptFromDNA = async (dna: any, settings: any) => {
  if (!ai) return "API Key not configured.";

  const model = "gemini-2.5-flash";
  
  // Format instruments list if it exists
  const instrumentsList = settings.instruments && settings.instruments.length > 0 
    ? settings.instruments.join(', ') 
    : "Electronic synthesizers";

  const prompt = `
    Act as an expert electronic music producer. Create a highly detailed, poetic, and technical prompt for a text-to-audio generation model (like MusicGen or AudioCraft).
    
    Based on the following "Beat DNA" analysis and user settings:
    - Genre Focus: Underground Electronic
    - Rhythmic Complexity: ${dna.rhythm}%
    - Harmonic Darkness: ${dna.harmonic}% (Higher is darker/minor)
    - Texture Density: ${dna.texture}%
    
    User Specific Overrides (Strictly Adhere):
    - Tempo: ${settings.bpm} BPM
    - Musical Key: ${settings.key}
    - Required Instruments: ${instrumentsList}
    - Energy Level: ${settings.energy}%
    - Weirdness/Experimental: ${settings.weirdness}%
    - Analog Warmth: ${settings.analogHeat}%
    
    The output should be a single paragraph suitable for an AI music generator. 
    Explicitly mention the BPM (${settings.bpm}) and the Key (${settings.key}) in the prompt text.
    Describe how the ${instrumentsList} interact to create the mood.
    Keep it under 60 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating prompt. Please check API configuration.";
  }
};