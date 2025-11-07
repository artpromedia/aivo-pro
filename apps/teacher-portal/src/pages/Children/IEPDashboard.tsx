import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Share2,
  Download,
  Eye,
  Plus,
  School,
  Users,
  Target,
  BookOpen,
  Activity,
  TrendingUp,
  Shield,
  Play
} from 'lucide-react';
import { Button } from '@aivo/ui';
import { IEPDocument, ConsentForm, EvaluationRequest, BaselineAssessment } from '../../types/iep.types';
import IEPProgressTracking from '../../components/IEPProgressTracking';
import DigitalConsentForms from '../../components/DigitalConsentForms';
import IEPDocumentViewer from '../../components/IEPDocumentViewer';
import EvaluationRequestSystem from '../../components/EvaluationRequestSystem';
import EnhancedIEPSharingSystem from '../../components/EnhancedIEPSharingSystem';
import IEPMeetingScheduler from '../../components/IEPMeetingScheduler';
import { jsPDF } from 'jspdf';

interface IEPDashboardProps {
  childId: string;
}

interface IEPOverview {
  activeIEP?: IEPDocument;
  pendingConsents: ConsentForm[];
  evaluationRequests: EvaluationRequest[];
  baselineAssessment?: BaselineAssessment;
  recentActivity: {
    type: 'iep-update' | 'consent-signed' | 'evaluation-completed' | 'goal-progress';
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'in-progress';
  }[];
}

// Mock data - replace with actual API calls
const mockIEPData: IEPOverview = {
  activeIEP: {
    id: 'iep-001',
    childId: 'child-001',
    studentInfo: {
      name: 'Emma Chen',
      dateOfBirth: '2015-04-15',
      grade: '3rd Grade',
      school: 'Lincoln Elementary',
      disability: ['Specific Learning Disability'],
      eligibilityCategory: 'Learning Disability'
    },
    meetingInfo: {
      meetingDate: '2024-09-15',
      meetingType: 'annual',
      participants: [
        { name: 'Sarah Chen', role: 'Parent', attended: true },
        { name: 'Ms. Rodriguez', role: 'Special Education Teacher', attended: true },
        { name: 'Mr. Johnson', role: 'General Education Teacher', attended: true }
      ]
    },
    currentPerformance: [],
    goals: [
      {
        id: 'goal-1',
        domain: 'academic',
        category: 'Reading Comprehension',
        description: 'Improve reading comprehension skills',
        measurableObjective: 'Emma will answer comprehension questions about grade-level text',
        targetCriteria: '80% accuracy over 3 consecutive sessions',
        evaluationMethod: 'Weekly reading assessments',
        frequency: 'Daily',
        startDate: '2024-09-15',
        targetDate: '2025-09-15',
        currentProgress: 65,
        status: 'in-progress',
        notes: ['Good progress in literal comprehension', 'Needs support with inferential questions'],
        dataPoints: []
      }
    ],
    accommodations: [],
    services: [],
    placementInfo: {
      leastRestrictiveEnvironment: 'General education classroom with support',
      generalEducationTime: 85,
      specialEducationTime: 15,
      justification: 'Student benefits from general education curriculum with specialized reading support'
    },
    status: 'active',
    effectiveDate: '2024-09-15',
    reviewDate: '2025-09-15',
    createdBy: 'Ms. Rodriguez',
    createdDate: '2024-09-15',
    lastModified: '2024-10-01',
    signatures: [],
    source: 'teacher-created'
  },
  pendingConsents: [
    {
      id: 'consent-001',
      childId: 'child-001',
      type: 'evaluation',
      title: 'Consent for Reevaluation',
      description: 'Annual reevaluation to determine continued eligibility for special education services',
      content: '<p>We are requesting consent to conduct a reevaluation...</p>',
      requiredBy: 'Ms. Rodriguez - Special Education Teacher',
      dueDate: '2024-11-15',
      status: 'pending',
      createdDate: '2024-11-01',
      relatedDocuments: []
    }
  ],
  evaluationRequests: [],
  baselineAssessment: {
    id: 'baseline-001',
    childId: 'child-001',
    assessmentDate: '2024-08-15',
    academicLevels: {
      reading: 2.5,
      math: 3.1,
      writing: 2.8,
      science: 3.0
    },
    cognitiveProfile: {
      strengths: ['Visual learning', 'Mathematical reasoning'],
      challenges: ['Reading fluency', 'Working memory'],
      learningStyle: 'Visual-kinesthetic',
      processingSpeed: 'Below average',
      attention: 'Difficulty with sustained attention'
    },
    behavioralObservations: {
      socialSkills: 'Age-appropriate peer interactions',
      selfRegulation: 'Needs support with emotional regulation',
      adaptiveBehavior: 'Independent in most daily living skills',
      communicationSkills: 'Strong verbal communication'
    },
    recommendations: ['Small group instruction', 'Visual supports', 'Frequent breaks'],
    iepGenerated: true,
    generatedIepId: 'iep-001'
  },
  recentActivity: [
    {
      type: 'goal-progress',
      description: 'Reading comprehension goal updated - 65% progress',
      date: '2024-11-01',
      status: 'in-progress'
    },
    {
      type: 'consent-signed',
      description: 'IEP services consent signed',
      date: '2024-10-15',
      status: 'completed'
    }
  ]
};

