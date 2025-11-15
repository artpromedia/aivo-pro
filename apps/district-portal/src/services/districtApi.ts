/**
 * District Portal API Service
 * Connects to district-analytics-svc for real-time district data
 */

const API_BASE_URL = import.meta.env.VITE_DISTRICT_API_URL || 'http://localhost:8005';

export interface DistrictData {
  districtName: string;
  districtId: string;
  totalSchools: number;
  activeTeachers: number;
  totalStudents: number;
  licenseUtilization: number;
  licensesRemaining: number;
  totalLicenses: number;
  budget: {
    total: number;
    spent: number;
  };
  topSchools: Array<{
    id: string;
    name: string;
    studentCount: number;
    teacherCount: number;
    avgProgress: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
  compliance: {
    status: string;
    score: number;
    lastAudit: string;
    ferpa: { status: string; lastCheck: string };
    coppa: { status: string; lastCheck: string };
    statePrivacy: { status: string; lastCheck: string };
    dataEncryption: number;
    auditTrail: string;
  };
  performanceTrends: Array<{
    month: string;
    students: number;
    engagement: number;
    performance: number;
    licenses: number;
  }>;
  engagementBySchool: Array<{
    name: string;
    value: number;
    students: number;
  }>;
  studentInsights: {
    totalEnrolled: number;
    iepStudents: number;
    gradeLevels: Record<string, number>;
    demographics: Record<string, number>;
  };
  teacherMetrics: {
    totalActive: number;
    professionalDevelopment: number;
    averageClassSize: number;
    retention: number;
  };
  // Additional properties used by the dashboard UI
  criticalAlerts?: Array<{
    type: string;
    message: string;
    severity: 'high' | 'medium' | 'low';
    timestamp: string;
  }>;
  predictiveInsights?: Array<{
    id: number;
    type: string;
    priority: string;
    title: string;
    message: string;
    impact: string;
    recommendation: string;
    confidence: number;
  }>;
  benchmarks?: {
    districtAverage: number;
    stateAverage: number;
    nationalAverage: number;
    topPerformer: number;
  };
  keyMetricsTrends?: {
    studentGrowth?: { value: number; trend: 'up' | 'down' | 'stable'; period: string };
    teacherRetention?: { value: number; trend: 'up' | 'down' | 'stable'; period: string };
    licenseEfficiency?: { value: number; trend: 'up' | 'down' | 'stable'; period: string };
    budgetUtilization?: { value: number; trend: 'up' | 'down' | 'stable'; period: string };
  };
  licenseDistribution?: Array<{
    name: string;
    allocated: number;
    used: number;
  }>;
  budgetBreakdown?: Array<{
    name: string;
    value: number;
  }>;
  supportManager?: {
    name: string;
    email: string;
    phone: string;
  };
}

/**
 * Fetch district overview data
 */
export async function fetchDistrictOverview(districtId: string): Promise<DistrictData> {
  try {
    console.log('📊 Fetching district data from analytics service...');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/district/${districtId}/overview`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ District data fetched successfully');
    return data;
  } catch (error) {
    console.warn('⚠️ District analytics service not available, using cached/demo data:', error);
    
    // Fallback to localStorage or demo data
    const cachedData = localStorage.getItem(`district_data_${districtId}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Return demo data structure if service unavailable
    return getDemoDistrictData(districtId);
  }
}

/**
 * Fetch teacher analytics
 */
export async function fetchTeacherAnalytics(districtId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/district/${districtId}/teachers`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('⚠️ Teacher analytics not available, using demo data:', error);
    return getDemoTeachersData();
  }
}

/**
 * Demo teachers data
 */
function getDemoTeachersData() {
  return [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '(555) 123-4567',
      school: 'Lincoln Elementary',
      subjects: ['Mathematics', 'Science'],
      grades: ['3rd', '4th'],
      totalStudents: 58,
      activeStudents: 56,
      avgPerformance: 87,
      experience: 8,
      certification: 'Elementary Education, Math Specialist',
      status: 'active',
      joinDate: '2016-08-15',
      avatar: null
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'm.chen@school.edu',
      phone: '(555) 234-5678',
      school: 'Washington Middle',
      subjects: ['English', 'Literature'],
      grades: ['6th', '7th', '8th'],
      totalStudents: 124,
      activeStudents: 119,
      avgPerformance: 82,
      experience: 12,
      certification: 'Secondary Education, English',
      status: 'active',
      joinDate: '2012-09-01',
      avatar: null
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'e.rodriguez@school.edu',
      phone: '(555) 345-6789',
      school: 'Roosevelt High',
      subjects: ['Biology', 'Chemistry'],
      grades: ['9th', '10th', '11th', '12th'],
      totalStudents: 142,
      activeStudents: 138,
      avgPerformance: 91,
      experience: 6,
      certification: 'Secondary Education, Science',
      status: 'active',
      joinDate: '2018-08-20',
      avatar: null
    }
  ];
}

/**
 * Fetch usage reports
 */
export async function fetchUsageReport(districtId: string, period: string = 'monthly') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/district/${districtId}/usage?period=${period}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('⚠️ Usage report not available, using demo data:', error);
    return getDemoUsageData();
  }
}

/**
 * Demo usage data
 */
function getDemoUsageData() {
  return {
    summary: {
      totalLogins: 12450,
      activeUsers: 1847,
      avgSessionDuration: '24 min',
      featureAdoption: 78
    },
    loginTrend: [
      { date: 'Nov 1', logins: 1650, uniqueUsers: 342 },
      { date: 'Nov 2', logins: 1720, uniqueUsers: 358 },
      { date: 'Nov 3', logins: 1580, uniqueUsers: 328 },
      { date: 'Nov 4', logins: 1890, uniqueUsers: 395 },
      { date: 'Nov 5', logins: 1950, uniqueUsers: 410 },
      { date: 'Nov 6', logins: 1660, uniqueUsers: 414 }
    ],
    featureUsage: [
      { feature: 'Dashboard', sessions: 2450, avgTime: '8 min' },
      { feature: 'Student Profiles', sessions: 1890, avgTime: '12 min' },
      { feature: 'AI Model', sessions: 1650, avgTime: '18 min' },
      { feature: 'IEP Management', sessions: 1420, avgTime: '22 min' },
      { feature: 'Reports', sessions: 980, avgTime: '15 min' },
      { feature: 'Settings', sessions: 560, avgTime: '5 min' }
    ],
    userActivity: [
      { role: 'Teachers', count: 892, percentage: 48 },
      { role: 'Students', count: 756, percentage: 41 },
      { role: 'Admins', count: 145, percentage: 8 },
      { role: 'Parents', count: 54, percentage: 3 }
    ],
    sessionDuration: [
      { range: '0-5 min', count: 850 },
      { range: '5-15 min', count: 2340 },
      { range: '15-30 min', count: 3120 },
      { range: '30-60 min', count: 1890 },
      { range: '60+ min', count: 980 }
    ],
    peakHours: [
      { hour: '6 AM', activity: 120 },
      { hour: '8 AM', activity: 890 },
      { hour: '10 AM', activity: 1450 },
      { hour: '12 PM', activity: 980 },
      { hour: '2 PM', activity: 1320 },
      { hour: '4 PM', activity: 780 },
      { hour: '6 PM', activity: 420 },
      { hour: '8 PM', activity: 280 }
    ]
  };
}

/**
 * Update license allocation
 */
export async function updateLicenseAllocation(
  districtId: string,
  schoolId: string,
  licenses: number
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/district/${districtId}/licenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schoolId, licenses }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Failed to update license allocation:', error);
    throw error;
  }
}

/**
 * Demo/fallback data when service is unavailable
 */
function getDemoDistrictData(districtId: string): DistrictData {
  return {
    districtName: 'Demo District',
    districtId,
    totalSchools: 15,
    activeTeachers: 245,
    totalStudents: 4823,
    licenseUtilization: 87,
    licensesRemaining: 125,
    totalLicenses: 2500,
    budget: {
      total: 500000,
      spent: 375000,
    },
    topSchools: [
      { id: '1', name: 'Lincoln Elementary', studentCount: 425, teacherCount: 28, avgProgress: 94 },
      { id: '2', name: 'Washington Middle School', studentCount: 580, teacherCount: 42, avgProgress: 91 },
      { id: '3', name: 'Roosevelt High School', studentCount: 892, teacherCount: 58, avgProgress: 88 },
    ],
    recentActivity: [
      { type: 'enrollment', description: '52 new students enrolled at Lincoln Elementary', timestamp: '2 hours ago' },
      { type: 'license', description: '15 licenses allocated to Washington Middle School', timestamp: '5 hours ago' },
    ],
    compliance: {
      status: 'compliant',
      score: 98,
      lastAudit: '2024-11-01',
      ferpa: { status: 'compliant', lastCheck: '2024-11-01' },
      coppa: { status: 'compliant', lastCheck: '2024-10-28' },
      statePrivacy: { status: 'compliant', lastCheck: '2024-10-25' },
      dataEncryption: 100,
      auditTrail: 'active',
    },
    performanceTrends: [
      { month: 'Jun', students: 4621, engagement: 82, performance: 78, licenses: 2300 },
      { month: 'Jul', students: 4598, engagement: 79, performance: 76, licenses: 2280 },
      { month: 'Aug', students: 4712, engagement: 85, performance: 81, licenses: 2350 },
      { month: 'Sep', students: 4789, engagement: 88, performance: 84, licenses: 2420 },
      { month: 'Oct', students: 4823, engagement: 91, performance: 87, licenses: 2500 },
      { month: 'Nov', students: 4823, engagement: 93, performance: 89, licenses: 2500 },
    ],
    engagementBySchool: [
      { name: 'Lincoln Elem', value: 94, students: 425 },
      { name: 'Washington MS', value: 91, students: 580 },
      { name: 'Roosevelt HS', value: 88, students: 892 },
      { name: 'Jefferson Elem', value: 86, students: 350 },
      { name: 'Madison MS', value: 89, students: 485 },
    ],
    studentInsights: {
      totalEnrolled: 4823,
      iepStudents: 412,
      gradeLevels: {
        'K-5': 2145,
        '6-8': 1456,
        '9-12': 1222,
      },
      demographics: {
        diverse: 68,
        economicallyDisadvantaged: 42,
        hispanic: 35,
        black: 22,
        white: 28,
        asian: 12,
        other: 3,
      },
    },
    teacherMetrics: {
      totalActive: 245,
      professionalDevelopment: 189,
      averageClassSize: 24,
      retention: 94,
    },
    // Additional properties for dashboard UI
    criticalAlerts: [
      { type: 'license', message: 'License capacity at 87%', severity: 'high', timestamp: new Date().toISOString() },
    ],
    predictiveInsights: [
      {
        id: 1,
        type: 'capacity',
        priority: 'high',
        title: 'License Capacity Alert',
        message: 'Based on current trends, you will need 200 additional licenses by March 2026',
        impact: 'high',
        recommendation: 'Purchase licenses now to benefit from early-bird pricing',
        confidence: 94,
      },
      {
        id: 2,
        type: 'performance',
        priority: 'medium',
        title: 'Performance Improvement Opportunity',
        message: 'Jefferson Elementary showing 12% lower engagement than district average',
        impact: 'medium',
        recommendation: 'Schedule professional development session for Jefferson Elementary staff',
        confidence: 87,
      },
    ],
    benchmarks: {
      districtAverage: 89,
      stateAverage: 82,
      nationalAverage: 78,
      topPerformer: 96,
    },
    keyMetricsTrends: {
      studentGrowth: { value: 8.5, trend: 'up', period: '6 months' },
      teacherRetention: { value: 94, trend: 'up', period: 'YoY' },
      licenseEfficiency: { value: 87, trend: 'stable', period: 'month' },
      budgetUtilization: { value: 75, trend: 'down', period: 'quarter' },
    },
    licenseDistribution: [
      { name: 'Lincoln Elementary', allocated: 450, used: 425 },
      { name: 'Washington Middle', allocated: 600, used: 580 },
      { name: 'Roosevelt High', allocated: 900, used: 892 },
      { name: 'Jefferson Elementary', allocated: 375, used: 350 },
      { name: 'Madison Middle', allocated: 500, used: 485 },
    ],
    budgetBreakdown: [
      { name: 'Licenses', value: 250000 },
      { name: 'Training', value: 75000 },
      { name: 'Support', value: 50000 },
      { name: 'Infrastructure', value: 125000 },
    ],
    supportManager: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@aivo.com',
      phone: '(555) 123-4567',
    },
  };
}

/**
 * Fetch LMS integrations
 */
export async function fetchIntegrations(districtId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/district/${districtId}/integrations`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('⚠️ Integrations data not available, using demo data:', error);
    return getDemoIntegrationsData();
  }
}

