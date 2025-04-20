'use client';

import React, { useState } from 'react';
import { Card, Button, Alert } from '@/components/common';
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type AIAnalysisSectionProps = {
  analysis: any;
  onRefresh?: () => Promise<void>;
};

const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({
  analysis,
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    risk_assessment: true,
    recommendations: true,
    key_concerns: true,
    potential_triggers: true
  });

  // Handle refresh analysis
  const handleRefresh = async () => {
    if (!onRefresh) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Failed to refresh analysis:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Download analysis as text
  const downloadAnalysis = () => {
    const analysisText = `
AI ANALYSIS REPORT
Generated: ${formatDate(analysis.created_at)}
Model: ${analysis.model}

SUMMARY
${analysis.analysis.summary}

RISK ASSESSMENT
${analysis.analysis.risk_assessment}

RECOMMENDATIONS
${analysis.analysis.recommendations.map((rec: string) => `- ${rec}`).join('\n')}

KEY CONCERNS
${analysis.analysis.key_concerns.map((concern: string) => `- ${concern}`).join('\n')}

POTENTIAL TRIGGERS
${analysis.analysis.potential_triggers}
    `.trim();

    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share analysis
  const shareAnalysis = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Analysis Report',
        text: `AI Analysis Report - Generated on ${formatDate(analysis.created_at)}`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Copy this link to share the analysis: ' + window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">AI Analysis</h2>
          </div>
          <div className="text-sm text-gray-500">
            Generated: {formatDate(analysis.created_at)}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Model: {analysis.model}
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('summary')}
          >
            <h3 className="font-medium text-gray-800">Summary</h3>
            {expandedSections.summary ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSections.summary && (
            <div className="p-4 bg-white">
              <p className="text-gray-700">{analysis.analysis.summary}</p>
            </div>
          )}
        </div>

        {/* Risk Assessment Section */}
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('risk_assessment')}
          >
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-gray-800">Risk Assessment</h3>
            </div>
            {expandedSections.risk_assessment ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSections.risk_assessment && (
            <div className="p-4 bg-white">
              <p className="text-gray-700">{analysis.analysis.risk_assessment}</p>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('recommendations')}
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-medium text-gray-800">Recommendations</h3>
            </div>
            {expandedSections.recommendations ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSections.recommendations && (
            <div className="p-4 bg-white">
              <ul className="list-disc pl-5 space-y-2">
                {analysis.analysis.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="text-gray-700">{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Key Concerns Section */}
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('key_concerns')}
          >
            <h3 className="font-medium text-gray-800">Key Concerns</h3>
            {expandedSections.key_concerns ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSections.key_concerns && (
            <div className="p-4 bg-white">
              <ul className="list-disc pl-5 space-y-2">
                {analysis.analysis.key_concerns.map((concern: string, index: number) => (
                  <li key={index} className="text-gray-700">{concern}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Potential Triggers Section */}
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection('potential_triggers')}
          >
            <h3 className="font-medium text-gray-800">Potential Triggers</h3>
            {expandedSections.potential_triggers ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSections.potential_triggers && (
            <div className="p-4 bg-white">
              <p className="text-gray-700">{analysis.analysis.potential_triggers}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {onRefresh && (
            <Button
              variant="light"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}
            </Button>
          )}

          <Button
            variant="light"
            onClick={downloadAnalysis}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>

          <Button
            variant="light"
            onClick={shareAnalysis}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
        </div>
      </Card>

      <Alert type="info" message="This analysis is generated by AI and should be reviewed by a healthcare professional before making clinical decisions." />
    </div>
  );
};

export default AIAnalysisSection;
