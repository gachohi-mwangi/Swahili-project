import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Award,
  VolumeX
} from 'lucide-react';
import { Phrase } from '../data/phrases';
import { playSwahiliTTS, stopSwahiliTTS } from '../lib/tts';
import {
  SwahiliSpeechRecognizer,
  evaluatePronunciation,
  PronunciationResult,
  isSpeechRecognitionSupported
} from '../lib/speech-recognition';

interface PronunciationModalProps {
  phrase: Phrase | null;
  isOpen: boolean;
  onClose: () => void;
  onScoreSaved?: (phraseId: string, score: number) => void;
}

type PracticeState = 'idle' | 'listening' | 'evaluating' | 'result' | 'error';

export default function PronunciationModal({
  phrase,
  isOpen,
  onClose,
  onScoreSaved
}: PronunciationModalProps) {
  const [state, setState] = useState<PracticeState>('idle');
  const [interimText, setInterimText] = useState('');
  const [feedback, setFeedback] = useState<PronunciationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const recognizerRef = useRef<SwahiliSpeechRecognizer | null>(null);

  // Initialize recognizer once
  useEffect(() => {
    recognizerRef.current = new SwahiliSpeechRecognizer();
    return () => {
      recognizerRef.current?.abort();
      stopSwahiliTTS();
    };
  }, []);

  const stopRecording = useCallback(() => {
    recognizerRef.current?.stop();
  }, []);

  const startRecording = useCallback(() => {
    if (!phrase) return;
    stopSwahiliTTS();
    setIsPlayingAudio(false);
    setErrorMessage('');
    setInterimText('');
    setFeedback(null);

    if (!recognizerRef.current?.isSupported) {
      setState('error');
      setErrorMessage(
        'Speech Recognition is not supported by your current browser. Please try using Google Chrome, Microsoft Edge, or Safari.'
      );
      return;
    }

    setState('listening');

    recognizerRef.current.start(
      {
        onStart: () => {
          setState('listening');
        },
        onInterim: (text) => {
          setInterimText(text);
        },
        onResult: (finalTranscript) => {
          setState('evaluating');
          const evalResult = evaluatePronunciation(finalTranscript, phrase.swahili_text);
          setFeedback(evalResult);
          setState('result');

          if (onScoreSaved) {
            onScoreSaved(phrase.id, evalResult.score);
          }
        },
        onError: (err) => {
          setErrorMessage(err);
          setState('error');
        },
        onEnd: () => {
          setState((prev) => {
            if (prev === 'listening') {
              return 'error';
            }
            return prev;
          });
        }
      },
      8000 // 8 second speech window
    );
  }, [phrase, onScoreSaved]);

  // When modal opens or phrase changes, auto-start listening or prepare
  useEffect(() => {
    if (isOpen && phrase) {
      setFeedback(null);
      setInterimText('');
      setErrorMessage('');
      setState('idle');

      // Auto start recording after a brief moment to allow user to view the word
      const timer = setTimeout(() => {
        startRecording();
      }, 350);

      return () => {
        clearTimeout(timer);
        stopRecording();
      };
    } else {
      stopRecording();
      stopSwahiliTTS();
      setIsPlayingAudio(false);
    }
  }, [isOpen, phrase, startRecording, stopRecording]);

  const handlePlayTTS = async () => {
    if (!phrase) return;
    if (isPlayingAudio) {
      stopSwahiliTTS();
      setIsPlayingAudio(false);
      return;
    }
    try {
      setIsPlayingAudio(true);
      await playSwahiliTTS(phrase.swahili_text, () => {
        setIsPlayingAudio(false);
      });
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleModalClose = () => {
    stopRecording();
    stopSwahiliTTS();
    onClose();
  };

  if (!isOpen || !phrase) return null;

  const supported = isSpeechRecognitionSupported();

  // Helper colors based on score
  const getScoreTheme = (score: number) => {
    if (score >= 85) {
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-500',
        text: 'text-emerald-700',
        badge: 'bg-emerald-500 text-white',
        icon: <Award className="w-8 h-8 text-emerald-500" />
      };
    }
    if (score >= 68) {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-700',
        badge: 'bg-blue-500 text-white',
        icon: <CheckCircle2 className="w-8 h-8 text-blue-500" />
      };
    }
    if (score >= 45) {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        text: 'text-amber-700',
        badge: 'bg-amber-500 text-white',
        icon: <Sparkles className="w-8 h-8 text-amber-500" />
      };
    }
    return {
      bg: 'bg-orange-50',
      border: 'border-swahili-orange',
      text: 'text-swahili-orange',
      badge: 'bg-swahili-orange text-white',
      icon: <RotateCcw className="w-8 h-8 text-swahili-orange" />
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-swahili-orange">
              <Mic size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Pronunciation Practice</h3>
              <p className="text-[11px] text-slate-500 font-medium">Mazoezi ya Kutamka</p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Phrase Showcase Card */}
        <div className="p-6 bg-slate-50/70 border-b border-slate-100 flex flex-col items-center text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Target Swahili Phrase
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {phrase.swahili_text}
          </h2>
          <span className="text-sm italic font-medium text-slate-500 mb-2">
            "{phrase.phonetic_spelling}"
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            {phrase.english_translation}
          </span>

          {/* Quick Audio Reference */}
          <button
            onClick={handlePlayTTS}
            className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all ${
              isPlayingAudio
                ? 'bg-swahili-orange text-white ring-2 ring-orange-300'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX size={15} />
                <span>Stop Native Audio</span>
              </>
            ) : (
              <>
                <Volume2 size={15} className="text-swahili-orange" />
                <span>Listen to Native Voice</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Speech Recognition & Feedback Body */}
        <div className="p-6 flex flex-col items-center min-h-[260px] justify-center text-center">
          {/* 1. LISTENING STATE */}
          {state === 'listening' && (
            <div className="flex flex-col items-center gap-4 py-2">
              {/* Pulsing Mic visualizer */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full bg-orange-400/20 animate-ping opacity-75" />
                <div className="absolute w-24 h-24 rounded-full bg-orange-500/30 animate-pulse" />
                <button
                  onClick={stopRecording}
                  className="relative z-10 w-20 h-20 rounded-full bg-swahili-orange text-white shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform"
                >
                  <Mic size={32} className="animate-bounce" />
                </button>
              </div>

              {/* Status & interim transcript */}
              <div>
                <p className="text-base font-bold text-slate-800">
                  Listening... Speak in Swahili now!
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Say <span className="font-semibold text-slate-800">"{phrase.swahili_text}"</span> clearly into your microphone.
                </p>
              </div>

              {/* Sound wave visual bars */}
              <div className="flex items-center gap-1.5 h-6">
                {[40, 75, 55, 90, 60, 85, 45].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 bg-swahili-orange rounded-full animate-pulse"
                  />
                ))}
              </div>

              {interimText && (
                <div className="px-4 py-2 bg-white rounded-xl border border-orange-200 text-slate-700 text-xs shadow-xs font-mono">
                  "{interimText}"
                </div>
              )}

              <button
                onClick={stopRecording}
                className="mt-1 px-4 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Tap to evaluate now
              </button>
            </div>
          )}

          {/* 2. EVALUATING STATE */}
          {state === 'evaluating' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-swahili-orange animate-spin" />
              <p className="text-sm font-bold text-slate-700">Evaluating your pronunciation...</p>
              <p className="text-xs text-slate-400">Comparing with native East African Swahili cadence</p>
            </div>
          )}

          {/* 3. RESULT STATE */}
          {state === 'result' && feedback && (
            <div className="w-full flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
              {(() => {
                const theme = getScoreTheme(feedback.score);
                return (
                  <div className={`w-full p-4 rounded-2xl border ${theme.border} ${theme.bg} flex flex-col items-center text-center gap-2`}>
                    <div className="flex items-center gap-2">
                      {theme.icon}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${theme.badge}`}>
                        {feedback.score}% MATCH
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-800">
                      {feedback.swahiliFeedback}
                    </h4>

                    <p className="text-xs text-slate-600 font-medium">
                      {feedback.englishFeedback}
                    </p>

                    {/* Spoken vs Target Comparison */}
                    <div className="w-full mt-2 pt-2 border-t border-slate-200/60 flex flex-col gap-1 text-left text-xs">
                      <div className="flex justify-between items-center bg-white/70 px-3 py-1.5 rounded-lg">
                        <span className="text-slate-400 font-medium">You said:</span>
                        <span className="font-bold text-slate-800">"{feedback.spokenText}"</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/70 px-3 py-1.5 rounded-lg">
                        <span className="text-slate-400 font-medium">Target:</span>
                        <span className="font-bold text-emerald-700">"{phrase.swahili_text}"</span>
                      </div>
                    </div>

                    {feedback.tips && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        💡 {feedback.tips}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={startRecording}
                  className="flex-1 py-3 px-4 rounded-2xl bg-swahili-orange text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  <RotateCcw size={15} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={handleModalClose}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* 4. ERROR / IDLE STATE */}
          {(state === 'error' || state === 'idle') && (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                {state === 'error' ? (
                  <AlertCircle size={32} className="text-amber-500" />
                ) : (
                  <Mic size={32} className="text-swahili-orange" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  {state === 'error' ? 'Pronunciation Check' : 'Ready to Practice?'}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  {errorMessage ||
                    (supported
                      ? 'Tap the microphone to record your voice and receive instant pronunciation feedback.'
                      : 'Speech recognition is not supported in this browser. Please try Chrome or Safari.')}
                </p>
              </div>

              {supported ? (
                <button
                  onClick={startRecording}
                  className="mt-2 py-3 px-6 rounded-2xl bg-swahili-orange text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-orange-600 transition-colors"
                >
                  <Mic size={16} />
                  <span>Start Speaking</span>
                </button>
              ) : (
                <button
                  onClick={handleModalClose}
                  className="mt-2 py-2 px-5 rounded-2xl bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Close
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