/**
 * Demo integrations data
 */
function getDemoIntegrationsData() {
  return [
    {
      id: 'lms-001',
      name: 'Google Classroom',
      provider: 'Google',
      icon: '/icons/google-classroom.svg',
      connected: true,
      status: 'active',
      lastSync: '2024-11-06T10:30:00',
      coursesCount: 156,
      studentsCount: 3241,
      syncFrequency: 'Every 4 hours',
      features: ['Roster Sync', 'Grade Sync', 'Assignment Sync', 'Auto-enrollment']
    },
    {
      id: 'lms-002',
      name: 'Canvas LMS',
      provider: 'Instructure',
      icon: '/icons/canvas.svg',
      connected: true,
      status: 'active',
      lastSync: '2024-11-06T09:15:00',
      coursesCount: 89,
      studentsCount: 1582,
      syncFrequency: 'Every 6 hours',
      features: ['Roster Sync', 'Grade Sync', 'Content Integration']
    },
    {
      id: 'lms-003',
      name: 'Schoology',
      provider: 'PowerSchool',
      icon: '/icons/schoology.svg',
      connected: false,
      status: 'disconnected',
      lastSync: 'Never',
      coursesCount: 0,
      studentsCount: 0,
      syncFrequency: 'N/A',
      features: ['Roster Sync', 'Grade Sync', 'Analytics']
    }
  ];
}
