/**
 * API Endpoints - Type-safe endpoint definitions
 */

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    signup: '/v1/auth/signup',
    login: '/v1/auth/login',
    logout: '/v1/auth/logout',
    refresh: '/v1/auth/refresh',
    verifyEmail: '/v1/auth/verify-email',
    resetPassword: '/v1/auth/reset-password',
    mfaSetup: '/v1/auth/mfa/setup',
    mfaVerify: '/v1/auth/mfa/verify',
  },

  // Children/Students
  children: {
    list: '/v1/children',
    create: '/v1/children',
    get: (id: string) => `/v1/children/${id}`,
    update: (id: string) => `/v1/children/${id}`,
    delete: (id: string) => `/v1/children/${id}`,
    settings: (id: string) => `/v1/children/${id}/settings`,
  },

  // Baseline Assessment
  baseline: {
    start: '/v1/baseline/start',
    submit: '/v1/baseline/submit',
    results: (sessionId: string) => `/v1/baseline/results/${sessionId}`,
  },

  // Learning Sessions
  learning: {
    startSession: '/v1/learning/session/start',
    submitAnswer: (sessionId: string) => `/v1/learning/session/${sessionId}/submit`,
    endSession: (sessionId: string) => `/v1/learning/session/${sessionId}/end`,
    getProgress: (childId: string) => `/v1/learning/progress/${childId}`,
  },

  // Homework Helper
  homework: {
    upload: '/v1/homework/upload',
    chat: '/v1/homework/chat',
    getSession: (sessionId: string) => `/v1/homework/session/${sessionId}`,
  },

  // IEP Management
  iep: {
    list: '/v1/ieps',
    create: '/v1/ieps',
    get: (id: string) => `/v1/ieps/${id}`,
    update: (id: string) => `/v1/ieps/${id}`,
    generateGoals: '/v1/ieps/generate-goals',
    trackProgress: (id: string) => `/v1/ieps/${id}/progress`,
  },

  // Curriculum Content
  curriculum: {
    getContent: '/v1/curriculum/content',
    getSubjects: '/v1/curriculum/subjects',
    getTopics: (subject: string) => `/v1/curriculum/${subject}/topics`,
    generateContent: '/v1/curriculum/generate',
  },

  // Speech Therapy
  speech: {
    assessment: '/v1/speech/assessment',
    activity: '/v1/speech/activity',
    progress: (childId: string) => `/v1/speech/progress/${childId}`,
  },

  // SEL (Social-Emotional Learning)
  sel: {
    program: '/v1/sel/program',
    checkIn: '/v1/sel/check-in',
    activity: '/v1/sel/activity',
    mindfulness: '/v1/sel/mindfulness',
  },

  // Analytics
  analytics: {
    overview: '/v1/analytics/overview',
    childProgress: (childId: string) => `/v1/analytics/child/${childId}`,
    classProgress: (classId: string) => `/v1/analytics/class/${classId}`,
    districtReport: '/v1/analytics/district',
  },

  // Notifications
  notifications: {
    list: '/v1/notifications',
    markRead: (id: string) => `/v1/notifications/${id}/read`,
    preferences: '/v1/notifications/preferences',
  },

  // Model Cloning
  modelCloning: {
    initiate: '/v1/model-cloning/initiate',
    status: (jobId: string) => `/v1/model-cloning/status/${jobId}`,
    download: (modelId: string) => `/v1/model-cloning/download/${modelId}`,
  },

  // Translation
  translation: {
    translate: '/v1/translate/content',
    batch: '/v1/translate/batch',
    detect: '/v1/translate/detect',
    languages: '/v1/translate/languages',
  },

  // Billing (Business Model)
  billing: {
    subscriptions: '/v1/billing/subscriptions',
    invoices: '/v1/billing/invoices',
    paymentMethods: '/v1/billing/payment-methods',
    createSubscription: '/v1/billing/subscriptions',
    updateSubscription: (id: string) => `/v1/billing/subscriptions/${id}`,
  },

  // District Management
  district: {
    schools: '/v1/district/schools',
    teachers: '/v1/district/teachers',
    students: '/v1/district/students',
    licenses: '/v1/district/licenses',
    integrations: '/v1/district/integrations',
  },

  // AI Brain
  aivo: {
    chat: '/v1/aivo/chat',
    suggest: '/v1/aivo/suggest',
    analyze: '/v1/aivo/analyze',
  },
} as const;

// Type helper to ensure endpoint strings
export type APIEndpoint = string | ((param: string) => string);
