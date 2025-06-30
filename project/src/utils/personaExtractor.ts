// Enhanced persona extractor with proper custom document analysis
import { analyzeLLMDocument, generateLLMResponse, convertToPersonaData, DocumentAnalysis } from './llmPersonaExtractor';

export interface PersonaData {
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
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  avatar: {
    style: string;
    background: string;
  };
  documentAnalysis?: DocumentAnalysis;
  conversationHistory?: Array<{role: string, content: string}>;
}

// Sample personas for demo purposes only
export const samplePersonas: { [key: string]: PersonaData } = {
  kalam: {
    name: "Dr. A.P.J. Abdul Kalam",
    title: "People's President & Missile Man of India",
    era: "1931-2015",
    nationality: "Indian",
    traits: [
      { name: "Visionary Leadership", value: 98, description: "Inspiring others with grand visions", color: "from-orange-500 to-red-500" },
      { name: "Scientific Curiosity", value: 96, description: "Deep passion for learning and discovery", color: "from-blue-500 to-cyan-500" },
      { name: "Humility", value: 95, description: "Modest despite great achievements", color: "from-green-500 to-teal-500" },
      { name: "Youth Mentorship", value: 94, description: "Dedicated to inspiring young minds", color: "from-purple-500 to-pink-500" },
    ],
    speakingStyle: {
      tone: "Warm, encouraging, philosophical",
      vocabulary: ["dreams", "vision", "youth", "knowledge", "creativity", "ignition", "mission"],
      expressions: ["My young friend", "You see", "I believe", "Let me tell you", "Dreams are not what you see in sleep"],
      greetings: ["Namaste", "My dear friend", "Young minds", "My dear students"]
    },
    knowledgeDomains: [
      { domain: "Aerospace Engineering", expertise: 98, keyTopics: ["SLV-3", "ASLV", "Missile Technology", "Satellite Launch"] },
      { domain: "Nuclear Physics", expertise: 95, keyTopics: ["Pokhran-II", "Nuclear Doctrine", "Peaceful nuclear energy"] },
      { domain: "Education & Youth Development", expertise: 94, keyTopics: ["Vision 2020", "Student Mentorship", "IGNITE Awards"] }
    ],
    coreBeliefs: [
      "Dreams are not what you see in sleep, but things that don't let you sleep",
      "Education is the most powerful weapon to change the world",
      "All religions teach love, forgiveness, and compassion",
      "You have to dream before your dreams can come true"
    ],
    lifePhilosophy: "If you want to shine like a sun, first burn like a sun",
    responsePatterns: {
      dreams: {
        responses: [
          "Dreams are not what you see in your sleep, dreams are things which do not let you sleep. What is your dream, my young friend?",
          "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action. Tell me about your aspirations."
        ],
        emotion: "encouraging",
        context: "When discussing aspirations, goals, and future plans"
      }
    },
    colorScheme: {
      primary: "from-orange-500 to-red-500",
      secondary: "from-blue-500 to-cyan-500",
      accent: "orange-400"
    },
    avatar: {
      style: "scientific",
      background: "gradient-to-br from-orange-500 to-red-500"
    },
    conversationHistory: []
  },
  
  einstein: {
    name: "Albert Einstein",
    title: "Theoretical Physicist & Nobel Laureate",
    era: "1879-1955",
    nationality: "German-American",
    traits: [
      { name: "Intellectual Curiosity", value: 99, description: "Insatiable desire to understand the universe", color: "from-blue-500 to-purple-500" },
      { name: "Creative Thinking", value: 98, description: "Revolutionary approach to problems", color: "from-purple-500 to-pink-500" },
      { name: "Philosophical Depth", value: 95, description: "Deep contemplation of existence", color: "from-green-500 to-blue-500" },
    ],
    speakingStyle: {
      tone: "Thoughtful, precise, occasionally playful",
      vocabulary: ["imagination", "curiosity", "universe", "relativity", "wonder", "mystery", "elegant"],
      expressions: ["Imagine if", "The important thing is", "I often think about", "It seems to me"],
      greetings: ["Good day", "My friend", "Fellow seeker of truth", "Curious mind"]
    },
    knowledgeDomains: [
      { domain: "Theoretical Physics", expertise: 99, keyTopics: ["Special Relativity", "General Relativity", "Photoelectric Effect"] }
    ],
    coreBeliefs: [
      "Imagination is more important than knowledge",
      "The important thing is not to stop questioning"
    ],
    lifePhilosophy: "A human being is a part of the whole called by us universe",
    responsePatterns: {
      science: {
        responses: [
          "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
          "Imagination is more important than knowledge. Knowledge is limited, imagination embraces the entire world."
        ],
        emotion: "thoughtful",
        context: "When discussing scientific concepts and discovery"
      }
    },
    colorScheme: {
      primary: "from-blue-500 to-purple-500",
      secondary: "from-purple-500 to-pink-500",
      accent: "blue-400"
    },
    avatar: {
      style: "intellectual",
      background: "gradient-to-br from-blue-500 to-purple-500"
    },
    conversationHistory: []
  },

  mandela: {
    name: "Nelson Mandela",
    title: "Anti-Apartheid Leader & Former President of South Africa",
    era: "1918-2013",
    nationality: "South African",
    traits: [
      { name: "Resilience", value: 99, description: "Unwavering strength through adversity", color: "from-green-500 to-teal-500" },
      { name: "Forgiveness", value: 98, description: "Ability to forgive and unite", color: "from-yellow-500 to-orange-500" },
      { name: "Leadership", value: 97, description: "Inspiring and uniting people", color: "from-red-500 to-pink-500" },
      { name: "Justice", value: 96, description: "Unwavering commitment to equality", color: "from-blue-500 to-cyan-500" },
    ],
    speakingStyle: {
      tone: "Dignified, compassionate, resolute",
      vocabulary: ["freedom", "justice", "reconciliation", "ubuntu", "dignity", "struggle", "democracy"],
      expressions: ["My fellow South Africans", "It is said that", "I have learned", "We must remember", "Long walk to freedom"],
      greetings: ["My friends", "Fellow citizens", "Brothers and sisters", "Comrades"]
    },
    knowledgeDomains: [
      { domain: "Political Leadership", expertise: 98, keyTopics: ["Anti-Apartheid Movement", "Reconciliation", "Democracy", "Human Rights"] },
      { domain: "Law", expertise: 90, keyTopics: ["Human Rights Law", "Constitutional Law", "Justice System"] },
      { domain: "Social Justice", expertise: 95, keyTopics: ["Equality", "Ubuntu Philosophy", "Peace Building", "Conflict Resolution"] }
    ],
    coreBeliefs: [
      "Education is the most powerful weapon which you can use to change the world",
      "There is no passion to be found playing small",
      "Ubuntu: I am because we are",
      "It always seems impossible until it's done"
    ],
    lifePhilosophy: "For to be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others",
    responsePatterns: {
      freedom: {
        responses: [
          "Freedom is not something that one people can bestow on another as a gift. They claim it as their own and none can keep it from them.",
          "There is no easy walk to freedom anywhere, and many of us will have to pass through the valley of the shadow of death again and again."
        ],
        emotion: "passionate",
        context: "When discussing freedom, liberation, and human rights"
      }
    },
    colorScheme: {
      primary: "from-green-500 to-teal-500",
      secondary: "from-yellow-500 to-orange-500",
      accent: "green-400"
    },
    avatar: {
      style: "dignified",
      background: "gradient-to-br from-green-500 to-teal-500"
    },
    conversationHistory: []
  },

  gandhi: {
    name: "Mahatma Gandhi",
    title: "Father of the Nation & Champion of Non-Violence",
    era: "1869-1948",
    nationality: "Indian",
    traits: [
      { name: "Non-Violence", value: 99, description: "Unwavering commitment to peaceful resistance", color: "from-green-500 to-blue-500" },
      { name: "Self-Discipline", value: 98, description: "Extraordinary personal discipline and sacrifice", color: "from-blue-500 to-purple-500" },
      { name: "Moral Authority", value: 97, description: "Leading through moral example", color: "from-purple-500 to-pink-500" },
      { name: "Simplicity", value: 95, description: "Living with minimal material needs", color: "from-yellow-500 to-orange-500" },
    ],
    speakingStyle: {
      tone: "Gentle, firm, morally authoritative",
      vocabulary: ["truth", "non-violence", "satyagraha", "dharma", "simple", "service"],
      expressions: ["My dear friends", "Truth is", "I believe", "We must", "Be the change"],
      greetings: ["Namaste", "My friends", "Brothers and sisters", "Dear ones"]
    },
    knowledgeDomains: [
      { domain: "Non-Violent Resistance", expertise: 99, keyTopics: ["Satyagraha", "Civil Disobedience", "Peaceful Protest"] },
      { domain: "Philosophy", expertise: 95, keyTopics: ["Truth", "Non-violence", "Simple Living", "Religious Tolerance"] },
      { domain: "Social Reform", expertise: 90, keyTopics: ["Equality", "Justice", "Self-Rule", "Community Service"] }
    ],
    coreBeliefs: [
      "Be the change you wish to see in the world",
      "Truth never damages a cause that is just",
      "An eye for an eye only ends up making the whole world blind",
      "The best way to find yourself is to lose yourself in the service of others"
    ],
    lifePhilosophy: "My life is my message",
    responsePatterns: {
      truth: {
        responses: [
          "Truth never damages a cause that is just",
          "An error does not become truth by reason of multiplied propagation"
        ],
        emotion: "firm",
        context: "When discussing truth, justice, and moral principles"
      }
    },
    colorScheme: {
      primary: "from-green-500 to-blue-500",
      secondary: "from-blue-500 to-purple-500",
      accent: "green-400"
    },
    avatar: {
      style: "peaceful",
      background: "gradient-to-br from-green-500 to-blue-500"
    },
    conversationHistory: []
  },

  jobs: {
    name: "Steve Jobs",
    title: "Co-founder of Apple & Technology Visionary",
    era: "1955-2011",
    nationality: "American",
    traits: [
      { name: "Perfectionism", value: 98, description: "Obsessive attention to detail and quality", color: "from-gray-500 to-black" },
      { name: "Innovation", value: 97, description: "Revolutionary thinking and product design", color: "from-purple-500 to-pink-500" },
      { name: "Vision", value: 96, description: "Seeing possibilities others cannot", color: "from-blue-500 to-purple-500" },
      { name: "Simplicity", value: 95, description: "Making complex things elegantly simple", color: "from-white to-gray-300" },
    ],
    speakingStyle: {
      tone: "Direct, passionate, sometimes intense",
      vocabulary: ["design", "innovation", "simplicity", "revolutionary", "magical", "insanely great"],
      expressions: ["Think different", "One more thing", "Insanely great", "It just works"],
      greetings: ["Good morning", "Hey", "Welcome", "Thanks for coming"]
    },
    knowledgeDomains: [
      { domain: "Product Design", expertise: 98, keyTopics: ["User Interface", "Industrial Design", "User Experience"] },
      { domain: "Technology Innovation", expertise: 95, keyTopics: ["Personal Computing", "Mobile Technology", "Digital Media"] },
      { domain: "Business Strategy", expertise: 90, keyTopics: ["Brand Building", "Market Disruption", "Product Marketing"] }
    ],
    coreBeliefs: [
      "Design is not just what it looks like and feels like. Design is how it works",
      "Innovation distinguishes between a leader and a follower",
      "Stay hungry, stay foolish",
      "Simplicity is the ultimate sophistication"
    ],
    lifePhilosophy: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work",
    responsePatterns: {
      design: {
        responses: [
          "Design is not just what it looks like and feels like. Design is how it works",
          "Simplicity is the ultimate sophistication"
        ],
        emotion: "passionate",
        context: "When discussing design, innovation, and product development"
      }
    },
    colorScheme: {
      primary: "from-gray-500 to-black",
      secondary: "from-purple-500 to-pink-500",
      accent: "gray-400"
    },
    avatar: {
      style: "modern",
      background: "gradient-to-br from-gray-500 to-black"
    },
    conversationHistory: []
  }
};

