export type StreamStatus = 'idle' | 'streaming' | 'completed' | 'interrupted' | 'error';

export interface Metrics {
  tokenCount: number;
  tps: number;
  latency: number;
}

export interface StreamState {
  status: StreamStatus;
  output: string;
  metrics: Metrics;
  error: string | null;
}

export type InputMode = 'text' | 'audio';

export interface GeminiMessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: GeminiMessagePart[];
}

export interface GeminiRequestPayload {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

