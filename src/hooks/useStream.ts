import { useState, useRef, useCallback } from 'react';
import type { StreamState } from '../lib/types';
import { MetricsCalculator } from '../lib/metrics';
import { fetchGeminiStream } from '../lib/gemini';
import { processStream } from '../lib/streaming';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'dummy_key_for_ui_testing';

export function useStream() {
  const [state, setState] = useState<StreamState>({
    status: 'idle',
    output: '',
    metrics: { tokenCount: 0, tps: 0, latency: 0 },
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const metricsCalcRef = useRef(new MetricsCalculator());
  const lastFileRef = useRef<File | undefined>(undefined);


  const startMetricsInterval = () => {
    return setInterval(() => {
      setState(prev => {
        if (prev.status !== 'streaming') return prev;
        return { ...prev, metrics: metricsCalcRef.current.getMetrics() };
      });
    }, 500);
  };

  const startStream = useCallback(async (prompt: string, model: string, file?: File) => {
    lastFileRef.current = file;
    setState({
      status: 'streaming',
      output: '',
      metrics: { tokenCount: 0, tps: 0, latency: 0 },
      error: null
    });

    metricsCalcRef.current.start();
    const intervalId = startMetricsInterval();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetchGeminiStream(prompt, model, API_KEY, abortControllerRef.current.signal, file);
      
      await processStream(response, (chunk) => {
        const tokensInChunk = MetricsCalculator.estimateTokenCount(chunk);
        metricsCalcRef.current.recordTokens(tokensInChunk);
        
        setState(prev => ({
          ...prev,
          output: prev.output + chunk,
          metrics: metricsCalcRef.current.getMetrics()
        }));
      });

      setState(prev => ({
        ...prev,
        status: 'completed',
        metrics: metricsCalcRef.current.getMetrics()
      }));

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setState(prev => ({
          ...prev,
          status: 'interrupted',
          metrics: metricsCalcRef.current.getMetrics()
        }));
      } else {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: err.message || 'An unknown error occurred during streaming.',
          metrics: metricsCalcRef.current.getMetrics()
        }));
      }
    } finally {
      clearInterval(intervalId);
      abortControllerRef.current = null;
    }
  }, []);

  const retryStream = useCallback(async (prompt: string, model: string) => {
    setState(prev => ({
      ...prev,
      status: 'streaming',
      error: null,
      output: prev.output + '\n\n[SYSTEM: Retrying connection...]\n\n'
    }));
    
    const intervalId = startMetricsInterval();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetchGeminiStream(prompt, model, API_KEY, abortControllerRef.current.signal, lastFileRef.current);
      
      await processStream(response, (chunk) => {
        const tokensInChunk = MetricsCalculator.estimateTokenCount(chunk);
        metricsCalcRef.current.recordTokens(tokensInChunk);
        
        setState(prev => ({
          ...prev,
          output: prev.output + chunk,
          metrics: metricsCalcRef.current.getMetrics()
        }));
      });

      setState(prev => ({
        ...prev,
        status: 'completed',
        metrics: metricsCalcRef.current.getMetrics()
      }));

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setState(prev => ({ ...prev, status: 'interrupted' }));
      } else {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: err.message || 'Retry failed.'
        }));
      }
    } finally {
      clearInterval(intervalId);
      abortControllerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearSession = useCallback(() => {
    stopStream();
    setState({
      status: 'idle',
      output: '',
      metrics: { tokenCount: 0, tps: 0, latency: 0 },
      error: null
    });
  }, [stopStream]);

  return {
    state,
    startStream,
    retryStream,
    stopStream,
    clearSession
  };
}