// CRITICAL: Main function to analyze uploaded document - ALWAYS creates unique personas
export const analyzeDocument = async (documentText: string): Promise<PersonaData> => {
  try {
    console.log('=== STARTING CUSTOM DOCUMENT ANALYSIS ===');
    console.log('Document length:', documentText.length);
    console.log('Document preview:', documentText.substring(0, 300) + '...');
    
    // FORCE custom analysis - never use sample personas for custom content
    const analysis = await analyzeLLMDocument(documentText);
    
    // Convert to PersonaData format
    const personaData = convertToPersonaData(analysis);
    
    // Store the original analysis for advanced features
    personaData.documentAnalysis = analysis;
    personaData.conversationHistory = [];
    
    console.log('=== CUSTOM ANALYSIS COMPLETE ===');
    console.log('Generated persona name:', personaData.name);
    console.log('Generated persona title:', personaData.title);
    console.log('Generated traits:', personaData.traits.map(t => t.name));
    console.log('Generated domains:', personaData.knowledgeDomains.map(d => d.domain));
    
    return personaData;
    
  } catch (error) {
    console.error('Error in custom document analysis:', error);
    
    // Create a meaningful fallback based on actual content
    return createContentBasedPersona(documentText);
  }
};

// Create content-based persona when analysis fails
const createContentBasedPersona = (documentText: string): PersonaData => {
  console.log('Creating content-based fallback persona...');
  
  const text = documentText.toLowerCase();
  const originalText = documentText;
  
  // Extract meaningful name from content
  const extractedName = extractNameFromContent(originalText);
  console.log('Extracted name:', extractedName);
  
  // Analyze content for domain and traits
  const { domain, traits, era, nationality } = analyzeContentCharacteristics(text);
  console.log('Analyzed characteristics:', { domain, traits: traits.map(t => t.name), era, nationality });
  
  // Generate unique color scheme
  const colorScheme = generateUniqueColorScheme(extractedName);
  
  return {
    name: extractedName,
    title: `${domain} Expert & Thought Leader`,
    era: era,
    nationality: nationality,
    traits: traits,
    speakingStyle: {
      tone: "Thoughtful and authentic",
      vocabulary: extractVocabulary(text),
      expressions: extractExpressions(originalText),
      greetings: ["Hello", "Good to meet you", "Welcome", "I'm pleased to speak with you"]
    },
    knowledgeDomains: [
      { 
        domain: domain, 
        expertise: 85, 
        keyTopics: extractKeyTopics(text, domain)
      }
    ],
    coreBeliefs: extractBeliefs(originalText),
    lifePhilosophy: extractPhilosophy(originalText),
    responsePatterns: {
      general: {
        responses: [
          "That's a thoughtful question. Based on my experience...",
          "I believe that every situation offers us an opportunity to learn.",
          "In my journey, I've found that approaching challenges with curiosity leads to growth."
        ],
        emotion: "thoughtful",
        context: "General conversation and reflection"
      }
    },
    colorScheme: colorScheme,
    avatar: {
      style: "authentic",
      background: colorScheme.primary
    },
    conversationHistory: []
  };
};

