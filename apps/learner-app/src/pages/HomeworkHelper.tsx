import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Type, Send, Mic, MicOff, 
  BookOpen, Calculator, Beaker, Globe, 
  Lightbulb, CheckCircle, ArrowRight, 
  FileText, Image as ImageIcon, Trash2, 
  RotateCcw, Zap, Brain, HelpCircle, Star
} from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

interface HomeworkHelperProps {
  childName: string;
  childAge: number;
  onClose: () => void;
}

interface HomeworkStep {
  id: string;
  title: string;
  content: string;
  type: 'explanation' | 'example' | 'hint' | 'practice';
  isCompleted: boolean;
}

interface HomeworkAnalysis {
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  estimatedTime: number;
  steps: HomeworkStep[];
  encouragement: string;
}

export const HomeworkHelper: React.FC<HomeworkHelperProps> = ({
  childName,
  childAge,
  onClose,
}) => {
  const { theme } = useTheme();
  const [inputMethod, setInputMethod] = useState<'text' | 'camera' | 'upload' | null>(null);
  const [homeworkText, setHomeworkText] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HomeworkAnalysis | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock homework analysis function
  const analyzeHomework = useCallback(async (input: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on keywords
    let subject = 'Math';
    let topics = ['Basic Addition'];
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    
    if (input.toLowerCase().includes('multiplication') || input.toLowerCase().includes('times') || input.toLowerCase().includes('×')) {
      topics = ['Multiplication'];
      difficulty = childAge < 8 ? 'hard' : 'medium';
    } else if (input.toLowerCase().includes('division') || input.toLowerCase().includes('÷')) {
      topics = ['Division'];
      difficulty = childAge < 10 ? 'hard' : 'medium';
    } else if (input.toLowerCase().includes('fraction')) {
      topics = ['Fractions'];
      difficulty = 'medium';
    } else if (input.toLowerCase().includes('science') || input.toLowerCase().includes('experiment')) {
      subject = 'Science';
      topics = ['Scientific Method'];
      difficulty = 'medium';
    } else if (input.toLowerCase().includes('reading') || input.toLowerCase().includes('story')) {
      subject = 'Reading';
      topics = ['Reading Comprehension'];
      difficulty = 'easy';
    } else if (input.toLowerCase().includes('history') || input.toLowerCase().includes('past')) {
      subject = 'History';
      topics = ['Timeline Events'];
      difficulty = 'medium';
    }

    // Generate steps based on subject and difficulty
    const steps: HomeworkStep[] = [
      {
        id: '1',
        title: 'Understanding the Problem',
        content: `Let's break down what this ${subject.toLowerCase()} problem is asking us to do. Take your time to read through it carefully.`,
        type: 'explanation',
        isCompleted: false,
      },
      {
        id: '2',
        title: 'Key Concepts',
        content: `The important ${topics[0].toLowerCase()} concepts you need to remember are...`,
        type: 'explanation',
        isCompleted: false,
      },
      {
        id: '3',
        title: 'Step-by-Step Solution',
        content: 'Now let\'s solve this together, one step at a time.',
        type: 'example',
        isCompleted: false,
      },
      {
        id: '4',
        title: 'Practice Time',
        content: 'Try solving a similar problem on your own!',
        type: 'practice',
        isCompleted: false,
      },
    ];

    const mockAnalysis: HomeworkAnalysis = {
      subject,
      difficulty,
      topics,
      estimatedTime: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
      steps,
      encouragement: `Great job bringing this ${subject.toLowerCase()} problem to me, ${childName}! I can see this involves ${topics[0].toLowerCase()}. Let's work through it together step by step. You've got this! 🌟`,
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  }, [childName, childAge]);

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use rear camera if available
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please try uploading a file instead.');
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        setShowCamera(false);
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Mock OCR analysis
        analyzeHomework('Math problem captured from image: 15 + 27 = ?');
      }
    }
  }, [analyzeHomework]);

  const stopCamera = useCallback(() => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    setShowCamera(false);
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCapturedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      
      // Mock analysis
      analyzeHomework(`Uploaded file: ${file.name} - Math worksheet with addition problems`);
    }
  }, [analyzeHomework]);

  // Voice input (mock implementation)
  const toggleVoiceInput = useCallback(() => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Mock voice recognition
      setTimeout(() => {
        setHomeworkText('What is 15 plus 27?');
        setIsListening(false);
      }, 3000);
    }
  }, [isListening]);

  // Handle text submission
  const handleTextSubmit = useCallback(() => {
    if (homeworkText.trim()) {
      analyzeHomework(homeworkText);
    }
  }, [homeworkText, analyzeHomework]);

  // Mark step as completed
  const completeStep = useCallback((stepId: string) => {
    if (analysis) {
      const updatedSteps = analysis.steps.map(step => 
        step.id === stepId ? { ...step, isCompleted: true } : step
      );
      setAnalysis({ ...analysis, steps: updatedSteps });
      
      // Move to next step
      if (currentStep < analysis.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  }, [analysis, currentStep]);

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'math': return Calculator;
      case 'science': return Beaker;
      case 'reading': return BookOpen;
      case 'history': return Globe;
      default: return BookOpen;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'math': return 'from-blue-400 to-purple-400';
      case 'science': return 'from-green-400 to-teal-400';
      case 'reading': return 'from-orange-400 to-red-400';
      case 'history': return 'from-yellow-400 to-orange-400';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 bg-black/50">
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-white/20 text-white rounded-lg"
          >
            Cancel
          </button>
          <h3 className="text-white font-semibold">Take a photo of your homework</h3>
          <div className="w-16" /> {/* Spacer */}
        </div>
        
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <motion.button
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Camera className="w-8 h-8 text-gray-800" />
            </motion.button>
          </div>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  if (analysis) {
    const SubjectIcon = getSubjectIcon(analysis.subject);
    const currentStepData = analysis.steps[currentStep];
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${getSubjectColor(analysis.subject)} p-6 text-white`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <SubjectIcon className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">{analysis.subject} Helper</h2>
                  <p className="text-white/90">Step {currentStep + 1} of {analysis.steps.length}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="text-sm opacity-90 mb-2">{analysis.encouragement}</div>
            
            <div className="flex items-center gap-4 text-sm">
              <span>Difficulty: {analysis.difficulty}</span>
              <span>•</span>
              <span>Est. time: {analysis.estimatedTime}min</span>
              <span>•</span>
              <span>Topics: {analysis.topics.join(', ')}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-2 bg-gray-50">
            <div className="flex gap-1">
              {analysis.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    step.isCompleted 
                      ? 'bg-green-400' 
                      : index === currentStep 
                      ? 'bg-blue-400' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    currentStepData.type === 'explanation' ? 'bg-blue-100' :
                    currentStepData.type === 'example' ? 'bg-green-100' :
                    currentStepData.type === 'hint' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    {currentStepData.type === 'explanation' && <Lightbulb className="w-5 h-5 text-blue-600" />}
                    {currentStepData.type === 'example' && <BookOpen className="w-5 h-5 text-green-600" />}
                    {currentStepData.type === 'hint' && <HelpCircle className="w-5 h-5 text-yellow-600" />}
                    {currentStepData.type === 'practice' && <Star className="w-5 h-5 text-purple-600" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{currentStepData.title}</h3>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {currentStepData.content}
                  </p>
                  
                  {/* Mock interactive content based on step type */}
                  {currentStepData.type === 'example' && (
                    <div className="mt-4 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center text-gray-600 mb-4">Interactive Example</div>
                      <div className="text-2xl font-mono text-center mb-4">15 + 27 = ?</div>
                      <div className="text-center">
                        <div className="inline-flex gap-2 text-lg">
                          <span>15</span>
                          <span>+</span>
                          <span>27</span>
                          <span>=</span>
                          <span className="font-bold text-green-600">42</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentStepData.type === 'practice' && (
                    <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200">
                      <div className="text-center text-blue-600 mb-4 font-semibold">Practice Problem</div>
                      <div className="text-2xl font-mono text-center mb-4">23 + 34 = ?</div>
                      <div className="flex justify-center">
                        <input
                          type="number"
                          placeholder="Your answer"
                          className="px-4 py-2 border border-gray-300 rounded-lg text-center text-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {!currentStepData.isCompleted && (
                      <motion.button
                        onClick={() => completeStep(currentStepData.id)}
                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        I understand!
                      </motion.button>
                    )}

                    {currentStep < analysis.steps.length - 1 ? (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!currentStepData.isCompleted}
                        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      currentStepData.isCompleted && (
                        <motion.button
                          onClick={onClose}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Star className="w-4 h-4" />
                          Complete!
                        </motion.button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AIVO Homework Helper</h2>
                <p className="text-blue-100">Hi {childName}! I'm here to help you with your homework 📚</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-8">
          {isAnalyzing ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Brain className="w-12 h-12 text-blue-500" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing your homework...</h3>
              <p className="text-gray-600">I'm reading through your problem to understand how to help you best!</p>
            </div>
          ) : !inputMethod ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">How would you like to share your homework?</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <motion.button
                  onClick={() => setInputMethod('text')}
                  className="p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Type className="w-8 h-8 text-blue-500 mb-3" />
                  <h4 className="font-semibold text-gray-800 mb-2">Type it out</h4>
                  <p className="text-sm text-gray-600">Write or paste your homework question</p>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setInputMethod('camera');
                    startCamera();
                  }}
                  className="p-6 border-2 border-gray-200 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-8 h-8 text-green-500 mb-3" />
                  <h4 className="font-semibold text-gray-800 mb-2">Take a photo</h4>
                  <p className="text-sm text-gray-600">Snap a picture of your homework</p>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setInputMethod('upload');
                    fileInputRef.current?.click();
                  }}
                  className="p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-8 h-8 text-purple-500 mb-3" />
                  <h4 className="font-semibold text-gray-800 mb-2">Upload a file</h4>
                  <p className="text-sm text-gray-600">Upload a photo or document</p>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setInputMethod('text');
                    toggleVoiceInput();
                  }}
                  className="p-6 border-2 border-gray-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mic className="w-8 h-8 text-orange-500 mb-3" />
                  <h4 className="font-semibold text-gray-800 mb-2">Speak it out</h4>
                  <p className="text-sm text-gray-600">Tell me your homework question</p>
                </motion.button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : inputMethod === 'text' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Type your homework question</h3>
                <button
                  onClick={() => setInputMethod(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={homeworkText}
                    onChange={(e) => setHomeworkText(e.target.value)}
                    placeholder="Type your homework question here... For example: 'What is 15 + 27?' or 'Explain photosynthesis'"
                    className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <motion.button
                      onClick={toggleVoiceInput}
                      className={`p-2 rounded-lg transition-colors ${
                        isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>

                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 text-sm"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🎤
                    </motion.div>
                    Listening... Speak your homework question clearly
                  </motion.div>
                )}

                <div className="flex justify-end">
                  <motion.button
                    onClick={handleTextSubmit}
                    disabled={!homeworkText.trim()}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                    Get Help
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Show captured image or uploaded file */}
          {(capturedImage || uploadedFile) && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">Your homework:</h4>
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setUploadedFile(null);
                    setInputMethod(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              {capturedImage && (
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured homework"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              {uploadedFile && !capturedImage && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="font-semibold text-gray-800">{uploadedFile.name}</div>
                    <div className="text-sm text-gray-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};