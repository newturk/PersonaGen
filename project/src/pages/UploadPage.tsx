import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image, Video, Mic, X, CheckCircle, Loader, Brain, Sparkles, Zap, BookOpen } from 'lucide-react';

const UploadPage = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<Array<{ name: string; type: string; size: number; status: 'uploading' | 'complete' | 'error' }>>([]);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string>('');
  const [processingStage, setProcessingStage] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  // Enhanced demo options with more variety
  const demoOptions = [
    {
      id: 'kalam',
      name: 'Dr. A.P.J. Abdul Kalam',
      description: 'Wings of Fire - The inspiring journey of India\'s Missile Man',
      preview: 'Born in Rameswaram, Tamil Nadu, I was the youngest of four brothers and one sister. My father Jainulabdeen was a boat owner and imam of a local mosque...',
      category: 'Scientist & Leader',
      era: '1931-2015',
      traits: ['Visionary', 'Humble', 'Inspiring']
    },
    {
      id: 'einstein',
      name: 'Albert Einstein',
      description: 'Autobiographical Notes - The mind that revolutionized physics',
      preview: 'The essential in the being of a man of my type lies precisely in what he thinks and how he thinks, not in what he does or suffers...',
      category: 'Physicist & Philosopher',
      era: '1879-1955',
      traits: ['Curious', 'Creative', 'Thoughtful']
    },
    {
      id: 'mandela',
      name: 'Nelson Mandela',
      description: 'Long Walk to Freedom - From prisoner to president',
      preview: 'I was born free in every way that I could know. Free to run in the fields near my mother\'s hut, free to swim in the clear stream...',
      category: 'Leader & Activist',
      era: '1918-2013',
      traits: ['Resilient', 'Forgiving', 'Just']
    },
    {
      id: 'gandhi',
      name: 'Mahatma Gandhi',
      description: 'The Story of My Experiments with Truth',
      preview: 'What I want to achieve - what I have been striving and pining to achieve these thirty years - is self-realization, to see God face to face...',
      category: 'Philosopher & Activist',
      era: '1869-1948',
      traits: ['Peaceful', 'Principled', 'Simple']
    },
    {
      id: 'jobs',
      name: 'Steve Jobs',
      description: 'Biography - The visionary who changed technology',
      preview: 'I was lucky - I found what I loved to do early in life. Woz and I started Apple in my parents\' garage when I was 20...',
      category: 'Entrepreneur & Innovator',
      era: '1955-2011',
      traits: ['Perfectionist', 'Innovative', 'Passionate']
    },
    {
      id: 'custom',
      name: 'Upload Your Own',
      description: 'Analyze any autobiography, biography, or personal documents',
      preview: 'Upload any biographical content and our AI will extract the personality, knowledge, and communication style of the person described...',
      category: 'Custom Analysis',
      era: 'Any Era',
      traits: ['Dynamic', 'Adaptive', 'Authentic']
    }
  ];

  const processingStages = [
    'Initializing advanced document analysis...',
    'Scanning content for main character identification...',
    'Extracting personality traits and behavioral patterns...',
    'Analyzing communication style and vocabulary...',
    'Mapping knowledge domains and expertise areas...',
    'Building emotional profile and response patterns...',
    'Creating authentic digital persona...',
    'Finalizing persona characteristics...'
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (fileList: File[]) => {
    const newFiles = fileList.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload process
    newFiles.forEach((_, index) => {
      setTimeout(() => {
        setFiles(prev => prev.map((file, i) => 
          i === prev.length - newFiles.length + index 
            ? { ...file, status: 'complete' } 
            : file
        ));
      }, 1000 + index * 500);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedDemo) {
      alert('Please select a demo persona or upload your own content');
      return;
    }

    setIsProcessing(true);
    
    // CRITICAL: Clear any previous data to ensure fresh analysis
    localStorage.removeItem('selectedPersona');
    localStorage.removeItem('customText');
    
    // Store the selected persona type for the persona builder
    if (selectedDemo && selectedDemo !== 'custom') {
      console.log('=== STORING SAMPLE PERSONA ===');
      console.log('Selected demo:', selectedDemo);
      localStorage.setItem('selectedPersona', selectedDemo);
    } else {
      console.log('=== STORING CUSTOM CONTENT ===');
      console.log('Text input length:', textInput.length);
      console.log('Files count:', files.length);
      
      if (!textInput.trim() && files.length === 0) {
        alert('Please provide some text content or upload files for analysis');
        setIsProcessing(false);
        return;
      }
      
      localStorage.setItem('selectedPersona', 'custom');
      localStorage.setItem('customText', textInput.trim());
    }
    
    // Simulate advanced processing with stages
    for (let i = 0; i < processingStages.length; i++) {
      setProcessingStage(processingStages[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Navigate to persona builder
    setTimeout(() => {
      navigate('/persona');
    }, 1000);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Mic className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Scientist')) return <Brain className="w-5 h-5" />;
    if (category.includes('Physicist')) return <Zap className="w-5 h-5" />;
    if (category.includes('Leader')) return <BookOpen className="w-5 h-5" />;
    if (category.includes('Entrepreneur')) return <Sparkles className="w-5 h-5" />;
    return <Brain className="w-5 h-5" />;
  };

  const handlePdfUpload = async (file: File) => {
    setIsExtracting(true);
    setExtractError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:8000/upload_pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.persona) {
        localStorage.setItem('currentPersona', JSON.stringify(data.persona));
        if (data.full_text) {
          localStorage.setItem('currentPersonaFullText', data.full_text);
        }
        setIsExtracting(false);
        alert('Persona extracted! You can now chat as this character.');
        navigate('/chat');
      } else {
        setExtractError('Error extracting persona: ' + (data.error || 'Unknown error'));
        setIsExtracting(false);
      }
    } catch (err) {
      setExtractError('Network or server error during extraction.');
      setIsExtracting(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      {/* Extraction Loading Overlay */}
      {isExtracting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
          <div className="flex flex-col items-center space-y-6 p-8 rounded-xl bg-gradient-to-br from-purple-900/80 to-slate-900/90 shadow-2xl">
            <Loader className="w-16 h-16 text-purple-400 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Extracting Persona...</h2>
            <p className="text-white/70 text-center max-w-xs">Analyzing your document and building a digital persona. This may take a few moments.</p>
            {extractError && (
              <div className="mt-4 text-red-400 bg-red-900/30 px-4 py-2 rounded-lg text-center">
                {extractError}
                <button className="block mt-2 text-white underline" onClick={() => setExtractError(null)}>Dismiss</button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Create Any Digital Persona</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
            Upload any autobiography, biography, or personal documents. Our advanced AI will analyze the content and create an authentic digital persona that thinks, speaks, and responds exactly like that person.
          </p>
          <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Authentic Personalities</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span>Dynamic Adaptation</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Demo Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 text-center flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
            Choose a Demo Persona or Upload Your Own
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoOptions.map((demo) => (
              <motion.div
                key={demo.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDemo(demo.id)}
                className={`glass-card p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedDemo === demo.id 
                    ? 'ring-2 ring-purple-400 bg-purple-500/20 shadow-2xl' 
                    : 'hover:bg-white/10 hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(demo.category)}
                    <span className="text-white/60 text-sm font-medium">{demo.category}</span>
                  </div>
                  {selectedDemo === demo.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2">{demo.name}</h3>
                <p className="text-white/60 text-sm mb-3">{demo.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-xs">{demo.era}</span>
                  <div className="flex space-x-1">
                    {demo.traits.map((trait, i) => (
                      <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-white/40 text-xs italic leading-relaxed">"{demo.preview}"</p>
                
                {selectedDemo === demo.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="flex items-center space-x-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Selected for persona generation</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Upload Section - Only show if custom is selected */}
        <AnimatePresence>
          {selectedDemo === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid lg:grid-cols-2 gap-8 mb-8"
            >
              {/* File Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-purple-400" />
                  Upload Documents
                </h2>
                
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive 
                      ? 'border-purple-400 bg-purple-500/10' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 mb-2">Drag and drop your files here</p>
                  <p className="text-white/50 text-sm mb-4">Autobiographies, biographies, personal documents, interviews</p>
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        if (file.type === 'application/pdf') {
                          handlePdfUpload(file);
                        } else {
                          handleFiles(Array.from(e.target.files));
                        }
                      }
                    }}
                    accept=".txt,.pdf,.doc,.docx,.rtf"
                  />
                  <button className="button-secondary">
                    Choose Files
                  </button>
                  <p className="text-white/40 text-xs mt-3">
                    Supported formats: PDF, DOC, DOCX, TXT, RTF
                  </p>
                </div>

                {/* Enhanced File List */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 space-y-3"
                    >
                      <h4 className="text-white font-medium">Uploaded Files</h4>
                      {files.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center space-x-3 bg-white/5 rounded-lg p-3"
                        >
                          <div className="text-purple-400">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{file.name}</p>
                            <p className="text-white/50 text-sm">{formatFileSize(file.size)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.status === 'uploading' && (
                              <div className="flex items-center space-x-2">
                                <Loader className="w-4 h-4 text-yellow-400 animate-spin" />
                                <span className="text-yellow-400 text-xs">Uploading...</span>
                              </div>
                            )}
                            {file.status === 'complete' && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-xs">Ready</span>
                              </div>
                            )}
                            <button
                              onClick={() => removeFile(index)}
                              className="text-white/50 hover:text-white transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Enhanced Text Input Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-400" />
                  Or Paste Text Content
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Biographical Content
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste autobiography, biography, interview transcripts, or personal story content here. The AI will analyze this content to identify the main character and extract their personality, communication style, and knowledge domains..."
                      className="input-field min-h-[300px] resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white/40 text-xs">
                        {textInput.length} characters
                      </span>
                      <span className="text-white/40 text-xs">
                        Minimum 500 characters recommended
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-300 font-medium mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Analysis Features
                    </h4>
                    <div className="text-white/60 text-sm space-y-2">
                      <p>🧠 <strong>Character Identification:</strong> Automatically identifies the main person in the content</p>
                      <p>✨ <strong>Personality Extraction:</strong> Core traits, emotional patterns, behavioral tendencies</p>
                      <p>🗣️ <strong>Communication Style:</strong> Tone, vocabulary, expressions, cultural context</p>
                      <p>📚 <strong>Knowledge Mapping:</strong> Expertise areas, achievements, life experiences</p>
                      <p>💭 <strong>Response Generation:</strong> Authentic replies based on personality analysis</p>
                    </div>
                  </div>

                  <div className="text-white/50 text-sm">
                    <p className="font-medium mb-2">💡 For optimal results, include content about:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Personal experiences and significant life events</li>
                      <li>Speaking style, quotes, and common expressions</li>
                      <li>Beliefs, values, and philosophical views</li>
                      <li>Professional achievements and areas of expertise</li>
                      <li>Personality traits and behavioral characteristics</li>
                      <li>Cultural background and historical context</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Submit Button with Processing States */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={handleSubmit}
            disabled={!selectedDemo || isProcessing}
            className={`button-primary text-lg px-8 py-4 ${
              !selectedDemo || isProcessing 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-3">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Analyzing & Building Persona...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Generate Digital Persona</span>
                <Sparkles className="w-5 h-5" />
              </div>
            )}
          </button>
          
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <p className="text-purple-300 text-sm font-medium">{processingStage}</p>
              <div className="w-64 mx-auto bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(processingStages.indexOf(processingStage) + 1) / processingStages.length * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </motion.div>
          )}
          
          <p className="text-white/50 text-sm mt-3">
            Our advanced AI will analyze the content and create an authentic digital representation that captures the person's essence, knowledge, and personality
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;