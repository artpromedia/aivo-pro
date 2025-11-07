import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Pen, 
  Check, 
  Clock, 
  AlertCircle, 
  Download, 
  Send,
  Eye,
  Calendar,
  User,
  Shield,
  CheckCircle
} from 'lucide-react';

interface ConsentForm {
  id: string;
  title: string;
  description: string;
  type: 'evaluation' | 'service' | 'placement' | 'assessment' | 'therapy';
  status: 'pending' | 'signed' | 'declined' | 'expired';
  dueDate: string;
  createdDate: string;
  signedDate?: string;
  signerName?: string;
  urgency: 'low' | 'medium' | 'high';
  content: string;
  requiredSignatures: {
    role: string;
    name: string;
    signed: boolean;
    signedDate?: string;
    signature?: string;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

interface DigitalConsentFormsProps {
  childId: string;
}

const DigitalConsentForms: React.FC<DigitalConsentFormsProps> = ({ childId }) => {
  const [forms, setForms] = useState<ConsentForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsentForms();
  }, [childId]);

  const loadConsentForms = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockForms: ConsentForm[] = [
        {
          id: '1',
          title: 'Psychological Evaluation Consent',
          description: 'Consent for comprehensive psychological evaluation to assess cognitive abilities and learning needs',
          type: 'evaluation',
          status: 'pending',
          dueDate: '2025-11-20',
          createdDate: '2025-11-01',
          urgency: 'high',
          content: `This form grants permission for a comprehensive psychological evaluation of your child. The evaluation will include cognitive testing, behavioral assessments, and academic skill evaluations to better understand your child's learning needs and develop appropriate educational strategies.

The evaluation process will take approximately 2-3 hours and may be conducted over multiple sessions. All information gathered will be kept confidential and used solely for educational planning purposes.

By signing this form, you give consent for:
- Cognitive ability testing
- Academic achievement testing  
- Behavioral observations
- Review of educational records
- Consultation with teachers and other school personnel

You have the right to:
- Receive a copy of all evaluation results
- Request an explanation of the findings
- Disagree with the evaluation results
- Request an independent evaluation at public expense if you disagree

The evaluation will be conducted by a licensed school psychologist and results will be available within 30 days of completion.`,
          requiredSignatures: [
            {
              role: 'Parent/Guardian',
              name: 'Sarah Johnson',
              signed: false
            }
          ]
        },
        {
          id: '2',
          title: 'Speech Therapy Services Agreement',
          description: 'Consent for speech and language therapy services as part of the IEP',
          type: 'service',
          status: 'signed',
          dueDate: '2025-10-15',
          createdDate: '2025-10-01',
          signedDate: '2025-10-10',
          signerName: 'Sarah Johnson',
          urgency: 'medium',
          content: `This agreement outlines the speech and language therapy services that will be provided to your child as part of their Individualized Education Program (IEP).

Services include:
- Individual speech therapy sessions (2x per week, 30 minutes each)
- Group speech therapy sessions (1x per week, 45 minutes)
- Consultation with classroom teachers
- Regular progress monitoring and reporting

The speech-language pathologist will work on:
- Articulation and phonological skills
- Language comprehension and expression
- Social communication skills
- Vocabulary development

Progress will be monitored through regular assessments and you will receive quarterly progress reports.`,
          requiredSignatures: [
            {
              role: 'Parent/Guardian',
              name: 'Sarah Johnson',
              signed: true,
              signedDate: '2025-10-10',
              signature: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIj4KPC9zdmc+'
            }
          ]
        },
        {
          id: '3',
          title: 'Extended School Year Services',
          description: 'Consent for summer educational services to prevent regression',
          type: 'service',
          status: 'pending',
          dueDate: '2025-12-01',
          createdDate: '2025-11-01',
          urgency: 'low',
          content: `This form requests consent for Extended School Year (ESY) services for your child during the summer break. ESY services are designed to prevent significant regression in skills and ensure continued progress.

Proposed ESY services include:
- Reading comprehension support (3 days per week, 2 hours per day)
- Mathematics skill maintenance (2 days per week, 1 hour per day)
- Social skills group (1 day per week, 1 hour)

Services will be provided from June 15 to August 15, 2025 at the school campus. Transportation will be provided if needed.

The need for ESY services was determined based on:
- Risk of significant regression during extended breaks
- Child's ability to recoup skills after breaks
- Nature and severity of the disability
- Progress on IEP goals`,
          requiredSignatures: [
            {
              role: 'Parent/Guardian',
              name: 'Sarah Johnson',
              signed: false
            }
          ]
        }
      ];
      setForms(mockForms);
    } catch (error) {
      console.error('Error loading consent forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'evaluation': return '🔍';
      case 'service': return '🛠️';
      case 'placement': return '🏫';
      case 'assessment': return '📋';
      case 'therapy': return '💊';
      default: return '📄';
    }
  };

  const filteredForms = forms.filter(form => {
    if (filterStatus !== 'all' && form.status !== filterStatus) return false;
    return true;
  });

  const handleSignForm = (formId: string, signature: string) => {
    setForms(forms.map(form => {
      if (form.id === formId) {
        return {
          ...form,
          status: 'signed' as const,
          signedDate: new Date().toISOString().split('T')[0],
          signerName: 'Sarah Johnson', // Would come from auth context
          requiredSignatures: form.requiredSignatures.map(sig => ({
            ...sig,
            signed: true,
            signedDate: new Date().toISOString().split('T')[0],
            signature
          }))
        };
      }
      return form;
    }));
    setShowSignatureModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Digital Consent Forms</h2>
          <p className="text-gray-600">Review and sign consent forms electronically</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Forms</option>
            <option value="pending">Pending</option>
            <option value="signed">Signed</option>
            <option value="declined">Declined</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Forms List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredForms.map(form => (
          <div
            key={form.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedForm(form)}
          >
            {/* Form Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(form.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{form.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">{form.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(form.status)}`}>
                {form.status}
              </span>
            </div>

            {/* Form Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>

            {/* Form Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(form.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Urgency:</span>
                <span className={`font-medium capitalize ${getUrgencyColor(form.urgency)}`}>
                  {form.urgency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Signatures:</span>
                <span className="font-medium text-gray-900">
                  {form.requiredSignatures.filter(sig => sig.signed).length} / {form.requiredSignatures.length}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {form.status === 'pending' && (
                <button 
                  onClick={() => setSelectedForm(form)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-coral-500 to-salmon-500 text-white rounded-full hover:from-coral-600 hover:to-salmon-600 transition-all text-sm font-medium"
                >
                  Review & Sign
                </button>
              )}
              {form.status === 'signed' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedForm(form)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-2 inline" />
                    View
                  </button>
                  <button 
                    onClick={() => alert('PDF Download - Feature coming soon!')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-coral-300 text-coral-600 rounded-full hover:bg-coral-50 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
          <p className="text-gray-600">No consent forms match your current filter.</p>
        </div>
      )}

      {/* Form Detail Modal */}
      {selectedForm && (
        <FormDetailModal
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
          onSign={() => setShowSignatureModal(true)}
        />
      )}

      {/* Signature Modal */}
      {showSignatureModal && selectedForm && (
        <SignatureModal
          form={selectedForm}
          onClose={() => setShowSignatureModal(false)}
          onSign={(signature) => handleSignForm(selectedForm.id, signature)}
        />
      )}
    </div>
  );
};

// Form Detail Modal Component
interface FormDetailModalProps {
  form: ConsentForm;
  onClose: () => void;
  onSign: () => void;
}

const FormDetailModal: React.FC<FormDetailModalProps> = ({ form, onClose, onSign }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{form.title}</h2>
              <p className="text-gray-600 mt-1">{form.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Due: {new Date(form.dueDate).toLocaleDateString()}</span>
                <span className={`capitalize ${getUrgencyColor(form.urgency)}`}>
                  {form.urgency} priority
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="prose max-w-none">
            {form.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Signatures Section */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Required Signatures</h3>
          <div className="space-y-3">
            {form.requiredSignatures.map((signature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    signature.signed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {signature.signed && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{signature.role}</p>
                    <p className="text-sm text-gray-600">{signature.name}</p>
                  </div>
                </div>
                {signature.signed && signature.signedDate && (
                  <div className="text-right text-sm text-gray-500">
                    <p>Signed</p>
                    <p>{new Date(signature.signedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {form.status === 'pending' && (
            <button
              onClick={onSign}
              className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
            >
              <Pen className="w-4 h-4 mr-2 inline" />
              Sign Form
            </button>
          )}
          {form.status === 'signed' && (
            <button className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );

  function getUrgencyColor(urgency: string) {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }
};

// Signature Modal Component
interface SignatureModalProps {
  form: ConsentForm;
  onClose: () => void;
  onSign: (signature: string) => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ form, onClose, onSign }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedSignature, setTypedSignature] = useState('');
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSign = () => {
    let signature = '';
    
    if (signatureType === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        signature = canvas.toDataURL();
      }
    } else {
      signature = typedSignature;
    }

    if (signature) {
      onSign(signature);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Electronic Signature</h2>
          
          <div className="mb-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setSignatureType('draw')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  signatureType === 'draw'
                    ? 'bg-coral-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Draw Signature
              </button>
              <button
                onClick={() => setSignatureType('type')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  signatureType === 'type'
                    ? 'bg-coral-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Type Signature
              </button>
            </div>

            {signatureType === 'draw' ? (
              <div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  className="border border-gray-300 rounded-lg cursor-crosshair w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <button
                  onClick={clearSignature}
                  className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                />
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <span className="text-xl font-script text-gray-700">{typedSignature || 'Your signature will appear here'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Legal Notice</span>
            </div>
            <p className="text-sm text-blue-800">
              By signing this form electronically, you agree that your electronic signature 
              has the same legal effect as a handwritten signature.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSign}
              disabled={signatureType === 'type' ? !typedSignature : false}
              className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalConsentForms;