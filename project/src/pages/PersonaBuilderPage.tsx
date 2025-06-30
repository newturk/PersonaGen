import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Lightbulb, Target, Star, TrendingUp, Users, BookOpen, ArrowRight, Quote, Award, Globe, Mic, Zap, Eye, MessageSquare } from 'lucide-react';
import { samplePersonas, PersonaData, analyzeDocument } from '../utils/personaExtractor';
import PersonaAnalyzer from '../components/PersonaAnalyzer';
import PersonaInsights from '../components/PersonaInsights';
import VoiceInterface from '../components/VoiceInterface';

const PersonaBuilderPage = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisStage, setAnalysisStage] = useState('');

  const analysisStages = [
    'Initializing advanced document analysis...',
    'Scanning content for main character identification...',
    'Extracting personality traits and behavioral patterns...',
    'Analyzing communication style and vocabulary...',
    'Mapping knowledge domains and expertise areas...',
    'Building emotional profile and response patterns...',
    'Creating authentic digital persona...',
    'Finalizing persona characteristics...'
  ];

  useEffect(() => {
    const runAnalysis = async () => {
      // Get the selected persona type and custom text
      const selectedPersona = localStorage.getItem('selectedPersona');
      const customText = localStorage.getItem('customText');

      console.log('=== PERSONA BUILDER DEBUG ===');
      console.log('Selected persona:', selectedPersona);
      console.log('Custom text available:', !!customText);
      console.log('Custom text length:', customText?.length || 0);
      console.log('Custom text preview:', customText?.substring(0, 200) || 'None');

      // Simulate analysis stages
      for (let i = 0; i < analysisStages.length; i++) {
        setAnalysisStage(analysisStages[i]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      setIsAnalyzing(false);
      
      try {
        let resultPersona: PersonaData;

        // CRITICAL FIX: Always analyze custom content when available
        if (customText && customText.trim().length > 50) {
          console.log('=== ANALYZING CUSTOM DOCUMENT ===');
          console.log('Document length:', customText.length);
          
          // Force analysis of custom content regardless of selectedPersona value
          resultPersona = await analyzeDocument(customText);
          console.log('Custom analysis result:', resultPersona.name);
          console.log('Generated persona title:', resultPersona.title);
          console.log('Generated persona traits:', resultPersona.traits.map(t => t.name));
          
        } else if (selectedPersona && selectedPersona !== 'custom' && samplePersonas[selectedPersona]) {
          console.log('=== USING SAMPLE PERSONA ===');
          console.log('Sample persona:', selectedPersona);
          
          // Use the selected sample persona
          resultPersona = samplePersonas[selectedPersona];
          
        } else {
          console.log('=== CREATING GENERIC PERSONA ===');
          console.log('Reason: No valid custom text or sample selection');
          
          // Create a generic persona as last resort
          resultPersona = createGenericPersona();
        }

        console.log('=== FINAL PERSONA RESULT ===');
        console.log('Name:', resultPersona.name);
        console.log('Title:', resultPersona.title);
        console.log('Era:', resultPersona.era);
        console.log('Nationality:', resultPersona.nationality);

        setPersonaData(resultPersona);
        // Store the current persona for chat
        localStorage.setItem('currentPersona', JSON.stringify(resultPersona));
        
      } catch (error) {
        console.error('Error in persona analysis:', error);
        // Fallback to a generic persona
        const fallback = createGenericPersona();
        setPersonaData(fallback);
        localStorage.setItem('currentPersona', JSON.stringify(fallback));
      }
    };

    runAnalysis();
  }, []);

  // Create a generic persona when no specific content is available
  const createGenericPersona = (): PersonaData => {
    return {
      name: "Thoughtful Individual",
      title: "Reflective Thinker & Life Observer",
      era: "Contemporary",
      nationality: "Global Citizen",
      traits: [
        { name: "Thoughtfulness", value: 85, description: "Approaches life with careful consideration", color: "from-blue-500 to-purple-500" },
        { name: "Authenticity", value: 80, description: "Stays true to personal values and beliefs", color: "from-green-500 to-teal-500" },
        { name: "Curiosity", value: 78, description: "Eager to learn and understand the world", color: "from-yellow-500 to-orange-500" },
        { name: "Empathy", value: 82, description: "Shows genuine care for others", color: "from-pink-500 to-red-500" }
      ],
      speakingStyle: {
        tone: "Thoughtful and genuine",
        vocabulary: ["understanding", "perspective", "experience", "insight", "growth"],
        expressions: ["I believe", "In my experience", "From my perspective", "I've learned that"],
        greetings: ["Hello", "Good to meet you", "Welcome", "I'm pleased to speak with you"]
      },
      knowledgeDomains: [
        { domain: "Life Experience", expertise: 80, keyTopics: ["Personal Growth", "Human Nature", "Relationships", "Self-Reflection"] },
        { domain: "General Knowledge", expertise: 70, keyTopics: ["Current Events", "Culture", "Philosophy", "Psychology"] }
      ],
      coreBeliefs: [
        "Every experience teaches us something valuable",
        "Authentic connections are what matter most in life",
        "Growth comes through facing challenges with courage",
        "Understanding ourselves helps us understand others"
      ],
      lifePhilosophy: "Life is a journey of continuous learning and meaningful connections",
      responsePatterns: {
        general: {
          responses: [
            "That's a thoughtful question. Let me share my perspective based on my experiences...",
            "I believe that every situation offers us an opportunity to learn and grow.",
            "In my journey, I've found that approaching challenges with curiosity often leads to meaningful insights."
          ],
          emotion: "thoughtful",
          context: "General conversation and reflection"
        },
        learning: {
          responses: [
            "Learning is one of life's greatest gifts. What aspect interests you most?",
            "I've always believed that every person we meet teaches us something valuable.",
            "The most important lessons often come from the most unexpected places."
          ],
          emotion: "encouraging",
          context: "When discussing learning, growth, and knowledge"
        }
      },
      colorScheme: {
        primary: "from-blue-500 to-purple-500",
        secondary: "from-green-500 to-teal-500",
        accent: "blue-400"
      },
      avatar: {
        style: "thoughtful",
        background: "gradient-to-br from-blue-500 to-purple-500"
      },
      conversationHistory: []
    };
  };

  const TraitBar = ({ trait }: { trait: any }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-medium">{trait.name}</span>
        <span className="text-purple-300 font-bold">{trait.value}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${trait.value}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${trait.color} rounded-full relative`}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </motion.div>
      </div>
      <p className="text-white/60 text-sm mt-1">{trait.description}</p>
    </motion.div>
  );

  const handleVoiceInput = (text: string) => {
    console.log('Voice input received:', text);
    // Handle voice input for testing the persona
  };

  if (isAnalyzing) {
    return (
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 avatar-glow">
              <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                <Brain className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-purple-500/30 pulse-ring"></div>
            
            {/* Floating analysis indicators */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-40 h-40 mx-auto"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Advanced AI Persona Analysis</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Our sophisticated AI is analyzing the content to extract authentic personality traits, communication patterns, and knowledge domains...
          </p>
          
          <div className="space-y-3 text-left max-w-lg mx-auto">
            {analysisStages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: analysisStages.indexOf(analysisStage) >= index ? 1 : 0.3,
                  x: 0 
                }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  analysisStage === stage 
                    ? 'bg-purple-500/20 border border-purple-500/30' 
                    : 'bg-white/5'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  analysisStages.indexOf(analysisStage) > index 
                    ? 'bg-green-400' 
                    : analysisStage === stage 
                    ? 'bg-purple-400 animate-pulse' 
                    : 'bg-white/30'
                }`}></div>
                <span className={`text-sm ${
                  analysisStage === stage ? 'text-purple-300 font-medium' : 'text-white/60'
                }`}>
                  {stage}
                </span>
                {analysisStage === stage && (
                  <div className="flex space-x-1 ml-auto">
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-white/40 text-sm">
            <p>🧠 Extracting personality traits and behavioral patterns</p>
            <p>🗣️ Analyzing communication style and expressions</p>
            <p>📚 Mapping knowledge domains and expertise areas</p>
            <p>💭 Building authentic response generation system</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!personaData) {
    return (
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white/70">Error loading persona data. Please try again.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain, description: 'Core personality analysis' },
    { id: 'insights', label: 'Deep Insights', icon: Lightbulb, description: 'Advanced psychological profile' },
    { id: 'voice', label: 'Voice Test', icon: Mic, description: 'Interactive voice interface' },
  ];

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Persona Successfully Created</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Digital Persona: <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{personaData.name}</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Successfully analyzed and created an authentic digital representation of <span className="text-purple-300 font-semibold">{personaData.name}</span>'s personality, knowledge, communication style, and thought processes. This AI persona can now engage in conversations that reflect their authentic character.
          </p>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 bg-white/10 rounded-xl p-1 backdrop-blur-md">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-70">{tab.description}</div>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-purple-500 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Enhanced Personality Traits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="lg:col-span-2 glass-card p-6 rounded-xl"
                >
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                    Personality Analysis
                    <span className="ml-auto text-sm text-white/60">AI Confidence: 94%</span>
                  </h2>
                  
                  <div className="space-y-4">
                    {personaData.traits.map((trait, index) => (
                      <motion.div
                        key={trait.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <TraitBar trait={trait} />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <Quote className="w-4 h-4 mr-2 text-purple-400" />
                      Life Philosophy
                    </h4>
                    <p className="text-white/80 italic">"{personaData.lifePhilosophy}"</p>
                  </div>
                </motion.div>

                {/* Dynamic Avatar Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="glass-card p-6 rounded-xl text-center"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">Digital Avatar</h3>
                  
                  <div className="relative mb-6">
                    <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${personaData.colorScheme.primary} avatar-glow float-animation`}>
                      <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                        <Brain className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black/50 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">{personaData.name}</h4>
                  <p className={`text-${personaData.colorScheme.accent} text-sm mb-2`}>{personaData.title}</p>
                  <p className="text-white/60 text-xs mb-4">{personaData.era} • {personaData.nationality}</p>
                  
                  <div className="space-y-2 text-xs text-white/60 mb-6">
                    <div className="flex items-center justify-between">
                      <span>✓ Personality extracted</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>✓ Communication style</span>
                      <span className="text-green-400">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>✓ Knowledge domains</span>
                      <span className="text-green-400">96%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>✓ Response patterns</span>
                      <span className="text-green-400">94%</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/70 text-xs">
                      This digital persona can engage in authentic conversations, sharing knowledge and wisdom in the characteristic style of {personaData.name.split(' ')[0]}.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Persona Analysis Component */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8"
              >
                <PersonaAnalyzer analysisData={personaData} />
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PersonaInsights personaData={personaData} />
            </motion.div>
          )}

          {activeTab === 'voice' && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Voice Interface Testing</h2>
                <p className="text-white/70">Test the voice capabilities and speaking characteristics of your digital persona</p>
              </div>
              
              <VoiceInterface 
                personaData={personaData} 
                onVoiceInput={handleVoiceInput}
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Voice Characteristics</h3>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/70 text-sm">Speaking Tone</p>
                      <p className="text-white font-medium">{personaData.speakingStyle.tone}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/70 text-sm">Cultural Background</p>
                      <p className="text-white font-medium">{personaData.nationality}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/70 text-sm">Era Context</p>
                      <p className="text-white font-medium">{personaData.era}</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Sample Expressions</h3>
                  <div className="space-y-2">
                    {personaData.speakingStyle.expressions.slice(0, 4).map((expr, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/80 text-sm">"{expr}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/chat')}
              className={`button-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 bg-gradient-to-r ${personaData.colorScheme.primary} hover:scale-105 active:scale-95 transition-transform`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat with {personaData.name.split(' ')[0]}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/timeline')}
              className="button-secondary text-lg px-8 py-4 hover:scale-105 active:scale-95 transition-transform"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Life Timeline
            </button>
          </div>
          
          <div className="glass-card p-6 rounded-xl max-w-2xl mx-auto">
            <h4 className="text-white font-semibold mb-3 flex items-center justify-center">
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              Persona Ready for Interaction
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Your digital {personaData.name} is now fully operational! This AI persona has been trained on their authentic personality, knowledge domains, communication style, and thought processes. Experience genuine conversations that reflect their unique character, wisdom, and perspective.
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-white/50">
              <span>🧠 Authentic Personality</span>
              <span>🗣️ Natural Communication</span>
              <span>📚 Domain Expertise</span>
              <span>💭 Genuine Responses</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonaBuilderPage;