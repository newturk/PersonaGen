import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Lightbulb, Target, Globe, BookOpen, Users, Star } from 'lucide-react';
import { PersonaData } from '../utils/personaExtractor';

interface PersonaInsightsProps {
  personaData: PersonaData;
}

const PersonaInsights: React.FC<PersonaInsightsProps> = ({ personaData }) => {
  const insights = [
    {
      icon: Brain,
      title: "Cognitive Style",
      description: `${personaData.name} demonstrates ${personaData.speakingStyle.tone.toLowerCase()} thinking patterns with a focus on ${personaData.knowledgeDomains[0]?.domain.toLowerCase() || 'general knowledge'}.`,
      score: Math.max(...personaData.traits.map(t => t.value)),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: `Shows strong empathy and emotional awareness, particularly in ${personaData.speakingStyle.tone.includes('compassionate') ? 'compassionate' : 'interpersonal'} interactions.`,
      score: personaData.traits.find(t => t.name.toLowerCase().includes('compassion') || t.name.toLowerCase().includes('empathy'))?.value || 75,
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation Capacity",
      description: `Demonstrates ${personaData.traits.find(t => t.name.toLowerCase().includes('creative') || t.name.toLowerCase().includes('innovation'))?.value || 80}% innovation potential through creative problem-solving approaches.`,
      score: personaData.traits.find(t => t.name.toLowerCase().includes('creative') || t.name.toLowerCase().includes('innovation'))?.value || 80,
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Leadership Style",
      description: `Exhibits ${personaData.traits.find(t => t.name.toLowerCase().includes('leadership'))?.value || 85}% leadership effectiveness with a focus on inspiring and mentoring others.`,
      score: personaData.traits.find(t => t.name.toLowerCase().includes('leadership'))?.value || 85,
      color: "from-green-500 to-teal-500"
    }
  ];

  const communicationMetrics = [
    { label: "Clarity", value: 92, description: "Clear and understandable communication" },
    { label: "Engagement", value: 88, description: "Ability to captivate and hold attention" },
    { label: "Authenticity", value: 95, description: "Genuine and true to character" },
    { label: "Adaptability", value: 85, description: "Adjusts style based on audience" }
  ];

  return (
    <div className="space-y-6">
      {/* Core Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-purple-400" />
          Personality Insights
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${insight.color} bg-opacity-20`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">{insight.title}</h4>
                  </div>
                  <span className="text-2xl font-bold text-white">{insight.score}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{insight.description}</p>
                <div className="mt-3 w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.score}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${insight.color} rounded-full`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Communication Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-purple-400" />
          Communication Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Communication Metrics</h4>
            <div className="space-y-4">
              {communicationMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{metric.label}</span>
                    <span className="text-purple-300 font-bold">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${personaData.colorScheme.primary} rounded-full`}
                    />
                  </div>
                  <p className="text-white/60 text-xs">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Speaking Patterns</h4>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/70 text-sm mb-1">Tone</p>
                <p className="text-white font-medium">{personaData.speakingStyle.tone}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/70 text-sm mb-1">Common Expressions</p>
                <div className="flex flex-wrap gap-1">
                  {personaData.speakingStyle.expressions.slice(0, 3).map((expr, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                      "{expr}"
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/70 text-sm mb-1">Vocabulary Focus</p>
                <div className="flex flex-wrap gap-1">
                  {personaData.speakingStyle.vocabulary.slice(0, 4).map((word, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Knowledge Depth Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-purple-400" />
          Knowledge Depth & Expertise
        </h3>
        
        <div className="space-y-4">
          {personaData.knowledgeDomains.map((domain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white/5 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">{domain.domain}</h4>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-bold">{domain.expertise}%</span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${domain.expertise}%` }}
                  transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${personaData.colorScheme.primary} rounded-full`}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {domain.keyTopics.map((topic, i) => (
                  <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PersonaInsights;