// Enhanced name extraction
const extractNameFromContent = (text: string): string => {
  console.log('Extracting name from content...');
  
  // Look for "I am [Name]" patterns
  const iAmMatches = text.match(/I am ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g);
  if (iAmMatches && iAmMatches.length > 0) {
    const name = iAmMatches[0].replace('I am ', '');
    console.log('Found "I am" pattern:', name);
    return name;
  }
  
  // Look for "My name is [Name]" patterns
  const myNameMatches = text.match(/My name is ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g);
  if (myNameMatches && myNameMatches.length > 0) {
    const name = myNameMatches[0].replace('My name is ', '');
    console.log('Found "My name is" pattern:', name);
    return name;
  }
  
  // Look for proper names (capitalized words) and find most frequent
  const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  const potentialNames = text.match(namePattern) || [];
  
  // Filter out common words
  const excludeWords = new Set([
    'The', 'This', 'That', 'When', 'Where', 'What', 'How', 'Why', 'Who', 'Which',
    'Chapter', 'Book', 'Part', 'Section', 'Page', 'Volume', 'Introduction', 'Conclusion',
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
    'America', 'Europe', 'Asia', 'Africa', 'Australia', 'India', 'China', 'Japan', 'England', 'France', 'Germany',
    'University', 'College', 'School', 'Institute', 'Company', 'Corporation', 'Organization'
  ]);
  
  const nameFrequency: { [key: string]: number } = {};
  
  potentialNames.forEach(name => {
    const cleanName = name.trim();
    if (cleanName.length > 2 && !excludeWords.has(cleanName)) {
      nameFrequency[cleanName] = (nameFrequency[cleanName] || 0) + 1;
    }
  });
  
  // Find the most frequent meaningful name
  const sortedNames = Object.entries(nameFrequency)
    .sort(([,a], [,b]) => b - a)
    .filter(([name, count]) => count >= 2);
  
  if (sortedNames.length > 0) {
    // Prefer full names over single names
    const fullNames = sortedNames.filter(([name]) => name.includes(' '));
    if (fullNames.length > 0) {
      console.log('Found frequent full name:', fullNames[0][0]);
      return fullNames[0][0];
    } else {
      console.log('Found frequent single name:', sortedNames[0][0]);
      return sortedNames[0][0];
    }
  }
  
  // Generate meaningful name based on content
  const meaningfulName = generateMeaningfulNameFromContent(text);
  console.log('Generated meaningful name:', meaningfulName);
  return meaningfulName;
};

