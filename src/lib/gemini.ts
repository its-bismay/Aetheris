import type { GeminiRequestPayload, GeminiMessagePart } from './types';

const getGeminiEndpoint = (model: string) => 
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=`;

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;

      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

export async function fetchGeminiStream(
  prompt: string,
  model: string,
  apiKey: string,
  signal: AbortSignal,
  file?: File
): Promise<Response> {
  const endpoint = getGeminiEndpoint(model) + apiKey;
  
  const parts: GeminiMessagePart[] = [];
  

  if (file) {
    const base64Data = await fileToBase64(file);
    parts.push({
      inlineData: {
        mimeType: file.type || 'audio/mp3',
        data: base64Data
      }
    });
  }


  parts.push({ text: prompt });

  const payload: GeminiRequestPayload = {
    contents: [
      {
        role: 'user',
        parts: parts
      }
    ]
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`Gemini API Error (${response.status}): ${errorBody}`);
  }

  return response;
}
