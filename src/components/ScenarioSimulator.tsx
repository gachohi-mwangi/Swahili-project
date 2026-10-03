import React, { useState } from 'react';
import { Heart, AlertCircle, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOfflineProgress } from '../hooks/useOfflineProgress';
import { Scenario, Choice } from '../data/scenarios';

interface Props {
  scenario: Scenario;
  onBack: () => void;
}

export default function ScenarioSimulator({ scenario, onBack }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [politeness, setPoliteness] = useState(50);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | null }>({ msg: '', type: null });
  const [isFinished, setIsFinished] = useState(false);
  
  const { updateProgress } = useOfflineProgress();

  const steps = scenario.steps;

  const handleChoice = (choice: Choice) => {
    const newPoliteness = Math.min(100, Math.max(0, politeness + choice.impact));
    setPoliteness(newPoliteness);
    setFeedback({ msg: choice.feedback, type: choice.isCorrect ? 'success' : 'error' });
    
    setTimeout(() => {
      setFeedback({ msg: '', type: null });
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsFinished(true);
        updateProgress(`scenario-${scenario.id}`, { masteryScore: newPoliteness });
      }
    }, 3000);
  };

  const resetGame = () => {
    setCurrentStep(0);
    setPoliteness(50);
    setIsFinished(false);
  };

  return (
    <div className="bg-[#2D4739] rounded-[32px] p-5 text-white shadow-lg mx-auto w-full max-w-md flex flex-col min-h-[450px]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </button>
            <span className="text-[10px] uppercase tracking-widest opacity-70">{scenario.category}</span>
          </div>
          <h3 className="font-serif text-lg leading-tight">{scenario.title}</h3>
        </div>
        <div className="bg-white/20 px-2 py-1 rounded text-[9px] font-bold">
          STEP {currentStep + 1}/{steps.length}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-xs opacity-90 italic mb-3">
          "{!isFinished ? steps[currentStep].context : 'Scenario complete!'}"
        </p>
        
        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: '50%' }}
            animate={{ width: `${politeness}%` }}
            className={`absolute left-0 top-0 bottom-0 transition-colors duration-500 ${politeness > 40 ? 'bg-green-400' : 'bg-red-400'}`}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[8px] uppercase tracking-tighter opacity-60">Politeness Meter</span>
          <span className="text-[8px] font-bold">{politeness}%</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-4">
        {!isFinished ? (
          <div className="space-y-3 relative flex-1 flex flex-col justify-end">
            <AnimatePresence mode="wait">
              {feedback.type ? (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl flex gap-3 items-center ${feedback.type === 'success' ? 'bg-green-500/20 text-green-100 border border-green-500/30' : 'bg-red-500/20 text-red-100 border border-red-500/30'}`}
                >
                  {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-medium">{feedback.msg}</p>
                </motion.div>
              ) : (
                <motion.div key="choices" className="grid gap-2 w-full">
                  {steps[currentStep].choices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-colors active:scale-[0.98]"
                    >
                      <span className="text-sm font-semibold">{choice.text}</span>
                      <p className="text-[9px] opacity-60">Choose this phrase</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 flex flex-col items-center gap-4 flex-1 justify-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif">Well Done!</h3>
              <p className="text-white/70 text-sm mt-2">
                {politeness > 70 
                  ? "You navigated this scenario perfectly with great 'Heshima' (Respect)."
                  : "You made it through, but you could have been a bit more polite. Practice makes perfect!"}
              </p>
            </div>
            <div className="flex gap-2 mt-2 w-full justify-center">
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors"
              >
                <RotateCcw size={16} />
                Retry
              </button>
              <button 
                onClick={onBack}
                className="flex items-center gap-2 bg-white text-[#2D4739] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors"
              >
                Return to List
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
