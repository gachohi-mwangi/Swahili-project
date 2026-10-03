const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No GEMINI_API_KEY available.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

function pcmToWav(pcmBuffer, sampleRate = 24000, numChannels = 1) {
  const header = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

const phrasesFile = fs.readFileSync(path.join(__dirname, '../src/data/phrases.ts'), 'utf-8');
const idMatches = [...phrasesFile.matchAll(/id:\s*"([^"]+)",\s*swahili_text:\s*"([^"]+)",[\s\S]*?audio_url:\s*"([^"]+)"/g)];

console.log('Found phrases count:', idMatches.length);

const audioDir = path.join(__dirname, '../public/audio');
fs.mkdirSync(audioDir, { recursive: true });

async function generateAll() {
  for (let i = 0; i < idMatches.length; i++) {
    const item = idMatches[i];
    const text = item[2];
    const url = item[3];
    const baseName = path.basename(url, path.extname(url));
    const filename = baseName + '.wav';
    const filePath = path.join(audioDir, filename);

    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      console.log(`[${i + 1}/${idMatches.length}] Skipping existing: ${filename}`);
      continue;
    }

    try {
      const promptText = (text.endsWith('.') || text.endsWith('?') || text.endsWith('!')) ? text : (text + '.');
      const res = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: promptText }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Aoede' }
            }
          }
        }
      });

      const b64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) throw new Error('No audio returned');
      const pcm = Buffer.from(b64, 'base64');
      const wav = pcmToWav(pcm);
      fs.writeFileSync(filePath, wav);
      console.log(`[${i + 1}/${idMatches.length}] Generated ${filename} for "${text}" (${wav.length} bytes)`);
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`Failed for "${text}":`, err.message);
    }
  }
  console.log('All generation complete!');
}

generateAll();
