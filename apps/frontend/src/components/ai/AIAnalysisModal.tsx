'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/common';
import AIAnalysisSection from './AIAnalysisSection';
import api from '@/services/api';

type AIAnalysisModalProps = {
  responseId: number;
  isOpen: boolean;
  onClose: () => void;
};

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  responseId,
  isOpen,
  onClose
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && responseId) {
      fetchAnalysis();
    }
  }, [isOpen, responseId]);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const analysisData = await api.aiAnalysis.getByResponse(responseId);
      setAnalysis(analysisData);
    } catch (err) {
      console.log('No existing analysis found, may need to generate one');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalysis = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const analysisData = await api.aiAnalysis.generate(responseId);
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Failed to generate analysis:', err);
      setError('Failed to generate AI analysis. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const refreshAnalysis = async () => {
    await generateAnalysis();
  };

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={handleModalClick}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">AI Analysis</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 relative mb-4">
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-blue-100"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                  </div>
                  <p className="text-gray-600">Loading analysis...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <p className="text-red-700">{error}</p>
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={generateAnalysis}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Try Again'}
                  </Button>
                </div>
              ) : analysis ? (
                <AIAnalysisSection analysis={analysis} onRefresh={refreshAnalysis} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Brain className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Analysis Available</h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    Generate an AI analysis to get insights, risk assessment, and recommendations based on this response.
                  </p>
                  <Button
                    variant="primary"
                    onClick={generateAnalysis}
                    disabled={isGenerating}
                    className="flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Analysis...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAnalysisModal;
