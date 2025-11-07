import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface ConsentVerificationProps {
  sessionData: any;
  onVerified: () => void;
}

interface Agreements {
  dataCollection: boolean;
  adaptiveLearning: boolean;
  progressSharing: boolean;
  ferpaCompliance: boolean;
  parentalConsent: boolean;
}

export const ConsentVerification: React.FC<ConsentVerificationProps> = ({ 
  sessionData, 
  onVerified 
}) => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState<Agreements>({
    dataCollection: false,
    adaptiveLearning: false,
    progressSharing: false,
    ferpaCompliance: false,
    parentalConsent: false,
  });
  const [showFullTerms, setShowFullTerms] = useState(false);
  
  const isParent = sessionData.enrolledBy === 'parent';
  const allAgreed = Object.values(agreements).every(v => v);

  const handleProceed = async () => {
    if (!allAgreed) return;
    
    try {
      // Record consent - in production this would be an API call
      console.log('Recording consent:', {
        childId: sessionData.childId,
        consentType: 'assessment',
        agreements,
        consentedBy: sessionData.enrolledBy,
        timestamp: new Date().toISOString(),
      });
      
      onVerified();
      navigate('/welcome');
    } catch (error) {
      console.error('Failed to record consent:', error);
    }
  };

  const Checkbox: React.FC<{ 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    label: React.ReactNode;
  }> = ({ checked, onChange, label }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked 
            ? 'bg-blue-500 border-blue-500' 
            : 'bg-white border-gray-300 group-hover:border-blue-400'
        }`}>
          {checked && <CheckCircle className="w-4 h-4 text-white" />}
        </div>
      </div>
      <div className="flex-1 text-sm">{label}</div>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Consent & Privacy Agreement
          </h1>
          <p className="text-gray-600">
            Please review and agree to the following before proceeding with the assessment
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
            {/* Student Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="font-semibold text-gray-900">{sessionData.childName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade</p>
                  <p className="font-semibold text-gray-900">{sessionData.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enrolled By</p>
                  <p className="font-semibold text-gray-900 capitalize">{sessionData.enrolledBy}</p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Important Notice</h3>
                  <p className="text-sm text-gray-700">
                    This assessment will collect data about your {isParent ? "child's" : "student's"} 
                    learning patterns, strengths, and areas for improvement. This data will be used to 
                    create a personalized AI learning model. Your consent is required to proceed.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent Items */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Please review and agree to each item:</h3>
              
              <Checkbox
                checked={agreements.dataCollection}
                onChange={(checked) => 
                  setAgreements(prev => ({ ...prev, dataCollection: checked }))
                }
                label={
                  <span className="text-gray-700">
                    I consent to AIVO collecting assessment data including response patterns, 
                    time spent, and skill measurements for {sessionData.childName}
                  </span>
                }
              />

              <Checkbox
                checked={agreements.adaptiveLearning}
                onChange={(checked) => 
                  setAgreements(prev => ({ ...prev, adaptiveLearning: checked }))
                }
                label={
                  <span className="text-gray-700">
                    I understand this data will be used to create an adaptive learning profile 
                    using artificial intelligence technology
                  </span>
                }
              />

              <Checkbox
                checked={agreements.progressSharing}
                onChange={(checked) => 
                  setAgreements(prev => ({ ...prev, progressSharing: checked }))
                }
                label={
                  <span className="text-gray-700">
                    I agree that progress data may be shared with {isParent ? "teachers" : "parents"} 
                    and authorized school personnel
                  </span>
                }
              />

              <Checkbox
                checked={agreements.ferpaCompliance}
                onChange={(checked) => 
                  setAgreements(prev => ({ ...prev, ferpaCompliance: checked }))
                }
                label={
                  <span className="text-gray-700">
                    I acknowledge that all data handling complies with FERPA, COPPA, and applicable 
                    state privacy laws
                  </span>
                }
              />

              <Checkbox
                checked={agreements.parentalConsent}
                onChange={(checked) => 
                  setAgreements(prev => ({ ...prev, parentalConsent: checked }))
                }
                label={
                  <span className="text-gray-700 font-medium">
                    {isParent 
                      ? "As the parent/guardian, I give my full consent for this assessment"
                      : "I confirm that parental consent has been obtained for this assessment"
                    }
                  </span>
                }
              />
            </div>

            {/* Additional Terms */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <button
                onClick={() => setShowFullTerms(!showFullTerms)}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                {showFullTerms ? 'Hide' : 'View'} Full Terms and Privacy Policy
              </button>
              
              {showFullTerms && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 max-h-64 overflow-y-auto"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">Full Terms of Service</h4>
                  <div className="space-y-2">
                    <p className="mb-3">
                      By agreeing to these terms, you acknowledge and consent to the following data collection and usage practices:
                    </p>
                    <h5 className="font-semibold text-gray-700">1. Data Collection</h5>
                    <p>AIVO collects assessment responses, time spent on tasks, learning patterns, and performance metrics.</p>
                    
                    <h5 className="font-semibold text-gray-700 mt-3">2. Data Usage</h5>
                    <p>Collected data is used exclusively for creating personalized learning experiences and improving educational outcomes.</p>
                    
                    <h5 className="font-semibold text-gray-700 mt-3">3. Privacy & Security</h5>
                    <p>All data is encrypted, stored securely, and never sold to third parties. We comply with FERPA, COPPA, and applicable state laws.</p>
                    
                    <h5 className="font-semibold text-gray-700 mt-3">4. Your Rights</h5>
                    <p>You may request data access, correction, or deletion at any time by contacting privacy@aivo.com.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => window.location.href = isParent ? '/parent-portal' : '/teacher-portal'}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel Assessment
              </button>
              
              <div className="flex items-center gap-3">
                {allAgreed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">All items agreed</span>
                  </motion.div>
                )}
                
                <button
                  onClick={handleProceed}
                  disabled={!allAgreed}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    allAgreed
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Proceed to Assessment
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Icons */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>FERPA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>COPPA Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
