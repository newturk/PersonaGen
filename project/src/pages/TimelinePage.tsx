import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Star, Smile, Award, MapPin, Clock, Filter } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  period: string;
  emotion: 'joy' | 'love' | 'achievement' | 'growth' | 'adventure';
  location?: string;
  tags: string[];
  memories: string[];
}

const TimelinePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'First Day of School',
      description: 'A pivotal moment that shaped my love for learning and meeting new people.',
      date: 'September 1995',
      period: 'childhood',
      emotion: 'joy',
      location: 'Springfield Elementary',
      tags: ['education', 'milestone', 'friendship'],
      memories: [
        'The excitement of choosing my first backpack',
        'Meeting my best friend Sarah on the playground',
        'Learning to write my name in cursive'
      ]
    },
    {
      id: '2',
      title: 'Graduation Day',
      description: 'Achieving my degree and feeling ready to take on the world.',
      date: 'May 2010',
      period: 'education',
      emotion: 'achievement',
      location: 'State University',
      tags: ['graduation', 'achievement', 'family'],
      memories: [
        'The pride in my parents\' eyes',
        'Throwing my cap in the air with 500 classmates',
        'The speech about following your dreams'
      ]
    },
    {
      id: '3',
      title: 'First Job Promotion',
      description: 'Recognition of hard work and dedication in my career.',
      date: 'March 2013',
      period: 'career',
      emotion: 'achievement',
      location: 'Tech Corp',
      tags: ['career', 'promotion', 'success'],
      memories: [
        'The surprise announcement in the team meeting',
        'Celebrating with colleagues at dinner',
        'Calling family to share the good news'
      ]
    },
    {
      id: '4',
      title: 'Wedding Day',
      description: 'The most beautiful day surrounded by love and family.',
      date: 'June 2015',
      period: 'relationships',
      emotion: 'love',
      location: 'Garden Venue',
      tags: ['wedding', 'love', 'family'],
      memories: [
        'Walking down the aisle to my favorite song',
        'The heartfelt vows we wrote together',
        'Dancing under the stars until midnight'
      ]
    },
    {
      id: '5',
      title: 'First Marathon',
      description: 'Pushing my limits and discovering inner strength I never knew I had.',
      date: 'October 2018',
      period: 'personal',
      emotion: 'achievement',
      location: 'City Marathon',
      tags: ['fitness', 'challenge', 'perseverance'],
      memories: [
        'The months of training and early morning runs',
        'The wall at mile 20 and pushing through',
        'Crossing the finish line with tears of joy'
      ]
    },
    {
      id: '6',
      title: 'Volunteer Trip',
      description: 'A life-changing experience helping build homes for families in need.',
      date: 'July 2019',
      period: 'personal',
      emotion: 'growth',
      location: 'Rural Village',
      tags: ['volunteer', 'travel', 'purpose'],
      memories: [
        'Learning to lay bricks alongside local workers',
        'Sharing meals with host families',
        'The gratitude in children\'s eyes'
      ]
    }
  ];

  const periods = [
    { key: 'all', label: 'All Periods', color: 'bg-white/20' },
    { key: 'childhood', label: 'Childhood', color: 'bg-yellow-500/20' },
    { key: 'education', label: 'Education', color: 'bg-blue-500/20' },
    { key: 'career', label: 'Career', color: 'bg-green-500/20' },
    { key: 'relationships', label: 'Relationships', color: 'bg-pink-500/20' },
    { key: 'personal', label: 'Personal', color: 'bg-purple-500/20' }
  ];

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy': return <Smile className="w-5 h-5 text-yellow-400" />;
      case 'love': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'achievement': return <Award className="w-5 h-5 text-green-400" />;
      case 'growth': return <Star className="w-5 h-5 text-blue-400" />;
      default: return <Star className="w-5 h-5 text-purple-400" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy': return 'from-yellow-500 to-orange-500';
      case 'love': return 'from-pink-500 to-red-500';
      case 'achievement': return 'from-green-500 to-teal-500';
      case 'growth': return 'from-blue-500 to-cyan-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const filteredEvents = selectedPeriod === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(event => event.period === selectedPeriod);

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Memory Timeline</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Explore the key moments and experiences that shaped your personality and worldview.
          </p>
        </motion.div>

        {/* Period Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Filter className="w-5 h-5 text-white/70 mr-2" />
            <span className="text-white/70">Filter by period:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {periods.map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period.key
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-white/20 h-full"></div>

          <div className="space-y-12">
            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Event Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedEvent(event)}
                      className="glass-card p-6 rounded-xl cursor-pointer card-hover"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getEmotionIcon(event.emotion)}
                          <span className="text-white/60 text-sm font-medium">
                            {event.date}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1 text-white/50 text-sm">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-white/70 mb-4 leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative z-10">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getEmotionColor(event.emotion)} shadow-lg`}>
                      <div className="w-full h-full rounded-full bg-white/20"></div>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getEmotionIcon(selectedEvent.emotion)}
                      <span className="text-white/60 font-medium">
                        {selectedEvent.date}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedEvent.title}
                    </h2>
                    {selectedEvent.location && (
                      <div className="flex items-center space-x-1 text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-white/50 hover:text-white transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>

                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-400" />
                    Key Memories
                  </h3>
                  <div className="space-y-3">
                    {selectedEvent.memories.map((memory, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white/70">{memory}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 text-white/70 text-sm rounded-full capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimelinePage;