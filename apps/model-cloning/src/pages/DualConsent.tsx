import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Shield, Users, AlertCircle } from 'lucide-react';
import { useCloning } from '../providers/CloningProvider';

export default function DualConsent() {
  const navigate = useNavigate();
  const { sessionData } = useCloning();
  
  // Determine which consent is needed based on who enrolled
  const isParentEnrolled = sessionData.enrolledBy === 'parent';
  
  // Track consent from both parties
  const [parentConsent, setParentConsent] = useState({
    dataProcessing: false,
    modelCreation: false,
    continuousLearning: false,
    dataRetention: false,
  });
  
  const [teacherConsent, setTeacherConsent] = useState({
    educationalUse: false,
    progressMonitoring: false,
    dataSharing: false,
    modelAccuracy: false,
  });

  const allParentConsentsGiven = Object.values(parentConsent).every(Boolean);
  const allTeacherConsentsGiven = Object.values(teacherConsent).every(Boolean);
  
  // Only check the relevant consent based on who enrolled
  const canProceed = isParentEnrolled ? allParentConsentsGiven : allTeacherConsentsGiven;

  const handleProceed = () => {
    // Store consent records
    const consentRecord = isParentEnrolled ? {
      parentConsent: {
        ...parentConsent,
        timestamp: new Date().toISOString(),
        email: sessionData.parentEmail,
      },
    } : {
      teacherConsent: {
        ...teacherConsent,
        timestamp: new Date().toISOString(),
        email: sessionData.teacherEmail,
        name: sessionData.teacherName,
        school: sessionData.schoolName,
      },
    };

    // In production, this would call an API
    console.log('Consent recorded:', consentRecord);
    localStorage.setItem(`consent-${sessionData.childId}`, JSON.stringify(consentRecord));

    navigate('/clone/configure');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isParentEnrolled ? 'Parent Consent Required' : 'Teacher Consent Required'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Creating an AI learning model for {sessionData.childName} requires informed consent.
            Please review and accept all terms below to proceed.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Conditionally render Parent OR Teacher Consent */}
          {isParentEnrolled ? (
            // Parent Consent
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-coral-500 to-salmon-500 p-6">
                <div className="flex items-center gap-3 text-white">
                  <Users className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Parent/Guardian Consent</h2>
                </div>
                <p className="text-coral-50 mt-2">
                  For: {sessionData.childName} (Grade {sessionData.grade})
                </p>
              </div>

              <div className="p-6 space-y-4">
                <ConsentCheckbox
                  checked={parentConsent.dataProcessing}
                  onChange={(checked) => setParentConsent({ ...parentConsent, dataProcessing: checked })}
                  label="Data Processing Agreement"
                  description="I consent to AIVO processing my child's assessment data to create a personalized AI learning model."
                />
                
                <ConsentCheckbox
                  checked={parentConsent.modelCreation}
                  onChange={(checked) => setParentConsent({ ...parentConsent, modelCreation: checked })}
                  label="AI Model Creation"
                  description="I authorize the creation of a custom AI model based on my child's learning patterns, strengths, and areas for growth."
                />
                
                <ConsentCheckbox
                  checked={parentConsent.continuousLearning}
                  onChange={(checked) => setParentConsent({ ...parentConsent, continuousLearning: checked })}
                  label="Continuous Learning & Adaptation"
                  description="I understand the AI model will continuously learn from my child's interactions to improve personalization."
                />
                
                <ConsentCheckbox
                  checked={parentConsent.dataRetention}
                  onChange={(checked) => setParentConsent({ ...parentConsent, dataRetention: checked })}
                  label="Data Retention Policy"
                  description="I acknowledge AIVO's data retention policy and my right to request data deletion at any time."
                />

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900">
                      Your consent is required under COPPA and FERPA regulations. You may withdraw
                      consent at any time through your parent portal settings.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Teacher Consent
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
                <div className="flex items-center gap-3 text-white">
                  <Shield className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Teacher/School Consent</h2>
                </div>
                <p className="text-purple-50 mt-2">
                  For: {sessionData.childName} (Grade {sessionData.grade})
                </p>
              </div>

              <div className="p-6 space-y-4">
                <ConsentCheckbox
                  checked={teacherConsent.educationalUse}
                  onChange={(checked) => setTeacherConsent({ ...teacherConsent, educationalUse: checked })}
                  label="Educational Use Authorization"
                  description="I confirm this AI model will be used exclusively for educational purposes aligned with curriculum standards."
                />
                
                <ConsentCheckbox
                  checked={teacherConsent.progressMonitoring}
                  onChange={(checked) => setTeacherConsent({ ...teacherConsent, progressMonitoring: checked })}
                  label="Progress Monitoring Access"
                  description="I understand I will have access to monitor the student's learning progress and model performance through the teacher portal."
                />
                
                <ConsentCheckbox
                  checked={teacherConsent.dataSharing}
                  onChange={(checked) => setTeacherConsent({ ...teacherConsent, dataSharing: checked })}
                  label="School Data Sharing Agreement"
                  description="I authorize sharing of anonymized learning outcomes with school administrators for program effectiveness evaluation."
                />
                
                <ConsentCheckbox
                  checked={teacherConsent.modelAccuracy}
                  onChange={(checked) => setTeacherConsent({ ...teacherConsent, modelAccuracy: checked })}
                  label="Model Accuracy & Oversight"
                  description="I acknowledge responsibility for monitoring AI recommendations and maintaining pedagogical oversight of all learning activities."
                />

                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-purple-900">
                      This consent is issued under your school's district license. All data handling
                      complies with FERPA and district data protection policies.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={handleProceed}
            disabled={!canProceed}
            className={`px-8 py-4 rounded-xl font-semibold transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canProceed ? 'Proceed to Model Configuration' : 'All Consents Required'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// Helper component for consent checkboxes
interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}

function ConsentCheckbox({ checked, onChange, label, description }: ConsentCheckboxProps) {
  return (
    <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-colors">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="mt-1 flex-shrink-0"
      >
        {checked ? (
          <CheckCircle2 className="w-6 h-6 text-purple-500" />
        ) : (
          <Circle className="w-6 h-6 text-gray-300" />
        )}
      </button>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 mb-1">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </label>
  );
}
