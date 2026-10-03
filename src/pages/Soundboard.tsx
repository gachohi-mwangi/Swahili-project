import React, { useState, useMemo } from 'react';
import { Search, Volume2, Info, X, Heart, Mic, Headphones, ChevronDown } from 'lucide-react';
import { MOCK_PHRASES, CATEGORIES, Phrase } from '../data/phrases';
import { useOfflineProgress } from '../hooks/useOfflineProgress';
import { playSwahiliTTS } from '../lib/tts';
import PronunciationModal from '../components/PronunciationModal';

export default function Soundboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [mode, setMode] = useState<'listen' | 'practice'>('listen');
  const [practicingPhrase, setPracticingPhrase] = useState<Phrase | null>(null);
  const { progress, updateProgress } = useOfflineProgress();

  const filteredPhrases = useMemo(() => {
    let filtered = MOCK_PHRASES;
    
    if (activeCategory !== "All") {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.swahili_text.toLowerCase().includes(query) || 
        p.english_translation.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [searchQuery, activeCategory]);

  const playSound = async (text: string, audioUrl?: string) => {
    try {
      await playSwahiliTTS(text, undefined, audioUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardClick = (phrase: Phrase) => {
    if (mode === 'practice') {
      setPracticingPhrase(phrase);
    } else {
      playSound(phrase.swahili_text, phrase.audio_url);
    }
  };

  const startPractice = (e: React.MouseEvent, phrase: Phrase) => {
    e.stopPropagation();
    setPracticingPhrase(phrase);
  };

  const handleScoreSaved = (phraseId: string, score: number) => {
    updateProgress(phraseId, { masteryScore: score });
  };

  const getRatingStyles = (rating: number) => {
    if (rating >= 5) return "border-green-500 bg-green-50/50 text-green-700"; 
    if (rating >= 3) return "border-blue-500 bg-blue-50/50 text-blue-700";   
    return "border-amber-500 bg-amber-50/50 text-amber-700";                 
  };

  const toggleFavorite = (e: React.MouseEvent, phraseId: string) => {
    e.stopPropagation();
    const isFavorited = progress.find(p => p.phraseId === phraseId)?.isFavorited;
    updateProgress(phraseId, { isFavorited: !isFavorited });
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Search and Category Filters */}
      <div className="relative sticky top-16 z-40 py-2 bg-transparent flex flex-col gap-3">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search 'water' or 'shikamoo'..."
            className="w-full pl-12 pr-4 py-4 bg-slate-100/80 backdrop-blur rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 p-1 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Listen vs Practice Mode Switch */}
        <div className="flex items-center justify-between bg-slate-100/90 backdrop-blur p-1 rounded-2xl border border-slate-200/80 shadow-xs">
          <button
            onClick={() => setMode('listen')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'listen'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Headphones size={15} className={mode === 'listen' ? 'text-swahili-orange' : ''} />
            <span>Listen Mode (Sikiliza)</span>
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'practice'
                ? 'bg-swahili-orange text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mic size={15} />
            <span>Practice Voice (Tamka)</span>
          </button>
        </div>

        {mode === 'practice' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200/80 rounded-xl text-xs text-orange-950 animate-in fade-in duration-200">
            <Mic size={15} className="text-swahili-orange shrink-0 animate-pulse" />
            <span>
              <strong>Voice Practice Mode:</strong> Tap any word to record your voice and test your pronunciation!
            </span>
          </div>
        )}
        
        {/* Collapsible Categories Section with Dropdown Arrow */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            className="flex items-center justify-between py-1.5 px-3 bg-white/70 hover:bg-white rounded-xl border border-slate-200/80 transition-all text-left shadow-2xs group cursor-pointer"
            aria-expanded={isCategoriesExpanded}
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Categories
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100/70 text-swahili-orange border border-orange-200/60">
                {activeCategory === "All" ? "All Phrases" : activeCategory}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-800 transition-colors">
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600">
                {isCategoriesExpanded ? 'Collapse' : 'Show All'}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-200 ${
                  isCategoriesExpanded ? 'rotate-180 text-swahili-orange' : ''
                }`}
              />
            </div>
          </button>

          {isCategoriesExpanded && (
            <div className="flex flex-wrap gap-2 pb-2 animate-in fade-in duration-150">
              <button
                onClick={() => setActiveCategory("All")}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
                  activeCategory === "All" 
                    ? "bg-swahili-orange text-white shadow-md" 
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                All Phrases
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    activeCategory === category 
                      ? "bg-swahili-orange text-white shadow-md" 
                      : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {activeCategory === "All" ? "Emergency Soundboard" : activeCategory}
        </h2>
        <span className="text-[10px] font-bold text-swahili-orange">{filteredPhrases.length} PHRASES</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredPhrases.length > 0 ? (
          filteredPhrases.map((phrase) => {
            const phraseProgress = progress.find(p => p.phraseId === phrase.id);
            const isFavorited = phraseProgress?.isFavorited;
            const mastery = phraseProgress?.masteryScore;
            const ratingStyle = getRatingStyles(phrase.politeness_rating);
            const styleClasses = ratingStyle.split(" ");
            const bgBorderClass = styleClasses.slice(0, 2).join(" ");
            const textClass = styleClasses[2];
            
            return (
              <button
                key={phrase.id}
                onClick={() => handleCardClick(phrase)}
                className={`relative flex flex-col text-left p-4 rounded-3xl border-l-[8px] shadow-sm active:scale-[0.98] transition-all group ${bgBorderClass}`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col pr-4 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-bold text-slate-800">{phrase.swahili_text}</span>
                      {mastery && mastery > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 border border-slate-200 text-slate-700 shadow-2xs">
                          <Mic size={10} className="text-swahili-orange" />
                          <span>{mastery}%</span>
                          <span className="text-slate-400 font-normal">
                            {mastery >= 85 ? 'Bora' : mastery >= 68 ? 'Vizuri' : 'Karibu'}
                          </span>
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs italic text-slate-500">"{phrase.phonetic_spelling}"</span>
                    <span className={`text-[10px] mt-1 font-medium ${textClass}`}>
                      {phrase.english_translation}
                    </span>
                    
                    <div className="flex gap-2 mt-3 items-center">
                      <div 
                        onClick={(e) => toggleFavorite(e, phrase.id)}
                        className="p-1 -ml-1 cursor-pointer z-10 hover:bg-black/5 rounded-full transition-colors"
                        title={isFavorited ? "Saved" : "Save offline"}
                      >
                        <Heart size={16} className={isFavorited ? "fill-red-500 text-red-500" : "text-slate-400"} />
                      </div>
                      <div className="group/info relative z-10">
                        <div className="p-1 cursor-help hover:bg-black/5 rounded-full transition-colors">
                          <Info size={16} className="text-slate-400" />
                        </div>
                        <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none">
                          {phrase.cultural_note}
                        </div>
                      </div>
                      {mode === 'practice' && (
                        <span className="text-[10px] font-semibold text-swahili-orange flex items-center gap-1">
                          <Mic size={11} /> Tap card to speak
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dual Action Buttons: Speaker (Listen) & Mic (Practice) with clear separation */}
                  <div className="flex items-center gap-2 shrink-0 self-center">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound(phrase.swahili_text, phrase.audio_url);
                      }}
                      title="Listen to native pronunciation"
                      className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-swahili-orange hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
                    >
                      <Volume2 size={19} />
                    </div>
                    <div
                      onClick={(e) => startPractice(e, phrase)}
                      title="Record and test pronunciation"
                      className="w-10 h-10 rounded-full bg-orange-50 text-swahili-orange border border-orange-200/60 shadow-sm flex items-center justify-center hover:bg-swahili-orange hover:text-white active:scale-95 transition-all cursor-pointer"
                    >
                      <Mic size={19} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No phrases found for "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Interactive Pronunciation Modal using SpeechRecognition API */}
      <PronunciationModal
        phrase={practicingPhrase}
        isOpen={!!practicingPhrase}
        onClose={() => setPracticingPhrase(null)}
        onScoreSaved={handleScoreSaved}
      />
    </section>
  );
}
