import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Users, Globe, Heart, Lightbulb } from 'lucide-react';

interface PersonaAnalysisProps {
  analysisData: {
    name: string;
    title: string;
    era: string;
    nationality: string;
    traits: Array<{
      name: string;
      value: number;
      description: string;
      color: string;
    }>;
    speakingStyle: {
      tone: string;
      vocabulary: string[];
      expressions: string[];
      greetings: string[];
    };
    knowledgeDomains: Array<{
      domain: string;
      expertise: number;
      keyTopics: string[];
    }>;
    coreBeliefs: string[];
    lifePhilosophy: string;
    responsePatterns: {
      [key: string]: {
        responses: string[];
        emotion: string;
        context: string;
      };
    };
  };
}

const PersonaAnalyzer: React.FC<PersonaAnalysisProps> = ({ analysisData }) => {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{analysisData.name}</h3>
            <p className="text-blue-300">{analysisData.title}</p>
            <p className="text-white/60 text-sm">{analysisData.era} • {analysisData.nationality}</p>
          </div>
        </div>
        <p className="text-white/80 italic">"{analysisData.lifePhilosophy}"</p>
      </motion.div>

      {/* Speaking Style Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-xl"
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-400" />
          Communication Style
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-white/70 text-sm mb-2">Tone: <span className="text-pink-300">{analysisData.speakingStyle.tone}</span></p>
            <div className="space-y-1">
              <p className="text-white/60 text-xs">Common Expressions:</p>
              {analysisData.speakingStyle.expressions.slice(0, 3).map((expr, i) => (
                <p key={i} className="text-pink-200 text-xs">• "{expr}"</p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-2">Typical Greetings:</p>
            {analysisData.speakingStyle.greetings.map((greeting, i) => (
              <p key={i} className="text-pink-200 text-xs">• {greeting}</p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Core Beliefs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-xl"
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
          Core Beliefs & Values
        </h4>
        <div className="grid md:grid-cols-2 gap-2">
          {analysisData.coreBeliefs.map((belief, i) => (
            <div key={i} className="bg-yellow-500/10 border-l-2 border-yellow-400 p-2 rounded">
              <p className="text-yellow-200 text-sm">{belief}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PersonaAnalyzer;