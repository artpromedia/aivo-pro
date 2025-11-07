import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  PenTool,
  Check,
  X,
  Download,
  Clock,
  AlertTriangle,
  Shield,
  User,
  Calendar
} from 'lucide-react';
import { Button } from '@aivo/ui';
import { ConsentForm, ConsentSignature } from '../types/iep.types';

interface DigitalConsentProps {
  consentForm: ConsentForm;
  onSignatureComplete: (signature: ConsentSignature) => void;
  onDecline: (reason?: string) => void;
  onClose: () => void;
}

export const DigitalConsent: React.FC<DigitalConsentProps> = ({
  consentForm,
  onSignatureComplete,
  onDecline,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState<'review' | 'sign' | 'complete'>('review');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [parentName, setParentName] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setLastPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosition) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const currentPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(currentPosition.x, currentPosition.y);
      ctx.stroke();

      setLastPosition(currentPosition);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);
    
    // Save signature data
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData('');
    }
  };

  const handleSignatureSubmit = () => {
    if (!signatureData || !parentName.trim()) {
      alert('Please provide your name and signature');
      return;
    }

    const signature: ConsentSignature = {
      signerName: parentName,
      signerRole: 'parent',
      signatureData: signatureData,
      signedDate: new Date().toISOString(),
      ipAddress: 'parent-portal', // In real app, get actual IP
      consentGiven: true
    };

    onSignatureComplete(signature);
    setCurrentStep('complete');
  };

  const handleDecline = () => {
    const signature: ConsentSignature = {
      signerName: parentName,
      signerRole: 'parent',
      signatureData: '',
      signedDate: new Date().toISOString(),
      ipAddress: 'parent-portal',
      consentGiven: false,
      comments: declineReason
    };

    onSignatureComplete(signature);
    onDecline(declineReason);
    setShowDeclineModal(false);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Initialize canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      canvas.width = 400;
      canvas.height = 200;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-coral-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Digital Consent Form</h2>
              <p className="text-white/90 mt-1">{consentForm.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
                {consentForm.type.replace('-', ' ').toUpperCase()}
              </div>
              <button 
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 'review', label: 'Review Form', icon: FileText },
              { step: 'sign', label: 'Digital Signature', icon: PenTool },
              { step: 'complete', label: 'Complete', icon: Check }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  currentStep === step ? 'text-coral-600' : 
                  ['review', 'sign', 'complete'].indexOf(currentStep) > index ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step ? 'bg-coral-100' :
                    ['review', 'sign', 'complete'].indexOf(currentStep) > index ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
                {index < 2 && (
                  <div className={`w-8 h-px ml-4 ${
                    ['review', 'sign', 'complete'].indexOf(currentStep) > index ? 'bg-green-300' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 'review' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Form Information */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Requested by:</span>
                    <p className="text-gray-900">{consentForm.requiredBy}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Due Date:</span>
                    <p className="text-gray-900">{formatDate(consentForm.dueDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Form Type:</span>
                    <p className="text-gray-900 capitalize">{consentForm.type.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <p className="text-gray-900">{formatDate(consentForm.createdDate)}</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{consentForm.title}</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{consentForm.description}</p>
                  
                  {/* Mock form content - replace with actual HTML content */}
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">Purpose of Evaluation:</h4>
                    <p className="text-gray-700">
                      This reevaluation is being requested to determine your child's continued eligibility 
                      for special education services and to review their current educational needs.
                    </p>

                    <h4 className="font-semibold text-gray-900">Evaluation Procedures:</h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>Cognitive assessment</li>
                      <li>Academic achievement testing</li>
                      <li>Behavioral observations</li>
                      <li>Review of educational records</li>
                    </ul>

                    <h4 className="font-semibold text-gray-900">Your Rights:</h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>You have the right to refuse consent for this evaluation</li>
                      <li>You may request an independent educational evaluation</li>
                      <li>You have access to all evaluation results</li>
                      <li>You may revoke consent at any time</li>
                    </ul>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-amber-800">Important Notice</h5>
                          <p className="text-amber-700 text-sm mt-1">
                            By signing this form, you are giving consent for the evaluation procedures described above. 
                            If you do not provide consent, the school cannot proceed with the evaluation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'sign' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Shield className="w-12 h-12 text-coral-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Signature Required</h3>
                <p className="text-gray-600">
                  Please provide your legal name and digital signature to complete this consent form.
                </p>
              </div>

              {/* Parent Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Legal Name *
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  placeholder="Enter your full legal name"
                />
              </div>

              {/* Digital Signature Pad */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature *
                </label>
                <div className="border border-gray-300 rounded-lg bg-white">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair w-full"
                    style={{ maxWidth: '100%', height: '200px' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Sign above using your mouse or touchpad
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-800">Legal Agreement</h5>
                    <p className="text-blue-700 text-sm mt-1">
                      By signing this document electronically, you agree that your digital signature 
                      has the same legal force and effect as a handwritten signature.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Consent Form Completed</h3>
              <p className="text-gray-600 mb-6">
                Your digital signature has been successfully recorded and the consent form has been submitted.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-700">
                  <strong>Signed by:</strong> {parentName}<br />
                  <strong>Date:</strong> {formatDate(new Date().toISOString())}<br />
                  <strong>Form:</strong> {consentForm.title}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          {currentStep === 'review' && (
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeclineModal(true)}
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  Decline Consent
                </Button>
              </div>
              <Button
                variant="gradient"
                onClick={() => setCurrentStep('sign')}
                className="flex items-center gap-2"
              >
                Proceed to Sign
                <PenTool className="w-4 h-4" />
              </Button>
            </>
          )}

          {currentStep === 'sign' && (
            <>
              <Button
                variant="outline"
                onClick={() => setCurrentStep('review')}
              >
                Back to Review
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeclineModal(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Decline
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleSignatureSubmit}
                  disabled={!signatureData || !parentName.trim()}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Submit Consent
                </Button>
              </div>
            </>
          )}

          {currentStep === 'complete' && (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Copy
              </Button>
              <Button
                variant="gradient"
                onClick={onClose}
              >
                Close
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Decline Modal */}
      <AnimatePresence>
        {showDeclineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Decline Consent</h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for declining this consent form (optional):
              </p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                rows={3}
                placeholder="Reason for declining..."
              />
              <div className="flex items-center gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDeclineModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDecline}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm Decline
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};