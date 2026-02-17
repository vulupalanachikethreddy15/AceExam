
import { GoogleGenAI } from "@google/genai";

export class TranscriptionService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: "Transcribe the following audio precisely. Output only the transcribed text." },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Audio
                }
              }
            ]
          }
        ]
      });

      return response.text?.trim() || "No transcription available.";
    } catch (error) {
      console.error("Transcription error:", error);
      throw new Error("Failed to transcribe audio.");
    }
  }
}

export const transcriptionService = new TranscriptionService();
