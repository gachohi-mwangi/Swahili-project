const cache = new Map<string, string>();

let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentOnEnd: (() => void) | null = null;
let currentAbortController: AbortController | null = null;

let availableVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  availableVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    availableVoices = window.speechSynthesis.getVoices();
  };
}

export function stopSwahiliTTS() {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  if (currentSource) {
    try {
      currentSource.stop();
    } catch {
      // Ignore if already stopped
    }
    currentSource = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
  if (currentOnEnd) {
    currentOnEnd();
    currentOnEnd = null;
  }
}

// Find best female voice available in the client browser
function findBestFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  if (availableVoices.length === 0) {
    availableVoices = window.speechSynthesis.getVoices();
  }

  const voices = availableVoices;
  if (!voices || voices.length === 0) return null;

  // 1. Swahili female voice if installed
  const swahiliVoices = voices.filter(v => v.lang.toLowerCase().startsWith('sw'));
  const swahiliFemale = swahiliVoices.find(v =>
    /female|woman|girl|kore|natural/i.test(v.name)
  );
  if (swahiliFemale) return swahiliFemale;
  if (swahiliVoices.length > 0) return swahiliVoices[0];

  // 2. High-quality natural female voices across multilingual engines
  const femaleVoice = voices.find(v =>
    /female|woman|zira|samantha|karen|victoria|catherine|ava|allison|serena|moira|tessa|fiona|susan|joana|luciana|google.*female/i.test(v.name)
  );
  if (femaleVoice) return femaleVoice;

  return null;
}

// Fallback to browser SpeechSynthesis with warm, feminine vocal tuning
function playFemaleBrowserTTS(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  const msg = new SpeechSynthesisUtterance(text);
  const femaleVoice = findBestFemaleVoice();

  if (femaleVoice) {
    msg.voice = femaleVoice;
    msg.lang = femaleVoice.lang.startsWith('sw') ? femaleVoice.lang : 'sw-KE';
  } else {
    msg.lang = 'sw-KE';
  }

  // Pitch > 1.0 shifts formants to a feminine, clear voice range (prevents deep male robotic tone)
  msg.pitch = 1.25;
  // Slightly relaxed rate for clear, natural Swahili vowel enunciation
  msg.rate = 0.88;

  msg.onend = () => {
    if (currentUtterance === msg) {
      currentUtterance = null;
      if (currentOnEnd) {
        currentOnEnd();
        currentOnEnd = null;
      }
    }
  };

  msg.onerror = () => {
    if (currentUtterance === msg) {
      currentUtterance = null;
      if (currentOnEnd) {
        currentOnEnd();
        currentOnEnd = null;
      }
    }
  };

  currentUtterance = msg;
  window.speechSynthesis.speak(msg);
}

// Try fetching audio from server endpoints or direct client key
async function fetchGeminiAudio(text: string, signal: AbortSignal): Promise<string | null> {
  // 1. Try standard /api/tts endpoint
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal
    });
    if (res.ok) {
      const data = await res.json();
      if (data.audio) return data.audio;
    }
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
  }

  // 2. Try Netlify function endpoint directly (in case /api rewrite didn't trigger)
  try {
    const res = await fetch('/.netlify/functions/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal
    });
    if (res.ok) {
      const data = await res.json();
      if (data.audio) return data.audio;
    }
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
  }

  // 3. If a client-side GEMINI API key is provided via VITE_GEMINI_API_KEY
  const clientKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (clientKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${clientKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' }
                }
              }
            }
          }),
          signal
        }
      );
      if (res.ok) {
        const data = await res.json();
        const base64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64) return base64;
      }
    } catch (e: any) {
      if (e.name === 'AbortError') throw e;
    }
  }

  return null;
}

export async function playSwahiliTTS(text: string, onEnd?: () => void) {
  try {
    stopSwahiliTTS();
    currentOnEnd = onEnd || null;
    currentAbortController = new AbortController();

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    let base64Audio = cache.get(text);

    if (!base64Audio) {
      base64Audio = await fetchGeminiAudio(text, currentAbortController.signal);
      if (base64Audio) {
        cache.set(text, base64Audio);
      }
    }

    // If Gemini TTS succeeded with base64 PCM audio
    if (base64Audio) {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const int16Data = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }

      const buffer = audioCtx.createBuffer(1, float32Data.length, 24000);
      buffer.copyToChannel(float32Data, 0);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.onended = () => {
        if (currentSource === source) {
          currentSource = null;
          if (currentOnEnd) {
            currentOnEnd();
            currentOnEnd = null;
          }
        }
      };
      source.start();
      currentSource = source;
      return;
    }

    // Fallback: If no server/API audio was returned, use female-tuned SpeechSynthesis
    playFemaleBrowserTTS(text, currentOnEnd || undefined);

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return;
    }
    console.warn("Falling back to client voice synthesis:", error);
    playFemaleBrowserTTS(text, currentOnEnd || undefined);
  }
}