function createAutoGeneratedIepFromBaseline(baseline: BaselineAssessment, studentName: string): IEPDocument {
  const generatedId = `iep-${Date.now()}`;
  const today = new Date();
  const nextReview = new Date(today);
  nextReview.setFullYear(today.getFullYear() + 1);

  const baseGoals = (baseline.domains ?? [
    { name: 'Reading Comprehension', score: baseline.academicLevels.reading },
    { name: 'Mathematics', score: baseline.academicLevels.math },
    { name: 'Writing', score: baseline.academicLevels.writing },
  ]).map((domain, index) => {
    const baselineScore = Math.round((domain.score ?? 3) * 10);
    const targetScore = Math.min(100, baselineScore + 20);

    return {
      id: `${generatedId}-goal-${index + 1}`,
      domain: 'academic' as const,
      category: domain.name,
      description: `${studentName} will improve performance in ${domain.name.toLowerCase()} through scaffolded instruction and practice activities.`,
      measurableObjective: `Increase mastery to ${targetScore}% on grade-level tasks using adaptive supports.`,
      targetCriteria: `${targetScore}% accuracy across 3 consecutive sessions`,
      evaluationMethod: 'Curriculum-based measures and teacher observation logs',
      frequency: 'Weekly',
      startDate: today.toISOString(),
      targetDate: nextReview.toISOString(),
      currentProgress: baselineScore,
      status: 'in-progress' as const,
      notes: ['Generated automatically from baseline assessment insights.'],
      dataPoints: [],
    };
  });

  return {
    id: generatedId,
    childId: baseline.childId,
    studentInfo: {
      name: studentName,
      dateOfBirth: baseline.completedDate ?? '2015-01-01',
      grade: `Grade ${baseline.academicLevels.math ? Math.round(baseline.academicLevels.math) : 3}`,
      disability: baseline.recommendations?.includes('Specialized instruction') ? ['Specific Learning Disability'] : ['Learning support needed'],
      eligibilityCategory: 'Pending Review',
    },
    meetingInfo: {
      meetingDate: today.toISOString(),
      meetingType: 'initial',
      participants: [
        { name: 'Automated Draft', role: 'AIVO Assistant Draft', attended: true },
      ],
    },
    currentPerformance: [
      {
        area: 'Academic Achievement',
        currentLevel: `Reading ${baseline.academicLevels.reading.toFixed(1)}, Math ${baseline.academicLevels.math.toFixed(1)}, Writing ${baseline.academicLevels.writing.toFixed(1)}`,
        strengths: baseline.cognitiveProfile.strengths,
        needsImprovement: baseline.cognitiveProfile.challenges,
        recommendations: baseline.recommendations,
      },
    ],
    goals: baseGoals,
    accommodations: [
      {
        id: `${generatedId}-accommodation-1`,
        type: 'instructional',
        category: 'Visual Supports',
        description: 'Provide visual schedules and graphic organizers for reading and writing tasks.',
        implementation: 'Introduce organizer at the start of each lesson; review with the student before independent work.',
        frequency: 'always',
        subjects: ['Reading', 'Writing'],
        effectiveness: 'not-assessed',
        notes: 'Derived from preferred learning style in baseline assessment.',
      },
    ],
    services: [
      {
        id: `${generatedId}-service-1`,
        type: 'special-education',
        serviceName: 'Small Group Literacy Instruction',
        provider: 'Reading Specialist',
        frequency: '3x per week',
        duration: '30 minutes',
        location: 'special-classroom',
        startDate: today.toISOString(),
        goals: baseGoals.slice(0, 1).map((goal) => goal.id),
      },
    ],
    placementInfo: {
      leastRestrictiveEnvironment: 'General education classroom with push-in supports',
      generalEducationTime: 85,
      specialEducationTime: 15,
      justification: 'Student benefits from general education setting with targeted pull-out literacy support.',
    },
    transitionPlanning: baseline.academicLevels.math >= 4
      ? {
          postSecondaryGoals: ['Improve self-advocacy skills for middle school transition.'],
          transitionServices: ['Introduce student to upcoming grade expectations.', 'Provide organizational strategy coaching.'],
          agencyInvolvement: [],
        }
      : undefined,
    status: 'active',
    effectiveDate: today.toISOString(),
    reviewDate: nextReview.toISOString(),
    createdBy: 'AIVO Adaptive Draft Assistant',
    createdDate: today.toISOString(),
    lastModified: today.toISOString(),
    signatures: [],
    source: 'auto-generated',
  };
}