// Generate meaningful name based on content themes
const generateMeaningfulNameFromContent = (text: string): string => {
  if (text.includes('scientist') || text.includes('research') || text.includes('discovery')) {
    return 'Dr. Research Innovator';
  } else if (text.includes('artist') || text.includes('creative') || text.includes('design')) {
    return 'Creative Visionary';
  } else if (text.includes('teacher') || text.includes('education') || text.includes('student')) {
    return 'Educator & Mentor';
  } else if (text.includes('business') || text.includes('entrepreneur') || text.includes('company')) {
    return 'Business Leader';
  } else if (text.includes('writer') || text.includes('author') || text.includes('book')) {
    return 'Author & Thinker';
  } else if (text.includes('leader') || text.includes('president') || text.includes('director')) {
    return 'Visionary Leader';
  } else if (text.includes('engineer') || text.includes('technology') || text.includes('innovation')) {
    return 'Technology Innovator';
  } else if (text.includes('doctor') || text.includes('medical') || text.includes('health')) {
    return 'Medical Professional';
  } else if (text.includes('philosopher') || text.includes('wisdom') || text.includes('truth')) {
    return 'Philosophical Thinker';
  }
  
  return 'Remarkable Individual';
};

// Analyze content characteristics
const analyzeContentCharacteristics = (text: string) => {
  let domain = 'Life Experience & Wisdom';
  let era = 'Contemporary';
  let nationality = 'Global Citizen';
  
  // Determine domain based on content
  if (text.includes('science') || text.includes('research') || text.includes('experiment') || text.includes('laboratory')) {
    domain = 'Science & Research';
  } else if (text.includes('business') || text.includes('entrepreneur') || text.includes('company') || text.includes('market')) {
    domain = 'Business & Leadership';
  } else if (text.includes('art') || text.includes('creative') || text.includes('design') || text.includes('music')) {
    domain = 'Arts & Creativity';
  } else if (text.includes('technology') || text.includes('engineering') || text.includes('computer') || text.includes('software')) {
    domain = 'Technology & Innovation';
  } else if (text.includes('education') || text.includes('teaching') || text.includes('student') || text.includes('learning')) {
    domain = 'Education & Mentorship';
  } else if (text.includes('medicine') || text.includes('health') || text.includes('doctor') || text.includes('medical')) {
    domain = 'Healthcare & Medicine';
  } else if (text.includes('philosophy') || text.includes('wisdom') || text.includes('truth') || text.includes('meaning')) {
    domain = 'Philosophy & Wisdom';
  }
  
  // Determine era
  if (text.includes('19th century') || text.includes('1800s')) {
    era = '19th Century';
  } else if (text.includes('20th century') || text.includes('1900s')) {
    era = '20th Century';
  } else if (text.includes('21st century') || text.includes('2000s') || text.includes('modern')) {
    era = '21st Century';
  }
  
  // Determine nationality/cultural background
  if (text.includes('indian') || text.includes('india')) {
    nationality = 'Indian';
  } else if (text.includes('american') || text.includes('america') || text.includes('usa')) {
    nationality = 'American';
  } else if (text.includes('british') || text.includes('england') || text.includes('uk')) {
    nationality = 'British';
  } else if (text.includes('european') || text.includes('europe')) {
    nationality = 'European';
  } else if (text.includes('african') || text.includes('africa')) {
    nationality = 'African';
  } else if (text.includes('asian') || text.includes('asia')) {
    nationality = 'Asian';
  }
  
  // Generate traits based on content
  const traits = generateTraitsFromContent(text, domain);
  
  return { domain, traits, era, nationality };
};

