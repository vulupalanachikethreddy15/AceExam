
import React, { useState, useRef } from 'react';
import { transcriptionService } from '../services/gemini';

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
  isLarge?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscriptionComplete, isLarge }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          try {
            const text = await transcriptionService.transcribeAudio(base64Audio, 'audio/webm');
            onTranscriptionComplete(text);
          } catch (err) {
            alert("Error transcribing audio. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 flex items-center justify-center rounded-full transition-all shadow-md ${
            isRecording ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } ${isLarge ? 'w-24 h-24' : 'w-14 h-14'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isProcessing ? (
            <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="7" y="7" width="10" height="10" rx="2" fill="white" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )
          )}
        </button>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${isLarge ? 'text-2xl' : 'text-lg'} ${isRecording ? 'text-red-600' : 'text-slate-700'}`}>
          {isProcessing ? "Processing..." : isRecording ? "Microphone Active" : "Voice Assist"}
        </span>
        <span className={`${isLarge ? 'text-lg' : 'text-xs'} text-slate-500 font-medium`}>
          {isRecording ? "Speak clearly to transcribe your answer" : "Click to use voice for open-ended questions"}
        </span>
      </div>
    </div>
  );
};
