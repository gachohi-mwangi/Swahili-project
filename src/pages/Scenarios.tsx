import React, { useState } from 'react';
import ScenarioSimulator from '../components/ScenarioSimulator';
import { SCENARIOS, Scenario } from '../data/scenarios';
import { ChevronRight } from 'lucide-react';

export default function Scenarios() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  if (activeScenario) {
    return (
      <div className="pt-2">
        <ScenarioSimulator 
          scenario={activeScenario} 
          onBack={() => setActiveScenario(null)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Scenarios</h2>
        <p className="text-slate-500 text-sm mt-1">Practice 10 real-world Swahili situations.</p>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setActiveScenario(scenario)}
            className="flex flex-col text-left p-4 rounded-[24px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow active:scale-[0.99] group"
          >
            <div className="flex items-start justify-between w-full">
              <span className="text-[10px] uppercase tracking-wider font-bold text-swahili-orange/70">
                {scenario.category}
              </span>
              <div className="p-1.5 rounded-full bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-swahili-orange transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
            
            <h3 className="font-serif font-bold text-slate-800 mt-2 mb-1">
              {scenario.title}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-2">
              {scenario.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
