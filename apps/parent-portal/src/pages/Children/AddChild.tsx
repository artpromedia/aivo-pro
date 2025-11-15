import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Brain, 
  FileText, 
  Upload, 
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Sparkles,
  Heart,
  Target,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@aivo/ui';
import { useAddChild } from '../../hooks/useChildren';

interface ChildFormData {
  // Basic Information for Model Setup
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  zipCode: string;
  grade: string;
}

export const AddChild: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { mutateAsync: addChild, isPending } = useAddChild();
  const [formData, setFormData] = useState<ChildFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    zipCode: '',
    grade: '',
  });

  const steps = [
    { number: 1, title: 'Child Details', icon: User, description: 'Name, age, and location info' },
    { number: 2, title: 'Confirmation', icon: Brain, description: 'Review and proceed to assessment' },
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('📝 Adding child profile:', formData);
      
      // Calculate age from date of birth
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
         (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
      
      // Create child profile using the hook
      const newChild = await addChild({
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.dateOfBirth,
        grade: parseInt(formData.grade === 'K' ? '0' : formData.grade),
        zipCode: formData.zipCode,
        disabilities: [],
        hasIEP: false,
        avatar: age < 10 ? (Math.random() > 0.5 ? '👧' : '👦') : (Math.random() > 0.5 ? '👩' : '👨'),
        progress: {
          overall: 0,
          subjects: {
            math: 0,
            reading: 0,
            science: 0,
            socialStudies: 0,
          },
        },
        weeklyStats: {
          hoursLearned: 0,
          skillsMastered: 0,
          avgScore: 0,
        },
      });
      
      console.log('✅ Child profile created:', newChild);
      
      // Generate a simple session token for the assessment
      const token = window.btoa(`${newChild.id}_${Date.now()}`);
      
      // Store child data in localStorage for baseline assessment
      const childData = {
        id: newChild.id,
        ...formData,
        createdAt: new Date().toISOString(),
        assessmentStatus: 'pending',
        modelStatus: 'pending'
      };
      localStorage.setItem(`aivo_child_${newChild.id}`, JSON.stringify(childData));
      
      // Redirect to baseline assessment for this child with proper query parameters
      const assessmentUrl = `http://localhost:5179?childId=${newChild.id}&token=${token}&source=parent&childName=${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}&grade=${formData.grade}`;
      console.log('🧠 Redirecting to baseline assessment:', assessmentUrl);
      window.open(assessmentUrl, '_blank');
      
      // Navigate back to children list to show the new child
      navigate('/children');
    } catch (error) {
      console.error('❌ Error creating child profile:', error);
      // Show error to user (you might want to add a toast notification here)
      alert('Failed to create child profile. Please try again.');
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth && formData.zipCode && formData.grade;
      case 2:
        return true; // Confirmation step - always valid if we got here
      default:
        return false;
    }
  };

  return (
    <div className="py-8">

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-coral-600" />
            <span className="text-sm font-medium text-gray-700">AIVO Learning Profile Setup</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            Add Your Child's Profile
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Create a personalized learning experience tailored to your child's unique needs
          </motion.p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all ${
                    step >= s.number 
                      ? 'bg-aivo-gradient text-white shadow-lg scale-110' 
                      : 'bg-white/70 text-gray-400 shadow-sm'
                  }`}>
                    {step > s.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <s.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      step >= s.number ? 'text-coral-600' : 'text-gray-500'
                    }`}>
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-400 max-w-20">{s.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                    step > s.number ? 'bg-aivo-gradient' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[step - 1].title}
            </h2>
            <p className="text-gray-600">{steps[step - 1].description}</p>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    pattern="[0-9]{5}"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                    placeholder="12345"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Helps select appropriate curriculum standards</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Grade *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  >
                    <option value="">Select Grade</option>
                    <option value="K">Kindergarten</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                      <option key={grade} value={grade.toString()}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-purple-800 mb-1">Next: Baseline Assessment</p>
                    <p className="text-sm text-purple-700">
                      After adding your child's details, we'll redirect you to a comprehensive baseline assessment. 
                      The results will be used to create a personalized AI learning model tailored to your child's needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-aivo-gradient rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Ready!</h3>
                <p className="text-gray-600 mb-8">
                  We've collected the essential information to get started. Next, we'll assess your child's current learning level.
                </p>
              </div>

              {/* Child Summary */}
              <div className="bg-gradient-to-r from-coral-50 to-purple-50 rounded-2xl p-6 border border-coral-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-coral-600" />
                  Child Profile Summary
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(formData.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium text-gray-900">
                      {formData.grade === 'K' ? 'Kindergarten' : `Grade ${formData.grade}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">
                      ZIP {formData.zipCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Next: Baseline Assessment
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">Comprehensive Skills Assessment</p>
                      <p className="text-sm text-purple-700">Evaluate current abilities across multiple learning domains</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">AI Model Personalization</p>
                      <p className="text-sm text-purple-700">Create a custom learning model based on assessment results</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">Personalized Learning Path</p>
                      <p className="text-sm text-purple-700">Begin adaptive learning tailored to your child's unique needs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-coral-50 border border-coral-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-coral-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-coral-800 mb-1">Assessment Duration</p>
                    <p className="text-sm text-coral-700">
                      The baseline assessment typically takes 15-30 minutes and adapts to your child's responses. 
                      You can pause and resume at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={() => step === 1 ? navigate('/dashboard') : setStep(Math.max(1, step - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {step === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Step {step} of {steps.length}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {step === steps.length ? (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Start Assessment
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};