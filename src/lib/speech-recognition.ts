// Browser SpeechRecognition helper & Swahili pronunciation evaluator

export interface PronunciationResult {
  score: number; // 0 - 100
  spokenText: string;
  targetText: string;
  rating: 'excellent' | 'good' | 'fair' | 'needs-practice';
  swahiliFeedback: string;
  englishFeedback: string;
  tips?: string;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

// Normalize Swahili text for comparison: remove punctuation, lowercase, normalize spaces
export function normalizeSwahiliText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics if any
    .replace(/['’]/g, '') // remove apostrophes (e.g. ng'ombe -> ngombe for phonetic alignment)
    .replace(/[^a-z0-9\s]/g, ' ') // replace punctuation with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance implementation for character-level precision
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

// Calculate similarity ratio between 0 and 1
function stringSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(s1, s2);
  return Math.max(0, 1 - dist / maxLen);
}

// Evaluate Swahili pronunciation against expected target
export function evaluatePronunciation(spoken: string, target: string): PronunciationResult {
  const normSpoken = normalizeSwahiliText(spoken);
  const normTarget = normalizeSwahiliText(target);

  if (!normSpoken) {
    return {
      score: 0,
      spokenText: spoken || '(Hakuna sauti / No sound)',
      targetText: target,
      rating: 'needs-practice',
      swahiliFeedback: 'Hakuna sauti iliyosikika',
      englishFeedback: 'No speech was detected. Please speak closer to your mic.',
      tips: 'Make sure your microphone is unmuted and speak clearly.'
    };
  }

  // Exact match
  if (normSpoken === normTarget) {
    return {
      score: 100,
      spokenText: spoken,
      targetText: target,
      rating: 'excellent',
      swahiliFeedback: 'Bora kabisa! (Perfect!)',
      englishFeedback: 'Flawless pronunciation! Spot on native Swahili cadence.',
      tips: 'You have mastered this phrase!'
    };
  }

  // Full string Levenshtein similarity
  const charSim = stringSimilarity(normSpoken, normTarget);

  // Word-level token matching for multi-word phrases
  const targetWords = normTarget.split(' ').filter(Boolean);
  const spokenWords = normSpoken.split(' ').filter(Boolean);

  let matchedWordsCount = 0;
  for (const tWord of targetWords) {
    // Check if any spoken word is very close to tWord
    const bestMatch = spokenWords.reduce((best, sWord) => {
      const sim = stringSimilarity(tWord, sWord);
      return sim > best ? sim : best;
    }, 0);

    if (bestMatch >= 0.75) {
      matchedWordsCount += bestMatch;
    }
  }

  const wordSim = targetWords.length > 0 ? (matchedWordsCount / targetWords.length) : charSim;
  
  // Weighted composite score (60% character accuracy, 40% word accuracy)
  const compositeScore = Math.round((charSim * 0.55 + wordSim * 0.45) * 100);
  const finalScore = Math.min(100, Math.max(10, compositeScore));

  if (finalScore >= 85) {
    return {
      score: finalScore,
      spokenText: spoken,
      targetText: target,
      rating: 'excellent',
      swahiliFeedback: 'Hongera sana! (Congratulations!)',
      englishFeedback: 'Outstanding! Your Swahili pronunciation is very clear.',
      tips: 'Native speakers will understand you with ease.'
    };
  } else if (finalScore >= 68) {
    return {
      score: finalScore,
      spokenText: spoken,
      targetText: target,
      rating: 'good',
      swahiliFeedback: 'Vizuri sana! (Very good!)',
      englishFeedback: 'Good pronunciation! Clean and easily understood.',
      tips: 'Tip: Swahili stress almost always falls on the second-to-last syllable.'
    };
  } else if (finalScore >= 45) {
    return {
      score: finalScore,
      spokenText: spoken,
      targetText: target,
      rating: 'fair',
      swahiliFeedback: 'Karibu! (Getting close!)',
      englishFeedback: 'Close! A bit more clarity will make it perfect.',
      tips: 'Listen to the native audio and emphasize each pure vowel (A-E-I-O-U).'
    };
  } else {
    return {
      score: finalScore,
      spokenText: spoken,
      targetText: target,
      rating: 'needs-practice',
      swahiliFeedback: 'Jaribu tena! (Try again!)',
      englishFeedback: "Didn't quite catch the words clearly. Give it another try!",
      tips: 'Tap "Listen" to hear the native rhythm, then tap the mic and repeat slowly.'
    };
  }
}

export interface RecognitionCallbacks {
  onStart?: () => void;
  onInterim?: (interimTranscript: string) => void;
  onResult: (finalTranscript: string) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

export class SwahiliSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;
  private autoStopTimer: any = null;

  constructor() {
    const SpeechRecognition =
      (typeof window !== 'undefined' &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      null;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;
      // 'sw-KE' (Swahili - Kenya) is widely supported in Web Speech API
      this.recognition.lang = 'sw-KE';
    }
  }

  public get isSupported(): boolean {
    return !!this.recognition;
  }

  public get active(): boolean {
    return this.isListening;
  }

  public start(callbacks: RecognitionCallbacks, timeoutMs: number = 7000): void {
    if (!this.recognition) {
      callbacks.onError?.('Speech recognition is not supported in this browser. Please try Chrome or Safari.');
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    let finalTranscript = '';
    let hasEmittedResult = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStart?.();

      // Safety timeout: stop after timeoutMs if silence or no end
      if (this.autoStopTimer) clearTimeout(this.autoStopTimer);
      this.autoStopTimer = setTimeout(() => {
        if (this.isListening) {
          this.stop();
        }
      }, timeoutMs);
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let bestFinal = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          // Take the primary alternative
          bestFinal = result[0].transcript;
          finalTranscript = bestFinal;
        } else {
          interim += result[0].transcript;
        }
      }

      if (interim) {
        callbacks.onInterim?.(interim);
      }

      if (bestFinal) {
        hasEmittedResult = true;
        callbacks.onResult(bestFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      let message = 'Could not recognize speech.';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        message = 'Microphone permission was denied. Please allow microphone access to practice pronunciation.';
      } else if (event.error === 'no-speech') {
        message = 'No speech detected. Please speak closer to your microphone.';
      } else if (event.error === 'network') {
        message = 'Speech recognition network error. Check your internet connection.';
      } else if (event.error === 'language-not-supported') {
        // Fallback retry with general Swahili or user default
        this.recognition.lang = 'sw';
        message = 'Retrying Swahili language model...';
      }
      callbacks.onError?.(message);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.autoStopTimer) {
        clearTimeout(this.autoStopTimer);
        this.autoStopTimer = null;
      }
      // If recognition ended without an explicit final result but we have some transcript
      if (!hasEmittedResult && finalTranscript) {
        hasEmittedResult = true;
        callbacks.onResult(finalTranscript);
      }
      callbacks.onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      console.warn('Speech recognition start failed or already active:', e);
      // If already started, stop and prompt retry
      try {
        this.recognition.stop();
      } catch (_) {}
      this.isListening = false;
    }
  }

  public stop(): void {
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public abort(): void {
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}