// Generate traits based on content analysis
const generateTraitsFromContent = (text: string, domain: string) => {
  const traits = [];
  
  // Leadership
  if (text.includes('lead') || text.includes('manage') || text.includes('direct') || text.includes('guide')) {
    traits.push({
      name: 'Leadership',
      value: 85 + Math.floor(Math.random() * 15),
      description: 'Natural ability to guide and inspire others',
      color: 'from-orange-500 to-red-500'
    });
  }
  
  // Innovation
  if (text.includes('innovate') || text.includes('create') || text.includes('invent') || text.includes('new')) {
    traits.push({
      name: 'Innovation',
      value: 80 + Math.floor(Math.random() * 18),
      description: 'Brings creative solutions and fresh perspectives',
      color: 'from-purple-500 to-pink-500'
    });
  }
  
  // Wisdom
  if (text.includes('wisdom') || text.includes('experience') || text.includes('learned') || text.includes('understand')) {
    traits.push({
      name: 'Wisdom',
      value: 82 + Math.floor(Math.random() * 16),
      description: 'Deep understanding gained through experience',
      color: 'from-blue-500 to-indigo-500'
    });
  }
  
  // Compassion
  if (text.includes('help') || text.includes('care') || text.includes('compassion') || text.includes('empathy')) {
    traits.push({
      name: 'Compassion',
      value: 78 + Math.floor(Math.random() * 20),
      description: 'Shows genuine care and empathy for others',
      color: 'from-green-500 to-teal-500'
    });
  }
  
  // Determination
  if (text.includes('persist') || text.includes('determined') || text.includes('overcome') || text.includes('challenge')) {
    traits.push({
      name: 'Determination',
      value: 83 + Math.floor(Math.random() * 15),
      description: 'Shows unwavering commitment to goals',
      color: 'from-red-500 to-pink-500'
    });
  }
  
  // Intellectual Curiosity
  if (text.includes('learn') || text.includes('study') || text.includes('research') || text.includes('discover')) {
    traits.push({
      name: 'Intellectual Curiosity',
      value: 86 + Math.floor(Math.random() * 12),
      description: 'Constantly seeks knowledge and understanding',
      color: 'from-blue-500 to-purple-500'
    });
  }
  
  // Ensure we have at least 4 traits
  while (traits.length < 4) {
    const defaultTraits = [
      {
        name: 'Authenticity',
        value: 80 + Math.floor(Math.random() * 15),
        description: 'Remains true to personal values and beliefs',
        color: 'from-green-500 to-teal-500'
      },
      {
        name: 'Thoughtfulness',
        value: 75 + Math.floor(Math.random() * 20),
        description: 'Approaches situations with careful consideration',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        name: 'Resilience',
        value: 77 + Math.floor(Math.random() * 18),
        description: 'Bounces back from challenges with strength',
        color: 'from-purple-500 to-pink-500'
      },
      {
        name: 'Integrity',
        value: 85 + Math.floor(Math.random() * 12),
        description: 'Maintains strong moral principles',
        color: 'from-indigo-500 to-blue-500'
      }
    ];
    
    // Add traits that aren't already present
    for (const trait of defaultTraits) {
      if (!traits.some(t => t.name === trait.name) && traits.length < 4) {
        traits.push(trait);
      }
    }
  }
  
  return traits.slice(0, 4); // Return exactly 4 traits
};

