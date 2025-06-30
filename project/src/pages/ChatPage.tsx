import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Brain, User, Volume2, BookOpen, Heart, Lightbulb, Star } from 'lucide-react';
import { PersonaData, generatePersonaResponse } from '../utils/personaExtractor';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'persona';
  timestamp: Date;
  isTyping?: boolean;
  emotion?: 'thoughtful' | 'passionate' | 'wise' | 'encouraging';
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [fullText, setFullText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load persona data from localStorage
    const storedPersona = localStorage.getItem('currentPersona');
    const storedFullText = localStorage.getItem('currentPersonaFullText');
    if (storedPersona) {
      const persona = JSON.parse(storedPersona);
      setPersonaData(persona);
      if (storedFullText) setFullText(storedFullText);
      
      // Set initial greeting message
      const greeting = getPersonalizedGreeting(persona);
      setMessages([{
        id: '1',
        content: greeting,
        sender: 'persona',
        timestamp: new Date(),
        emotion: 'encouraging'
      }]);
    }
  }, []);

  const getPersonalizedGreeting = (persona: PersonaData): string => {
    const greeting = persona.speakingStyle.greetings[0] || "Hello";
    const expression = persona.speakingStyle.expressions[0] || "I'm pleased to meet you";
    
    return `${greeting}! I am ${persona.name}, and ${expression.toLowerCase()}. ${persona.lifePhilosophy} What would you like to discuss today?`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !personaData) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Generate persona-specific response from backend
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: personaData,
          history: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.content })),
          message: currentInput,
          full_text: fullText || undefined
        }),
      });
      const data = await res.json();
      const personaMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'persona',
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, personaMessage]);
    } catch (error) {
      setIsTyping(false);
      // Optionally show an error message
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'passionate': return 'from-red-500 to-orange-500';
      case 'wise': return 'from-blue-500 to-indigo-500';
      case 'encouraging': return 'from-green-500 to-teal-500';
      case 'thoughtful': return 'from-purple-500 to-pink-500';
      default: return personaData?.colorScheme.primary || 'from-purple-500 to-pink-500';
    }
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'passionate': return <Heart className="w-4 h-4" />;
      case 'wise': return <BookOpen className="w-4 h-4" />;
      case 'encouraging': return <Lightbulb className="w-4 h-4" />;
      case 'thoughtful': return <Brain className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getSuggestedTopics = () => {
    if (!personaData) return [];
    
    return personaData.knowledgeDomains.slice(0, 5).map(domain => domain.domain);
  };

  if (!personaData) {
    return (
      <div className="pt-16 h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white/70">Loading persona...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 h-screen flex flex-col">
      {/* Dynamic Header with Persona Info */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${personaData.colorScheme.primary} avatar-glow`}>
              <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black/50 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg">{personaData.name}</h2>
            <p className={`text-${personaData.colorScheme.accent} text-sm font-medium`}>{personaData.title}</p>
            <p className="text-white/60 text-xs">{personaData.era} • {personaData.nationality}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {personaData.traits.slice(0, 3).map((trait) => (
                <span key={trait.name} className={`px-2 py-0.5 bg-${personaData.colorScheme.accent}/20 text-${personaData.colorScheme.accent} text-xs rounded-full`}>
                  {trait.name.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <button className="text-white/70 hover:text-white transition-colors mb-2">
              <Volume2 className="w-5 h-5" />
            </button>
            <p className="text-white/50 text-xs">Speaking Style: {personaData.speakingStyle.tone}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-500' 
                      : `bg-gradient-to-br ${getEmotionColor(message.emotion)}`
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      getEmotionIcon(message.emotion)
                    )}
                  </div>
                  <div>
                    <div className={`rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : `glass-card text-white border-l-4 border-${personaData.colorScheme.accent}`
                    }`}>
                      <p className="leading-relaxed text-sm md:text-base">{message.content}</p>
                      {message.emotion && message.sender === 'persona' && (
                        <div className={`flex items-center space-x-1 mt-2 text-${personaData.colorScheme.accent} text-xs`}>
                          {getEmotionIcon(message.emotion)}
                          <span className="capitalize">{message.emotion}</span>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs text-white/50 mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${personaData.colorScheme.primary} flex items-center justify-center`}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className={`glass-card rounded-2xl p-4 border-l-4 border-${personaData.colorScheme.accent}`}>
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 bg-${personaData.colorScheme.accent} rounded-full animate-bounce`}></div>
                    <div className={`w-2 h-2 bg-${personaData.colorScheme.accent} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`w-2 h-2 bg-${personaData.colorScheme.accent} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className={`text-${personaData.colorScheme.accent} text-xs mt-1`}>{personaData.name.split(' ')[0]} is thinking...</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input with Dynamic Suggestions */}
      <div className="bg-black/20 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Dynamic Topic Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-white/50 text-sm">Ask about:</span>
            {getSuggestedTopics().map((topic) => (
              <button
                key={topic}
                onClick={() => setInputValue(`Tell me about your experience with ${topic.toLowerCase()}`)}
                className={`px-3 py-1 bg-${personaData.colorScheme.accent}/20 hover:bg-${personaData.colorScheme.accent}/30 text-${personaData.colorScheme.accent} text-xs rounded-full transition-colors`}
              >
                {topic}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask ${personaData.name.split(' ')[0]} about their life, experiences, or wisdom...`}
                className="input-field pr-12"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                  inputValue.trim()
                    ? `bg-${personaData.colorScheme.accent} hover:bg-${personaData.colorScheme.accent}/80 text-white`
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-white/40 text-xs mt-2 text-center">
            This digital persona embodies {personaData.name}'s authentic personality, knowledge, and communication style
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;