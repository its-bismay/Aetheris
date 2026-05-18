import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, RefreshCcw, Trash2, Play, ChevronDown, Upload, FileAudio, X } from 'lucide-react';
import type { InputMode } from '../../lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PromptPanelProps {
  onStart: (prompt: string, model: string, file?: File) => void;
  onStop: () => void;
  onRetry: (prompt: string, model: string) => void;
  onClear: () => void;
  status: string;
}

const MODELS = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-3.1-flash-lite'];

export function PromptPanel({ onStart, onStop, onRetry, onClear, status }: PromptPanelProps) {
  const [mode, setMode] = useState<InputMode>('text');
  const [model, setModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const isStreaming = status === 'streaming';
  const hasError = status === 'error';


  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const ext = mediaRecorder.mimeType.includes('mp4') ? 'mp4' : 'webm';
        const file = new File([audioBlob], `recording-${Date.now()}.${ext}`, { type: mediaRecorder.mimeType });
        setAudioFile(file);
        
        if (!model.includes('flash') && !model.includes('pro')) {
          setModel('gemini-2.5-flash');
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      setPermissionError("Microphone access denied. Please check your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (mode === 'text' && !prompt.trim()) return;
    onStart(prompt, model, audioFile || undefined);
  };


  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {

      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isStreaming && !((mode === 'text' && !prompt.trim()) || (mode === 'audio' && !isRecording && !audioFile))) {
          handleStart();
        }
      }
      

      if (e.key === 'Escape' && isStreaming) {
        e.preventDefault();
        onStop();
      }


      if (e.key.toLowerCase() === 'r' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        if (!isStreaming && hasError) {
          onRetry(prompt, model);
        }
      }

      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClear();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isStreaming, hasError, mode, prompt, audioFile, isRecording, model, handleStart, onStop, onRetry, onClear]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);

      if (!model.includes('flash') && !model.includes('pro')) {
        setModel('gemini-2.5-flash');
      }
    }
  };

  const removeFile = () => {
    setAudioFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex h-full flex-col border-r border-[#262626] bg-[#0A0A0A] p-6 text-[#EDEDED]" aria-label="Input Controls">
      

      <div className="mb-6 flex items-center justify-between">
        <div className="flex rounded-md border border-[#262626] bg-[#121212] p-1" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'text'}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]",
              mode === 'text' ? "bg-[#262626] text-white" : "text-[#EDEDED]/60 hover:text-[#EDEDED]"
            )}
            onClick={() => setMode('text')}
          >
            Text
          </button>
          <button
            role="tab"
            aria-selected={mode === 'audio'}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]",
              mode === 'audio' ? "bg-[#262626] text-white" : "text-[#EDEDED]/60 hover:text-[#EDEDED]"
            )}
            onClick={() => setMode('audio')}
          >
            Audio
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="model-select" className="text-xs font-mono text-[#EDEDED]/50 uppercase tracking-wider">Model:</label>
          <div className="relative">
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="appearance-none rounded-sm border border-[#262626] bg-[#121212] py-1.5 pl-3 pr-8 text-sm font-mono text-[#EDEDED] outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              aria-label="Select AI Model"
            >
              {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-[#EDEDED]/50" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 mb-6 flex flex-col gap-4">
        {mode === 'text' ? (
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your instruction or code snippet here..."
            className="h-full w-full resize-none rounded-xl border border-[#262626] bg-[#121212] p-4 text-base text-[#EDEDED] placeholder-[#EDEDED]/30 outline-none focus:border-[#464554] focus:ring-1 focus:ring-[#464554] transition-colors shadow-inner"
            aria-label="Text Prompt Input"
            disabled={isStreaming}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-[#262626] bg-[#121212] shadow-inner relative overflow-hidden p-6">
             {isRecording && (
                <div className="absolute inset-0 bg-[#6366F1]/5 animate-pulse" />
             )}
             
             {!audioFile ? (
               <div className="z-10 flex flex-col items-center w-full max-w-sm gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="font-mono text-2xl text-[#EDEDED]">
                      {formatTime(recordingTime)}
                    </div>
                    <button
                      onClick={toggleRecording}
                      className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-full transition-all outline-none focus-visible:ring-4 focus-visible:ring-[#6366F1]",
                        isRecording 
                          ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                          : "bg-[#262626] text-[#EDEDED] hover:bg-[#333333]"
                      )}
                      aria-label={isRecording ? "Stop Recording" : "Start Recording"}
                    >
                      {isRecording ? <Square className="h-8 w-8 fill-current" /> : <Mic className="h-8 w-8" />}
                    </button>
                    <div className="text-sm text-[#EDEDED]/50 text-center max-w-[250px]">
                      {isRecording ? "Recording in progress..." : "Click to record audio instructions"}
                      {permissionError && (
                        <p className="text-red-400 mt-2 text-xs leading-relaxed">{permissionError}</p>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex items-center gap-4 text-[#EDEDED]/30">
                    <div className="h-px flex-1 bg-[#262626]"></div>
                    <span className="text-xs uppercase tracking-wider font-mono">OR</span>
                    <div className="h-px flex-1 bg-[#262626]"></div>
                  </div>

                  <div className="w-full flex flex-col items-center gap-2">
                    <input 
                      type="file" 
                      accept=".mp3,audio/mpeg" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      aria-label="Upload MP3 file"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 rounded-sm border border-[#262626] bg-[#0A0A0A] px-4 py-3 text-sm text-[#EDEDED] transition-colors hover:bg-[#1A1A1A] outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
                    >
                      <Upload className="h-4 w-4" /> Upload MP3 File
                    </button>
                  </div>
               </div>
             ) : (
                <div className="z-10 flex flex-col items-center justify-center w-full gap-6">
                  <div className="relative flex flex-col items-center gap-4 rounded-lg border border-[#262626] bg-[#0A0A0A] p-8 w-full max-w-sm">
                    <button 
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1 text-[#EDEDED]/50 hover:text-[#EDEDED] transition-colors"
                      aria-label="Remove audio file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="h-16 w-16 rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center">
                      <FileAudio className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[#EDEDED] truncate max-w-[200px]" title={audioFile.name}>
                        {audioFile.name}
                      </p>
                      <p className="text-xs text-[#EDEDED]/50 mt-1">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB • MP3 Audio
                      </p>
                    </div>
                  </div>
                  
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Add an optional text prompt for this audio..."
                    className="w-full max-w-sm resize-none rounded-xl border border-[#262626] bg-[#0A0A0A] p-4 text-sm text-[#EDEDED] placeholder-[#EDEDED]/40 outline-none focus:border-[#464554] focus:ring-1 focus:ring-[#464554] transition-colors"
                    rows={3}
                  />
                </div>
             )}
          </div>
        )}
      </div>


      <div className="flex gap-3">
        <button
          onClick={handleStart}
          disabled={isStreaming || (mode === 'text' && !prompt.trim()) || (mode === 'audio' && !isRecording && !audioFile)}
          className="flex-1 inline-flex items-center justify-center rounded-sm bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4F52E1] disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          aria-label="Start Generation"
        >
          <Play className="mr-2 h-4 w-4 fill-current" /> Start Generation
        </button>

        <button
          onClick={onStop}
          disabled={!isStreaming}
          className="inline-flex items-center justify-center rounded-sm border border-[#262626] bg-[#121212] px-4 py-3 text-[#EDEDED] transition-colors hover:bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          aria-label="Stop Stream"
          title="Stop Stream"
        >
          <Square className="h-4 w-4" />
        </button>

        <button
          onClick={() => onRetry(prompt, model)}
          disabled={isStreaming || !hasError}
          className={cn(
            "inline-flex items-center justify-center rounded-sm border border-[#262626] bg-[#121212] px-4 py-3 text-[#EDEDED] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]",
            hasError ? "hover:bg-[#1A1A1A] text-amber-400 border-amber-400/30" : "opacity-50 cursor-not-allowed"
          )}
          aria-label="Retry Failed Stream"
          title="Retry Failed Stream"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>

        <button
          onClick={onClear}
          className="inline-flex items-center justify-center rounded-sm border border-[#262626] bg-[#121212] px-4 py-3 text-[#EDEDED] transition-colors hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          aria-label="Clear Session"
          title="Clear Session"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
