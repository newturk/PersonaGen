import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Heart, Star, Users } from 'lucide-react';
import { PersonaData } from '../utils/personaExtractor';

interface PersonaComparisonProps {
  personas: PersonaData[];
}

const PersonaComparison: React.FC<PersonaComparisonProps> = ({ personas }) => {
  const getTraitComparison = (traitName: string) => {
    return personas.map(persona => {
      const trait = persona.traits.find(t => t.name === traitName);
      return {
        name: persona.name,
        value: trait?.value || 0,
        color: persona.colorScheme.primary
      };
    });
  };

  const commonTraits = ['Leadership', 'Wisdom', 'Compassion', 'Innovation'];

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
        <Users className="w-6 h-6 mr-2 text-purple-400" />
        Persona Comparison
      </h3>
      
      <div className="space-y-6">
        {commonTraits.map((trait, index) => (
          <motion.div
            key={trait}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <h4 className="text-white font-medium">{trait}</h4>
            <div className="space-y-2">
              {getTraitComparison(trait).map((persona, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <span className="text-white/70 text-sm w-32 truncate">{persona.name}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${persona.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className={`h-full bg-gradient-to-r ${persona.color} rounded-full`}
                    />
                  </div>
                  <span className="text-white/60 text-sm w-12">{persona.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PersonaComparison;