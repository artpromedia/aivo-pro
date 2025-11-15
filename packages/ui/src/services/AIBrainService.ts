/**
 * AIVO Brain API Service
 * 
 * Connects frontend to ACTUAL AI backend - not mocks!
 */
import axios, { AxiosInstance } from 'axios';

const AI_BRAIN_URL = import.meta.env.VITE_AI_BRAIN_URL || 'http://localhost:8001';
const CLONING_URL = import.meta.env.VITE_CLONING_URL || 'http://localhost:8014';

export interface StudentContext {
  student_id: string;
  grade: string;
  subject: string;
  learning_style?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  skill_level?: 'below_grade' | 'grade_level' | 'above_grade';
  disability?: string;
  accommodations?: string[];
  curriculum_standard?: string;
}

export interface GenerateRequest {
  prompt: string;
  context: StudentContext;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

export interface GenerateResponse {
  response: string;
  model: string;
  tokens_used: number;
  context_applied: Record<string, unknown>;
  timestamp: string;
}

export interface AssessmentCriteria {
  subject: string;
  grade: string;
  learning_objective: string;
  rubric?: Record<string, unknown>;
}

export interface AssessResponse {
  correctness: number;
  understanding_level: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  next_steps: string;
}

export interface CloneRequest {
  student_id: string;
  student_profile: Record<string, unknown>;
  baseline_data: Record<string, unknown>;
}

export interface CloneResponse {
  clone_id: string;
  student_id: string;
  status: string;
  estimated_time_seconds: number;
}

export interface CloneStatus {
  clone_id: string;
  status: string;
  progress: number;
  message: string;
  timestamp: string;
}

/**
 * Service for interacting with ACTUAL AIVO Brain AI
 */
export class AIBrainService {
  private brainClient: AxiosInstance;
  private cloningClient: AxiosInstance;

  constructor() {
    this.brainClient = axios.create({
      baseURL: AI_BRAIN_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.cloningClient = axios.create({
      baseURL: CLONING_URL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate AI response - ACTUAL AI, not hard-coded!
   */
  async generateResponse(request: GenerateRequest): Promise<GenerateResponse> {
    const response = await this.brainClient.post<GenerateResponse>(
      '/v1/generate',
      request
    );
    return response.data;
  }

  /**
   * Stream AI response in real-time
   */
  async *streamResponse(request: GenerateRequest): AsyncGenerator<string> {
    const response = await fetch(`${AI_BRAIN_URL}/v1/generate/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          if (data.trim()) {
            yield data;
          }
        }
      }
    }
  }

  /**
   * Assess student response using AI
   */
  async assessResponse(
    studentResponse: string,
    criteria: AssessmentCriteria,
    expectedAnswer?: string
  ): Promise<AssessResponse> {
    const response = await this.brainClient.post<AssessResponse>('/v1/assess', {
      student_response: studentResponse,
      criteria,
      expected_answer: expectedAnswer,
    });
    return response.data;
  }

  /**
   * Start ACTUAL model cloning for a student
   */
  async startCloning(request: CloneRequest): Promise<CloneResponse> {
    const response = await this.cloningClient.post<CloneResponse>(
      '/v1/clone/start',
      request
    );
    return response.data;
  }

  /**
   * Get cloning progress
   */
  async getCloneStatus(cloneId: string): Promise<CloneStatus> {
    const response = await this.cloningClient.get<CloneStatus>(
      `/v1/clone/${cloneId}/status`
    );
    return response.data;
  }

  /**
   * Poll cloning status until complete
   */
  async waitForCloning(
    cloneId: string,
    onProgress?: (status: CloneStatus) => void
  ): Promise<CloneStatus> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const status = await this.getCloneStatus(cloneId);
          
          if (onProgress) {
            onProgress(status);
          }

          if (status.progress === 100 || status.status === 'complete') {
            clearInterval(interval);
            resolve(status);
          } else if (status.status.startsWith('error')) {
            clearInterval(interval);
            reject(new Error(status.message));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 1000);
    });
  }

  /**
   * Check if services are available
   */
  async healthCheck(): Promise<{ brain: boolean; cloning: boolean }> {
    try {
      const [brainHealth, cloningHealth] = await Promise.all([
        this.brainClient.get('/health'),
        this.cloningClient.get('/health'),
      ]);

      return {
        brain: brainHealth.status === 200,
        cloning: cloningHealth.status === 200,
      };
    } catch (error) {
      console.error('AIBrainService health check failed', error);
      return {
        brain: false,
        cloning: false,
      };
    }
  }
}

// Singleton instance
export const aiBrainService = new AIBrainService();