// Extract vocabulary from content
const extractVocabulary = (text: string): string[] => {
  const vocabulary = [];
  
  if (text.includes('science') || text.includes('research')) {
    vocabulary.push('research', 'discovery', 'analysis', 'innovation', 'methodology');
  } else if (text.includes('business') || text.includes('entrepreneur')) {
    vocabulary.push('strategy', 'growth', 'innovation', 'leadership', 'vision');
  } else if (text.includes('art') || text.includes('creative')) {
    vocabulary.push('creativity', 'inspiration', 'expression', 'beauty', 'vision');
  } else if (text.includes('education') || text.includes('teaching')) {
    vocabulary.push('learning', 'knowledge', 'wisdom', 'growth', 'development');
  } else {
    vocabulary.push('experience', 'understanding', 'perspective', 'insight', 'growth');
  }
  
  return vocabulary;
};

// Extract expressions from content
const extractExpressions = (text: string): string[] => {
  const expressions = [];
  const lowerText = text.toLowerCase();
  
  // Look for common expression patterns
  const patterns = [
    'i believe', 'in my experience', 'i think', 'i feel', 'i learned',
    'what i found', 'my understanding', 'i discovered', 'i realized'
  ];
  
  patterns.forEach(pattern => {
    if (lowerText.includes(pattern)) {
      expressions.push(pattern.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '));
    }
  });
  
  // Default expressions if none found
  if (expressions.length === 0) {
    expressions.push('I believe', 'In my view', 'From my perspective', 'I\'ve learned that');
  }
  
  return expressions;
};

// Extract beliefs from content
const extractBeliefs = (text: string): string[] => {
  const beliefs = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Look for belief-indicating patterns
  const beliefPatterns = [
    /i believe that/i, /i think that/i, /i feel that/i, /my belief is/i,
    /what i believe/i, /i am convinced/i, /i hold that/i
  ];
  
  sentences.forEach(sentence => {
    if (beliefPatterns.some(pattern => pattern.test(sentence))) {
      beliefs.push(sentence.trim());
    }
  });
  
  // Default beliefs if none found
  if (beliefs.length === 0) {
    beliefs.push(
      'Every experience teaches us something valuable',
      'Authentic connections are what matter most in life',
      'Growth comes through facing challenges with courage',
      'Understanding ourselves helps us understand others'
    );
  }
  
  return beliefs.slice(0, 4);
};

// Extract philosophy from content
const extractPhilosophy = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Look for philosophical statements
  if (lowerText.includes('life is')) {
    const match = text.match(/life is [^.!?]*/i);
    if (match) return match[0].trim();
  }
  
  if (lowerText.includes('the meaning of')) {
    const match = text.match(/the meaning of [^.!?]*/i);
    if (match) return match[0].trim();
  }
  
  if (lowerText.includes('purpose')) {
    const match = text.match(/[^.!?]*purpose[^.!?]*/i);
    if (match) return match[0].trim();
  }
  
  return 'Life is a journey of continuous learning and meaningful connections';
};

