import { GoogleGenAI as RealGoogleGenAI, Type, Modality } from '@google/genai';
import { handleGeminiMock } from './geminiMock';

export { Type, Modality };

export class GoogleGenAI {
  private realAI: RealGoogleGenAI;

  constructor(options: any) {
    // Instantiate real GoogleGenAI with provided options
    this.realAI = new RealGoogleGenAI(options);
  }

  get live() {
    return {
      connect: async (params: any) => {
        const isMockEnv = typeof window !== 'undefined' && (
          window.location.hostname.includes('github.io') ||
          window.location.hostname.includes('vercel.app')
        );
        if (isMockEnv || this.realAI.apiKey === 'dummy') {
           throw new Error("Live Audio API is not supported in standalone mock mode. Please deploy with a real backend or add a real Gemini API Key.");
        }
        return this.realAI.live.connect(params);
      }
    };
  }

  get models() {
    return {
      generateContent: async (params: any) => {
        // standalone/fallback check
        const isMockEnv = typeof window !== 'undefined' && (
          window.location.hostname.includes('github.io') ||
          window.location.hostname.includes('vercel.app')
        );

        if (isMockEnv) {
          console.warn("[AgriLink Gemini Client] Running in standalone client-side mode (GitHub/Vercel). Returning mock simulation.");
          return this.getMockResponse(params);
        }

        try {
          // Attempt the real API request
          const res = await this.realAI.models.generateContent(params);
          return res;
        } catch (err) {
          console.warn("[AgriLink Gemini Client] Real API request failed or server unavailable, falling back to local client-side Agri-AI simulation engine.", err);
          return this.getMockResponse(params);
        }
      }
    };
  }

  private async getMockResponse(params: any) {
    let prompt = '';
    if (params.contents) {
      if (typeof params.contents === 'string') {
        prompt = params.contents;
      } else if (Array.isArray(params.contents)) {
        prompt = JSON.stringify(params.contents);
      } else if (typeof params.contents === 'object') {
        // Can be { parts: [...] } or other structure
        prompt = JSON.stringify(params.contents);
      }
    }

    const mockResult = await handleGeminiMock(window.location.origin + '/api/gemini', prompt);
    const isImageRequest = params.model === 'gemini-2.5-flash-image';

    if (isImageRequest) {
      return {
        text: '',
        candidates: [{
          content: {
            parts: [{
              inlineData: {
                mimeType: "image/png",
                data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              }
            }]
          }
        }]
      };
    } else {
      const textContent = typeof mockResult === 'string' ? mockResult : JSON.stringify(mockResult);
      return {
        text: textContent,
        candidates: [{
          content: {
            parts: [{
              text: textContent
            }],
            role: "model"
          },
          finishReason: "STOP"
        }]
      };
    }
  }
}
