const cache = new Map<string, string>();

let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentOnEnd: (() => void) | null = null;
let currentAbortController: AbortController | null = null;

export function stopSwahiliTTS() {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {
      // Ignore if already stopped
    }
    currentSource = null;
  }
  if (currentUtterance) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
  if (currentOnEnd) {
    currentOnEnd();
    currentOnEnd = null;
  }
}

export async function playSwahiliTTS(text: string, onEnd?: () => void) {
  try {
    stopSwahiliTTS();
    currentOnEnd = onEnd || null;
    currentAbortController = new AbortController();

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    let base64Audio = cache.get(text);

    if (!base64Audio) {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: currentAbortController.signal
      });

      if (!response.ok) {
        throw new Error('TTS API failed');
      }

      const data = await response.json();
      base64Audio = data.audio;
      if (base64Audio) {
        cache.set(text, base64Audio);
      }
    }

    if (!base64Audio) {
      if (currentOnEnd) currentOnEnd();
      return;
    }

    // Convert base64 to raw 16-bit PCM little-endian
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

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('TTS fetch aborted');
      return;
    }
    console.error("TTS playback failed:", error);
    // Fallback to SpeechSynthesis
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'sw-KE';
    msg.onend = () => {
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
}