function buildIepPdf(iep: IEPDocument) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 48;
  let cursorY = margin;
  const lineHeight = 18;

  const addHeading = (text: string) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, cursorY);
    cursorY += lineHeight + 6;
  };

  const addBody = (text: string, bold = false) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const wrapped = doc.splitTextToSize(text, 515);
    doc.text(wrapped, margin, cursorY);
    cursorY += wrapped.length * lineHeight;
  };

  const addSpacer = (spacing = 14) => {
    cursorY += spacing;
    if (cursorY >= 760) {
      doc.addPage();
      cursorY = margin;
    }
  };

  addHeading(`Individualized Education Program (IEP)`);
  addBody(`Student: ${iep.studentInfo.name}`, true);
  addBody(`Effective: ${new Date(iep.effectiveDate).toLocaleDateString()}  •  Review: ${new Date(iep.reviewDate).toLocaleDateString()}`);
  addBody(`Eligibility Category: ${iep.studentInfo.eligibilityCategory}`);
  addBody(`Placement: ${iep.placementInfo.leastRestrictiveEnvironment}`);
  addSpacer();

  addHeading('Current Performance');
  iep.currentPerformance.forEach((area) => {
    addBody(area.area, true);
    addBody(`Current Level: ${area.currentLevel}`);
    addBody(`Strengths: ${area.strengths.join(', ')}`);
    addBody(`Needs: ${area.needsImprovement.join(', ')}`);
    addSpacer();
  });

  addHeading('Goals Overview');
  iep.goals.forEach((goal, index) => {
    addBody(`#${index + 1} ${goal.category}`, true);
    addBody(goal.description);
    addBody(`Objective: ${goal.measurableObjective}`);
    addBody(`Criteria: ${goal.targetCriteria}`);
    addBody(`Progress: ${goal.currentProgress}%`);
    addSpacer();
  });

  addHeading('Services & Supports');
  iep.services.forEach((service) => {
    addBody(`${service.serviceName} (${service.frequency}, ${service.duration})`, true);
    addBody(`Provider: ${service.provider} • Location: ${service.location}`);
    addSpacer();
  });

  addHeading('Accommodations');
  iep.accommodations.forEach((accommodation) => {
    addBody(`${accommodation.category} (${accommodation.type})`, true);
    addBody(accommodation.description);
    addSpacer();
  });

  doc.setFontSize(9);
  doc.text('Generated by AIVO Parent Portal', margin, 780);
  return doc;
}

