import React, { useState, useMemo } from 'react';
import { Volume2, Heart, HeartOff, Mic } from 'lucide-react';
import { MOCK_PHRASES, Phrase } from '../data/phrases';
import { useOfflineProgress } from '../hooks/useOfflineProgress';
import { playSwahiliTTS } from '../lib/tts';
import PronunciationModal from '../components/PronunciationModal';

export default function Saved() {
  const { progress, updateProgress } = useOfflineProgress();
  const [practicingPhrase, setPracticingPhrase] = useState<Phrase | null>(null);

  const savedPhrases = useMemo(() => {
    const savedIds = progress.filter(p => p.isFavorited).map(p => p.phraseId);
    return MOCK_PHRASES.filter(p => savedIds.includes(p.id));
  }, [progress]);

  const playSound = async (text: string, audioUrl?: string) => {
    try {
      await playSwahiliTTS(text, undefined, audioUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFavorite = (e: React.MouseEvent, phraseId: string) => {
    e.stopPropagation();
    updateProgress(phraseId, { isFavorited: false });
  };

  const startPractice = (e: React.MouseEvent, phrase: Phrase) => {
    e.stopPropagation();
    setPracticingPhrase(phrase);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Saved Offline</h2>
        <p className="text-slate-500 text-sm mt-1">Your favorited phrases, available anytime for audio listening and pronunciation practice.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {savedPhrases.length > 0 ? (
          savedPhrases.map((phrase) => {
            const phraseProgress = progress.find(p => p.phraseId === phrase.id);
            const mastery = phraseProgress?.masteryScore;

            return (
              <button
                key={phrase.id}
                onClick={() => playSound(phrase.swahili_text, phrase.audio_url)}
                className="relative flex flex-col text-left p-4 rounded-3xl border-l-[8px] border-slate-300 bg-white shadow-sm active:scale-[0.98] transition-all group"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col pr-4 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-bold text-slate-800">{phrase.swahili_text}</span>
                      {mastery && mastery > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 border border-orange-200 text-swahili-orange">
                          <Mic size={10} />
                          <span>{mastery}% Match</span>
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs italic text-slate-500">"{phrase.phonetic_spelling}"</span>
                    <span className="text-[10px] mt-1 font-medium text-slate-600">
                      {phrase.english_translation}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound(phrase.swahili_text, phrase.audio_url);
                      }}
                      title="Listen to native voice"
                      className="w-10 h-10 rounded-full bg-slate-50 shadow-sm flex items-center justify-center text-slate-700 hover:text-swahili-orange hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
                    >
                      <Volume2 size={19} />
                    </div>
                    <div
                      onClick={(e) => startPractice(e, phrase)}
                      title="Practice pronunciation"
                      className="w-10 h-10 rounded-full bg-orange-50 text-swahili-orange border border-orange-200/60 shadow-sm flex items-center justify-center hover:bg-swahili-orange hover:text-white active:scale-95 transition-all cursor-pointer"
                    >
                      <Mic size={19} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-slate-100">
                  <div 
                    onClick={(e) => removeFavorite(e, phrase.id)}
                    className="p-1 cursor-pointer z-10 text-slate-400 hover:text-red-500 flex items-center gap-1 text-xs"
                  >
                    <HeartOff size={15} />
                    <span>Remove from saved</span>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
            <Heart size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-600">No saved phrases yet</p>
            <p className="text-sm mt-2 max-w-xs mx-auto">Go to the Soundboard and tap the heart icon to save phrases for offline use.</p>
          </div>
        )}
      </div>

      <PronunciationModal
        phrase={practicingPhrase}
        isOpen={!!practicingPhrase}
        onClose={() => setPracticingPhrase(null)}
        onScoreSaved={(phraseId, score) => updateProgress(phraseId, { masteryScore: score })}
      />
    </section>
  );
}
