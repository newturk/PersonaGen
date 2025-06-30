import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, MessageSquare, Clock, Upload, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Memories',
      description: 'Share photos, videos, audio recordings, and written stories to build your digital persona.',
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Advanced AI extracts personality traits, emotional patterns, and life themes from your data.',
    },
    {
      icon: MessageSquare,
      title: 'Interactive Chat',
      description: 'Have meaningful conversations with your digital persona that reflects your authentic self.',
    },
    {
      icon: Clock,
      title: 'Memory Timeline',
      description: 'Explore your life story through an interactive timeline of key moments and experiences.',
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">AI-Powered Digital Identity</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Create Your
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Digital Persona
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your memories, stories, and experiences into an interactive AI persona that captures your essence, 
              personality, and wisdom for future generations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/upload" className="button-primary flex items-center justify-center space-x-2 text-lg">
              <span>Start Building</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="button-secondary text-lg">
              Watch Demo
            </button>
          </motion.div>

          {/* Floating Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mb-16"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 avatar-glow float-animation">
              <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-purple-500/30 pulse-ring"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Our advanced AI system transforms your personal data into a living digital representation of yourself.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl card-hover"
                >
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12 rounded-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Create Your Digital Legacy?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Start building your AI persona today and preserve your unique story for the future.
            </p>
            <Link to="/upload" className="button-primary text-lg inline-flex items-center space-x-2">
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;