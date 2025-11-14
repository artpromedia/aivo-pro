/**
 * Streaming AI Response Component
 * Displays AI-generated content with real-time streaming
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import { aiBrainService, StudentContext } from '@aivo/ui';

interface StreamingResponseProps {
  prompt: string;
  studentContext: StudentContext;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const StreamingResponse: React.FC<StreamingResponseProps> = ({
  prompt,
  studentContext,
  onComplete,
  onError,
  className = '',
}) => {
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const streamResponse = async () => {
      try {
        setIsStreaming(true);
        setError(null);
        setStreamedText('');

        let fullText = '';
        for await (const chunk of aiBrainService.streamResponse({
          prompt,
          context: studentContext,
          stream: true,
          temperature: 0.7,
        })) {
          if (!mounted) break;
          
          fullText += chunk;
          setStreamedText(fullText);
        }

        if (mounted) {
          setIsStreaming(false);
          onComplete?.(fullText);
        }
      } catch (err) {
        if (!mounted) return;
        
        const error = err instanceof Error ? err : new Error('Streaming failed');
        setError(error);
        setIsStreaming(false);
        onError?.(error);
      }
    };

    streamResponse();

    return () => {
      mounted = false;
    };
  }, [prompt, studentContext, onComplete, onError]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Unable to generate response</p>
            <p className="text-sm text-red-600 mt-1">{error.message}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {isStreaming ? (
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          ) : (
            <Brain className="w-6 h-6 text-purple-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {streamedText}
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1 h-4 ml-1 bg-purple-500"
                />
              )}
            </p>
          </div>
          
          {!isStreaming && streamedText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center space-x-2 text-xs text-gray-500"
            >
              <Brain className="w-3 h-3" />
              <span>AI-generated • Personalized for you</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Hook for managing streaming responses
 */
export const useStreamingResponse = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const startStream = async (
    prompt: string,
    studentContext: StudentContext,
    onChunk?: (chunk: string) => void
  ): Promise<string> => {
    setIsStreaming(true);
    setError(null);
    setStreamedText('');

    try {
      let fullText = '';
      for await (const chunk of aiBrainService.streamResponse({
        prompt,
        context: studentContext,
        stream: true,
        temperature: 0.7,
      })) {
        fullText += chunk;
        setStreamedText(fullText);
        onChunk?.(chunk);
      }

      setIsStreaming(false);
      return fullText;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Streaming failed');
      setError(error);
      setIsStreaming(false);
      throw error;
    }
  };

  const reset = () => {
    setIsStreaming(false);
    setStreamedText('');
    setError(null);
  };

  return {
    isStreaming,
    streamedText,
    error,
    startStream,
    reset,
  };
};
