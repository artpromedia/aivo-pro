// IEP (Individualized Education Program) Type Definitions

export interface IEPGoal {
  id: string;
  domain: 'academic' | 'behavioral' | 'social' | 'communication' | 'motor' | 'adaptive';
  category: string; // e.g., "Reading Comprehension", "Math Problem Solving"
  description: string;
  measurableObjective: string;
  targetCriteria: string; // e.g., "80% accuracy over 3 consecutive trials"
  evaluationMethod: string;
  frequency: string; // e.g., "Daily", "Weekly", "Monthly"
  startDate: string;
  targetDate: string;
  currentProgress: number; // 0-100 percentage
  status: 'not-started' | 'in-progress' | 'mastered' | 'discontinued';
  notes: string[];
  dataPoints: {
    date: string;
    score: number;
    notes?: string;
  }[];
}

export interface Accommodation {
  id: string;
  type: 'instructional' | 'assessment' | 'behavioral' | 'environmental';
  category: string;
  description: string;
  implementation: string;
  frequency: 'always' | 'as-needed' | 'specific-subjects';
  subjects?: string[];
  effectiveness: 'not-assessed' | 'highly-effective' | 'effective' | 'somewhat-effective' | 'not-effective';
  notes: string;
}

export interface Service {
  id: string;
  type: 'speech-therapy' | 'occupational-therapy' | 'physical-therapy' | 'counseling' | 'special-education' | 'other';
  serviceName: string;
  provider: string;
  frequency: string; // e.g., "2x per week"
  duration: string; // e.g., "30 minutes"
  location: 'general-classroom' | 'special-classroom' | 'therapy-room' | 'other';
  startDate: string;
  endDate?: string;
  goals: string[]; // IEP goal IDs this service supports
}

export interface EvaluationArea {
  area: string;
  currentLevel: string;
  strengths: string[];
  needsImprovement: string[];
  recommendations: string[];
}

export interface IEPDocument {
  id: string;
  childId: string;
  studentInfo: {
    name: string;
    dateOfBirth: string;
    grade: string;
    school?: string;
    disability: string[];
    eligibilityCategory: string;
  };
  meetingInfo: {
    meetingDate: string;
    meetingType: 'initial' | 'annual' | 'review' | 'amendment';
    participants: {
      name: string;
      role: string;
      attended: boolean;
    }[];
  };
  currentPerformance: EvaluationArea[];
  goals: IEPGoal[];
  accommodations: Accommodation[];
  services: Service[];
  placementInfo: {
    leastRestrictiveEnvironment: string;
    generalEducationTime: number; // percentage
    specialEducationTime: number; // percentage
    justification: string;
  };
  transitionPlanning?: {
    postSecondaryGoals: string[];
    transitionServices: string[];
    agencyInvolvement: string[];
  };
  status: 'draft' | 'active' | 'expired' | 'superseded';
  effectiveDate: string;
  reviewDate: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  signatures: ConsentSignature[];
  source: 'teacher-created' | 'auto-generated' | 'imported';
}

export interface ConsentForm {
  id: string;
  childId: string;
  type: 'evaluation' | 'iep-services' | 'placement' | 'amendment' | 'reevaluation';
  title: string;
  description: string;
  content: string; // HTML content of the form
  requiredBy: string; // who requested the consent
  dueDate: string;
  status: 'pending' | 'signed' | 'declined' | 'expired';
  createdDate: string;
  parentSignature?: ConsentSignature;
  relatedDocuments: string[]; // IDs of related evaluations, IEPs, etc.
}

export interface ConsentSignature {
  signerName: string;
  signerRole: 'parent' | 'guardian' | 'student' | 'teacher' | 'administrator';
  signatureData: string; // base64 signature image
  signedDate: string;
  ipAddress: string;
  consentGiven: boolean;
  comments?: string;
}

export interface EvaluationRequest {
  id: string;
  childId: string;
  requestedBy: {
    name: string;
    role: string;
    school?: string;
  };
  evaluationType: 'initial' | 'reevaluation' | 'independent';
  areasOfConcern: string[];
  reasonForReferral: string;
  proposedEvaluations: string[];
  timeline: string;
  status: 'pending-consent' | 'in-progress' | 'completed' | 'declined';
  requestDate: string;
  consentForm?: ConsentForm;
  evaluationResults?: EvaluationResult[];
}

export interface EvaluationResult {
  id: string;
  evaluationType: string;
  evaluator: string;
  evaluationDate: string;
  results: EvaluationArea[];
  recommendations: string[];
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface BaselineAssessment {
  id: string;
  childId: string;
  assessmentDate: string;
  academicLevels: {
    reading: number;
    math: number;
    writing: number;
    science: number;
  };
  cognitiveProfile: {
    strengths: string[];
    challenges: string[];
    learningStyle: string;
    processingSpeed: string;
    attention: string;
  };
  behavioralObservations: {
    socialSkills: string;
    selfRegulation: string;
    adaptiveBehavior: string;
    communicationSkills: string;
  };
  recommendations: string[];
  iepGenerated: boolean;
  generatedIepId?: string;
  studentName?: string;
  completedDate?: string;
  overallScore?: number;
  domains?: {
    name: string;
    score: number;
  }[];
}

export interface IEPShareRequest {
  id: string;
  childId: string;
  iepId: string;
  sharedWith: {
    recipientType: 'teacher' | 'school' | 'therapist' | 'other';
    recipientName: string;
    recipientEmail: string;
    school?: string;
    message?: string;
  };
  sharedBy: string;
  sharedDate: string;
  accessLevel: 'full' | 'summary' | 'goals-only';
  status: 'sent' | 'viewed' | 'acknowledged';
  expirationDate?: string;
}

export interface IEPShare {
  id: string;
  iepId?: string;
  shareToken: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: 'teacher' | 'school-admin' | 'specialist' | 'other';
  permissions: {
    view: boolean;
    download: boolean;
    print: boolean;
    share: boolean;
  };
  status: 'active' | 'paused' | 'revoked' | 'expired';
  requireLogin: boolean;
  notifyOnAccess: boolean;
  message?: string;
  accessLimit?: number;
  expirationDate?: string;
  createdDate: string;
  lastAccessed?: string;
  accessHistory: {
    timestamp: string;
    ipAddress: string;
  }[];
}