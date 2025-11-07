import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SessionData {
  childId: string;
  childName: string;
  grade: number;
  enrolledBy: 'parent' | 'teacher';
  districtLicense?: string;
  parentEmail?: string;
  teacherEmail?: string;
  teacherName?: string;
  schoolName?: string;
  assessmentResults?: any;
}

interface CloningContextType {
  sessionData: SessionData;
  cloningResults?: any;
  updateResults: (results: any) => void;
}

const CloningContext = createContext<CloningContextType | undefined>(undefined);

export const useCloning = () => {
  const context = useContext(CloningContext);
  if (!context) {
    throw new Error('useCloning must be used within CloningProvider');
  }
  return context;
};

interface CloningProviderProps {
  sessionData: SessionData;
  children: ReactNode;
}

export const CloningProvider: React.FC<CloningProviderProps> = ({ sessionData, children }) => {
  const [cloningResults, setCloningResults] = useState<any>(null);

  const updateResults = (results: any) => {
    setCloningResults(results);
  };

  return (
    <CloningContext.Provider value={{ sessionData, cloningResults, updateResults }}>
      {children}
    </CloningContext.Provider>
  );
};