export const IEPDashboard: React.FC<IEPDashboardProps> = ({ childId }) => {
  const params = useParams();
  const [iepData, setIEPData] = useState<IEPOverview>(mockIEPData);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'documents' | 'meetings' | 'evaluations' | 'consents' | 'sharing'>('overview');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const baselineAssessmentUrl = useMemo(
    () => (import.meta.env.VITE_BASELINE_ASSESSMENT_URL as string | undefined) || 'http://localhost:5179',
    []
  );

  const childIdentifier = useMemo(
    () => childId || params.id || iepData.activeIEP?.childId || iepData.baselineAssessment?.childId || 'child-001',
    [childId, params.id, iepData.activeIEP, iepData.baselineAssessment]
  );

  const childDisplayName = useMemo(
    () => iepData.activeIEP?.studentInfo.name || iepData.baselineAssessment?.studentName || 'your child',
    [iepData.activeIEP, iepData.baselineAssessment]
  );

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const openBaselineAssessment = () => {
    const trimmedBase = baselineAssessmentUrl.replace(/\/+$/, '');
    const searchParams = new URLSearchParams({
      childId: childIdentifier,
      childName: childDisplayName,
    });
    window.open(`${trimmedBase}/?${searchParams.toString()}`, '_blank', 'noopener,noreferrer');
  };

  const handleGenerateIepFromAssessment = async () => {
    if (iepData.activeIEP) {
      showToast('error', 'An active IEP already exists for this learner.');
      setActiveTab('overview');
      return;
    }

    if (!iepData.baselineAssessment) {
      showToast('error', 'No baseline assessment found. Launching baseline assessment...');
      openBaselineAssessment();
      return;
    }

    setIsGenerating(true);
    try {
      const newIep = createAutoGeneratedIepFromBaseline(iepData.baselineAssessment, childDisplayName);
      setIEPData((prev) => ({
        ...prev,
        activeIEP: newIep,
        baselineAssessment: prev.baselineAssessment
          ? {
              ...prev.baselineAssessment,
              iepGenerated: true,
              generatedIepId: newIep.id,
            }
          : prev.baselineAssessment,
        recentActivity: [
          {
            type: 'iep-update',
            description: 'New IEP generated from baseline assessment',
            date: new Date().toISOString(),
            status: 'completed',
          },
          ...prev.recentActivity,
        ],
      }));
      setActiveTab('documents');
      showToast('success', 'Personalized IEP created from baseline assessment.');
    } catch (error) {
      console.error('Unable to generate IEP', error);
      showToast('error', 'Something went wrong while generating the IEP.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadIepPdf = () => {
    if (!iepData.activeIEP) {
      showToast('error', 'There is no active IEP to download yet.');
      return;
    }

    try {
      const pdf = buildIepPdf(iepData.activeIEP);
      const fileName = `IEP-${iepData.activeIEP.studentInfo.name.replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);
      showToast('success', 'Your IEP PDF has been generated and downloaded.');
    } catch (error) {
      console.error('Failed to create IEP PDF', error);
      showToast('error', 'We could not generate the PDF. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'in-progress':
        return <Activity className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-2">
            IEP & Special Education
          </h1>
          <p className="text-gray-600">
            Manage your child's Individualized Education Program and special education services
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!iepData.activeIEP && (
            <>
              <Button 
                variant="gradient"
                className="flex items-center gap-2"
                onClick={handleGenerateIepFromAssessment}
                loading={isGenerating}
              >
                <Plus className="w-4 h-4" />
                Generate IEP from Assessment
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={openBaselineAssessment}
              >
                <Play className="w-4 h-4" />
                Baseline Assessment
              </Button>
            </>
          )}
          
          {iepData.activeIEP && (
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 border border-coral-300 text-coral-600 rounded-full hover:bg-coral-50 transition-colors text-sm font-medium"
              onClick={() => setActiveTab('sharing')}
            >
              <Share2 className="w-4 h-4" />
              Share IEP
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: Eye },
              { key: 'progress', label: 'Progress Tracking', icon: TrendingUp },
              { key: 'documents', label: 'IEP Documents', icon: FileText },
              { key: 'meetings', label: 'Meetings', icon: Calendar },
              { key: 'evaluations', label: 'Evaluations', icon: Target },
              { key: 'consents', label: 'Consents', icon: CheckCircle },
              { key: 'sharing', label: 'Sharing & Security', icon: Shield }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? 'border-coral-500 text-coral-600 bg-coral-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Current IEP Status */}
              {iepData.activeIEP ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Active IEP</h3>
                      <p className="text-gray-600">
                        {iepData.activeIEP.studentInfo.name} - {iepData.activeIEP.studentInfo.grade}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-coral-500" />
                        <span className="font-medium text-gray-900">Effective Date</span>
                      </div>
                      <p className="text-gray-600">{formatDate(iepData.activeIEP.effectiveDate)}</p>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-gray-900">Goals</span>
                      </div>
                      <p className="text-gray-600">{iepData.activeIEP.goals.length} Active Goals</p>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <School className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-900">Placement</span>
                      </div>
                      <p className="text-gray-600">{iepData.activeIEP.placementInfo.generalEducationTime}% General Ed</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 border border-coral-300 text-coral-600 rounded-full hover:bg-coral-50 transition-colors text-sm font-medium"
                      onClick={() => setActiveTab('documents')}
                    >
                      <Eye className="w-4 h-4" />
                      View Full IEP
                    </button>
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-full hover:bg-coral-600 transition-colors text-sm font-medium"
                      onClick={handleDownloadIepPdf}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
                </motion.div>
              ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
                >
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Active IEP</h3>
                    <p className="text-gray-600 mb-4">
                      Your child doesn't currently have an active IEP. You can generate one based on their baseline assessment.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button 
                        variant="gradient"
                        className="flex items-center gap-2"
                        onClick={handleGenerateIepFromAssessment}
                        loading={isGenerating}
                      >
                        <Plus className="w-4 h-4" />
                        Generate IEP from Assessment
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={openBaselineAssessment}
                      >
                        <Play className="w-4 h-4" />
                        Launch Baseline Assessment
                      </Button>
                    </div>
                  </div>
                </div>
                </motion.div>
              )}

              {/* Pending Actions */}
              {(iepData.pendingConsents.length > 0 || iepData.evaluationRequests.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Required</h3>
                  <div className="space-y-3">
                    {iepData.pendingConsents.map((consent) => (
                      <motion.div
                        key={consent.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="bg-white rounded-xl p-4 border-l-4 border-coral-500 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{consent.title}</h4>
                            <p className="text-sm text-gray-600">{consent.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Due: {formatDate(consent.dueDate)}</p>
                          </div>
                          <button 
                            className="px-4 py-2 bg-gradient-to-r from-coral-500 to-salmon-500 text-white rounded-full hover:from-coral-600 hover:to-salmon-600 transition-all text-sm font-medium"
                            onClick={() => setActiveTab('consents')}
                          >
                            Review & Sign
                          </button>
                        </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {iepData.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(activity.status)}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <IEPProgressTracking childId={childId} />
          )}

          {activeTab === 'documents' && (
            <IEPDocumentViewer childId={childId} />
          )}

          {activeTab === 'meetings' && (
            <IEPMeetingScheduler childId={childId} />
          )}

          {activeTab === 'evaluations' && (
            <EvaluationRequestSystem childId={childId} />
          )}

          {activeTab === 'consents' && (
            <DigitalConsentForms childId={childId} />
          )}

          {activeTab === 'sharing' && (
            <EnhancedIEPSharingSystem childId={childId} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-6 right-6 z-40 rounded-xl px-4 py-3 shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Default export for router usage
const IEPDashboardPage: React.FC = () => {
  const { id } = useParams();
  return <IEPDashboard childId={id || 'default'} />;
};

export default IEPDashboardPage;