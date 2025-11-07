import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  Eye, 
  Edit,
  Clock,
  User,
  Calendar,
  Target,
  BookOpen,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

interface IEPDocument {
  id: string;
  title: string;
  type: 'current' | 'previous' | 'draft';
  version: string;
  createdDate: string;
  lastModified: string;
  status: 'active' | 'archived' | 'draft' | 'pending-approval';
  effectiveDate: string;
  expirationDate: string;
  sections: IEPSection[];
  metadata: {
    studentName: string;
    dateOfBirth: string;
    grade: string;
    disability: string[];
    caseManager: string;
    school: string;
  };
}

interface IEPSection {
  id: string;
  title: string;
  type: 'goals' | 'accommodations' | 'services' | 'evaluations' | 'placement' | 'transition';
  content: any;
  lastUpdated: string;
  updatedBy: string;
}

interface IEPGoalDetail {
  id: string;
  area: string;
  description: string;
  measurableObjective: string;
  criteria: string;
  evaluation: string;
  frequency: string;
  location: string;
  progress: number;
  status: 'on-track' | 'needs-attention' | 'completed';
}

interface IEPDocumentViewerProps {
  childId: string;
}

const IEPDocumentViewer: React.FC<IEPDocumentViewerProps> = ({ childId }) => {
  const [documents, setDocuments] = useState<IEPDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<IEPDocument | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['goals']));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIEPDocuments();
  }, [childId]);

  const loadIEPDocuments = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockDocuments: IEPDocument[] = [
        {
          id: '1',
          title: 'Current IEP - 2024-2025',
          type: 'current',
          version: '2.1',
          createdDate: '2024-08-15',
          lastModified: '2024-10-30',
          status: 'active',
          effectiveDate: '2024-08-15',
          expirationDate: '2025-08-14',
          metadata: {
            studentName: 'Alex Johnson',
            dateOfBirth: '2015-03-12',
            grade: '4th Grade',
            disability: ['Specific Learning Disability', 'ADHD'],
            caseManager: 'Ms. Sarah Thompson',
            school: 'Lincoln Elementary School'
          },
          sections: [
            {
              id: 'goals',
              title: 'Annual Goals',
              type: 'goals',
              lastUpdated: '2024-10-30',
              updatedBy: 'Ms. Sarah Thompson',
              content: [
                {
                  id: '1',
                  area: 'Reading Comprehension',
                  description: 'Student will improve reading comprehension skills at grade level',
                  measurableObjective: 'Given grade-level text, Alex will answer comprehension questions with 80% accuracy',
                  criteria: '80% accuracy on 4 out of 5 consecutive trials',
                  evaluation: 'Weekly comprehension assessments and teacher observation',
                  frequency: 'Daily',
                  location: 'General education classroom with resource room support',
                  progress: 75,
                  status: 'on-track'
                },
                {
                  id: '2',
                  area: 'Written Expression',
                  description: 'Student will improve written expression skills',
                  measurableObjective: 'Alex will write a 5-sentence paragraph with proper grammar and organization',
                  criteria: '4 out of 5 consecutive writing samples meeting criteria',
                  evaluation: 'Bi-weekly writing samples and rubric assessment',
                  frequency: '3 times per week',
                  location: 'Resource room',
                  progress: 45,
                  status: 'needs-attention'
                },
                {
                  id: '3',
                  area: 'Mathematics Problem Solving',
                  description: 'Student will solve multi-step math problems',
                  measurableObjective: 'Alex will solve 2-step word problems with 70% accuracy',
                  criteria: '70% accuracy on 3 out of 4 consecutive assessments',
                  evaluation: 'Weekly math assessments',
                  frequency: 'Daily',
                  location: 'General education classroom',
                  progress: 85,
                  status: 'on-track'
                }
              ]
            },
            {
              id: 'accommodations',
              title: 'Accommodations & Modifications',
              type: 'accommodations',
              lastUpdated: '2024-09-15',
              updatedBy: 'Ms. Sarah Thompson',
              content: {
                instructional: [
                  'Extended time on assignments and tests (1.5x)',
                  'Preferential seating near teacher',
                  'Frequent breaks during long activities',
                  'Visual aids and graphic organizers',
                  'Chunking of assignments into smaller parts'
                ],
                testing: [
                  'Extended time on all assessments',
                  'Separate testing environment',
                  'Test questions read aloud',
                  'Frequent breaks during testing',
                  'Use of calculator for non-computation items'
                ],
                environmental: [
                  'Reduced distractions in workspace',
                  'Noise-canceling headphones available',
                  'Fidget tools allowed',
                  'Standing desk option',
                  'Calm-down area access'
                ]
              }
            },
            {
              id: 'services',
              title: 'Special Education Services',
              type: 'services',
              lastUpdated: '2024-08-15',
              updatedBy: 'IEP Team',
              content: [
                {
                  service: 'Special Education Instruction',
                  frequency: '5 times per week',
                  duration: '60 minutes per session',
                  location: 'Resource Room',
                  provider: 'Special Education Teacher',
                  startDate: '2024-08-15',
                  endDate: '2025-08-14'
                },
                {
                  service: 'Speech-Language Therapy',
                  frequency: '2 times per week',
                  duration: '30 minutes per session',
                  location: 'Speech Room', 
                  provider: 'Speech-Language Pathologist',
                  startDate: '2024-08-15',
                  endDate: '2025-08-14'
                },
                {
                  service: 'Occupational Therapy',
                  frequency: '1 time per week',
                  duration: '30 minutes per session',
                  location: 'OT Room',
                  provider: 'Occupational Therapist',
                  startDate: '2024-08-15',
                  endDate: '2025-08-14'
                }
              ]
            }
          ]
        },
        {
          id: '2',
          title: 'Previous IEP - 2023-2024',
          type: 'previous',
          version: '1.0',
          createdDate: '2023-08-10',
          lastModified: '2024-07-30',
          status: 'archived',
          effectiveDate: '2023-08-10',
          expirationDate: '2024-08-09',
          metadata: {
            studentName: 'Alex Johnson',
            dateOfBirth: '2015-03-12',
            grade: '3rd Grade',
            disability: ['Specific Learning Disability'],
            caseManager: 'Mr. David Wilson',
            school: 'Lincoln Elementary School'
          },
          sections: []
        }
      ];
      setDocuments(mockDocuments);
      setSelectedDocument(mockDocuments[0]);
    } catch (error) {
      console.error('Error loading IEP documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending-approval': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-50';
      case 'needs-attention': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const filteredDocuments = documents.filter(doc => {
    if (filterType !== 'all' && doc.type !== filterType) return false;
    if (searchTerm && !doc.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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
          <h2 className="text-2xl font-bold text-gray-900">IEP Documents</h2>
          <p className="text-gray-600">View and manage IEP documentation</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-full hover:bg-coral-600 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-medium text-gray-900">Documents</h3>
              <span className="text-sm text-gray-500">({documents.length})</span>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              >
                <option value="all">All Types</option>
                <option value="current">Current</option>
                <option value="previous">Previous</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Document List */}
            <div className="space-y-2">
              {filteredDocuments.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedDocument?.id === doc.id
                      ? 'border-coral-200 bg-coral-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm text-gray-900 truncate">
                      {doc.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <span className="text-xs text-gray-500">v{doc.version}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="lg:col-span-3">
          {selectedDocument ? (
            <div className="bg-white rounded-xl border border-gray-200">
              {/* Document Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedDocument.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Version {selectedDocument.version}</span>
                      <span>•</span>
                      <span>Last modified: {new Date(selectedDocument.lastModified).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Student</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDocument.metadata.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Grade</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDocument.metadata.grade}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Case Manager</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDocument.metadata.caseManager}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Effective Period</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedDocument.effectiveDate).toLocaleDateString()} - {new Date(selectedDocument.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Sections */}
              <div className="p-6">
                <div className="space-y-6">
                  {selectedDocument.sections.map(section => (
                    <div key={section.id} className="border border-gray-200 rounded-lg">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-t-lg"
                      >
                        <div className="flex items-center gap-3">
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                          <h3 className="font-medium text-gray-900">{section.title}</h3>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>Updated: {new Date(section.lastUpdated).toLocaleDateString()}</p>
                          <p>By: {section.updatedBy}</p>
                        </div>
                      </button>

                      {/* Section Content */}
                      {expandedSections.has(section.id) && (
                        <div className="p-4 border-t border-gray-200">
                          {section.type === 'goals' && (
                            <div className="space-y-4">
                              {(section.content as IEPGoalDetail[]).map(goal => (
                                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h4 className="font-medium text-gray-900">{goal.area}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${getGoalStatusColor(goal.status)}`}>
                                        {goal.status.replace('-', ' ')}
                                      </span>
                                      <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium text-gray-700 mb-1">Measurable Objective:</p>
                                      <p className="text-gray-600">{goal.measurableObjective}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700 mb-1">Success Criteria:</p>
                                      <p className="text-gray-600">{goal.criteria}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700 mb-1">Evaluation Method:</p>
                                      <p className="text-gray-600">{goal.evaluation}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700 mb-1">Frequency & Location:</p>
                                      <p className="text-gray-600">{goal.frequency} - {goal.location}</p>
                                    </div>
                                  </div>

                                  <div className="mt-3">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                      <span>Progress</span>
                                      <span>{goal.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-coral-500 h-2 rounded-full transition-all"
                                        style={{ width: `${goal.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {section.type === 'accommodations' && (
                            <div className="space-y-6">
                              {Object.entries(section.content).map(([category, accommodations]) => (
                                <div key={category}>
                                  <h4 className="font-medium text-gray-900 mb-3 capitalize">
                                    {category} Accommodations
                                  </h4>
                                  <ul className="space-y-2">
                                    {(accommodations as string[]).map((accommodation, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-coral-500 rounded-full mt-2 flex-shrink-0" />
                                        <span className="text-gray-700">{accommodation}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          {section.type === 'services' && (
                            <div className="space-y-4">
                              {(section.content as any[]).map((service, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-900 mb-3">{service.service}</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium text-gray-700">Frequency:</p>
                                      <p className="text-gray-600">{service.frequency}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Duration:</p>
                                      <p className="text-gray-600">{service.duration}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Location:</p>
                                      <p className="text-gray-600">{service.location}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-700">Provider:</p>
                                      <p className="text-gray-600">{service.provider}</p>
                                    </div>
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">
                                    Service Period: {new Date(service.startDate).toLocaleDateString()} - {new Date(service.endDate).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Document</h3>
              <p className="text-gray-600">Choose an IEP document from the list to view its contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IEPDocumentViewer;