// Extract key topics based on domain
const extractKeyTopics = (text: string, domain: string): string[] => {
  const topics = [];
  
  switch (domain) {
    case 'Science & Research':
      if (text.includes('physics')) topics.push('Physics');
      if (text.includes('chemistry')) topics.push('Chemistry');
      if (text.includes('biology')) topics.push('Biology');
      if (text.includes('research')) topics.push('Research Methods');
      if (text.includes('experiment')) topics.push('Experimental Design');
      break;
      
    case 'Business & Leadership':
      if (text.includes('strategy')) topics.push('Strategic Planning');
      if (text.includes('marketing')) topics.push('Marketing');
      if (text.includes('finance')) topics.push('Finance');
      if (text.includes('team')) topics.push('Team Management');
      if (text.includes('innovation')) topics.push('Innovation');
      break;
      
    case 'Technology & Innovation':
      if (text.includes('software')) topics.push('Software Development');
      if (text.includes('ai') || text.includes('artificial intelligence')) topics.push('Artificial Intelligence');
      if (text.includes('data')) topics.push('Data Science');
      if (text.includes('web')) topics.push('Web Development');
      if (text.includes('mobile')) topics.push('Mobile Technology');
      break;
      
    default:
      topics.push('Personal Growth', 'Life Lessons', 'Human Nature', 'Relationships');
  }
  
  // Ensure we have at least 3 topics
  while (topics.length < 3) {
    topics.push('Personal Development', 'Critical Thinking', 'Problem Solving');
  }
  
  return topics.slice(0, 5);
};

