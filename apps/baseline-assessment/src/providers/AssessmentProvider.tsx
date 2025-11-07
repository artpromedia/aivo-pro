import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SessionData {
  childId: string;
  childName: string;
  grade: number;
  enrolledBy: 'parent' | 'teacher';
  districtLicense?: string;
  parentEmail?: string;
  teacherEmail?: string;
  consentStatus: {
    assessment: boolean;
    modelCloning: boolean;
  };
}

interface AssessmentContextType {
  sessionData: SessionData;
  assessmentResults?: any;
  currentQuestion: number;
  answers: Record<number, any>;
  setCurrentQuestion: (q: number) => void;
  setAnswers: (answers: Record<number, any>) => void;
  updateResults: (results: any) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  sessionData: SessionData;
  children: ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ sessionData, children }) => {
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const updateResults = (results: any) => {
    setAssessmentResults(results);
  };

  return (
    <AssessmentContext.Provider value={{ 
      sessionData, 
      assessmentResults, 
      currentQuestion,
      answers,
      setCurrentQuestion,
      setAnswers,
      updateResults 
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};