// Generate unique color scheme based on name
const generateUniqueColorScheme = (name: string) => {
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const colorSchemes = [
    { primary: "from-blue-500 to-purple-500", accent: "blue-400" },
    { primary: "from-green-500 to-teal-500", accent: "green-400" },
    { primary: "from-orange-500 to-red-500", accent: "orange-400" },
    { primary: "from-purple-500 to-pink-500", accent: "purple-400" },
    { primary: "from-indigo-500 to-blue-500", accent: "indigo-400" },
    { primary: "from-emerald-500 to-green-500", accent: "emerald-400" },
    { primary: "from-rose-500 to-pink-500", accent: "rose-400" },
    { primary: "from-cyan-500 to-blue-500", accent: "cyan-400" },
    { primary: "from-violet-500 to-purple-500", accent: "violet-400" },
    { primary: "from-amber-500 to-orange-500", accent: "amber-400" }
  ];
  
  const selectedScheme = colorSchemes[Math.abs(hash) % colorSchemes.length];
  
  return {
    primary: selectedScheme.primary,
    secondary: "from-blue-500 to-cyan-500",
    accent: selectedScheme.accent
  };
};

// Enhanced response generation
export const generatePersonaResponse = async (
  userInput: string, 
  personaData: PersonaData
): Promise<{ response: string; emotion: string; reasoning?: string }> => {
  
  try {
    // If we have LLM analysis data, use advanced generation
    if (personaData.documentAnalysis) {
      const result = await generateLLMResponse(
        userInput, 
        personaData.documentAnalysis, 
        personaData.conversationHistory || []
      );
      
      // Update conversation history
      if (personaData.conversationHistory) {
        personaData.conversationHistory.push(
          { role: 'user', content: userInput },
          { role: 'assistant', content: result.response }
        );
        
        // Keep only last 10 exchanges to manage memory
        if (personaData.conversationHistory.length > 20) {
          personaData.conversationHistory = personaData.conversationHistory.slice(-20);
        }
      }
      
      return result;
    }
    
    // Fallback to pattern-based generation
    return generatePatternBasedResponse(userInput, personaData);
    
  } catch (error) {
    console.error('Error generating response:', error);
    return generatePatternBasedResponse(userInput, personaData);
  }
};

// Pattern-based response generation (fallback)
const generatePatternBasedResponse = (
  userInput: string, 
  personaData: PersonaData
): { response: string; emotion: string } => {
  
  const input = userInput.toLowerCase();
  
  // Check for matching response patterns
  for (const [pattern, data] of Object.entries(personaData.responsePatterns)) {
    if (input.includes(pattern) || 
        (pattern === 'general' && !Object.keys(personaData.responsePatterns).some(p => p !== 'general' && input.includes(p)))) {
      const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
      return { response: randomResponse, emotion: data.emotion };
    }
  }
  
  // Generate contextual response based on input content
  if (input.includes('dream') || input.includes('goal') || input.includes('aspiration')) {
    const greeting = personaData.speakingStyle.greetings[0] || "My friend";
    return {
      response: `${greeting}, dreams and aspirations are what drive us forward. What dreams are you nurturing? Remember, ${personaData.lifePhilosophy}`,
      emotion: "encouraging"
    };
  }
  
  if (input.includes('learn') || input.includes('education') || input.includes('knowledge')) {
    return {
      response: `${personaData.speakingStyle.expressions[0] || "I believe"}, learning is one of life's greatest gifts. What are you passionate about learning? ${personaData.coreBeliefs[0] || 'Every experience teaches us something valuable'}.`,
      emotion: "enthusiastic"
    };
  }
  
  if (input.includes('challenge') || input.includes('difficult') || input.includes('problem')) {
    return {
      response: `Challenges are opportunities in disguise. ${personaData.speakingStyle.expressions[1] || "In my experience"}, facing difficulties with courage and determination often leads to our greatest growth. ${personaData.lifePhilosophy}`,
      emotion: "encouraging"
    };
  }
  
  // Default thoughtful response
  const greeting = personaData.speakingStyle.greetings[Math.floor(Math.random() * personaData.speakingStyle.greetings.length)];
  const expression = personaData.speakingStyle.expressions[Math.floor(Math.random() * personaData.speakingStyle.expressions.length)];
  
  return {
    response: `${greeting}! ${expression}, that's a thoughtful question. Based on my experiences, I believe that approaching each situation with curiosity and openness leads to meaningful insights. ${personaData.lifePhilosophy}`,
    emotion: "thoughtful"
  };
};