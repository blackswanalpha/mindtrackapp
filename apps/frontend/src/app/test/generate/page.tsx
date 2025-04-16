'use client';

import React, { useState, useEffect } from 'react';
import TestLayout from '@/components/test/TestLayout';
import { Card, Button, Loading, Alert } from '@/components/common';
import QRCode from 'qrcode.react';
import { Download, Copy, RefreshCw } from 'lucide-react';

const TestGenerateQRPage = () => {
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useState<string>('');

  // Fetch questionnaires on mount
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would fetch from the testquestionnaire table
        // For now, we'll use mock data based on the Google Forms
        const mockQuestionnaires = [
          {
            id: '1',
            title: 'Mental Health Assessment',
            description: 'A comprehensive mental health assessment form',
            source_url: 'https://forms.gle/E8bdVzAEbMaQsHR56'
          },
          {
            id: '2',
            title: 'Anxiety and Depression Screening',
            description: 'Screening tool for anxiety and depression symptoms',
            source_url: 'https://forms.gle/NLqA1svRhX5Pez1K6'
          }
        ];
        
        setQuestionnaires(mockQuestionnaires);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load questionnaires');
        setIsLoading(false);
      }
    };

    // Set base URL for QR codes
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      setBaseUrl(`${url.protocol}//${url.host}`);
    }

    fetchQuestionnaires();
  }, []);

  // Generate QR code when a questionnaire is selected
  const handleSelectQuestionnaire = (id: string) => {
    setSelectedQuestionnaire(id);
    setQrValue(`${baseUrl}/test/questionnaires/${id}`);
  };

  // Download QR code as PNG
  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-questionnaire-${selectedQuestionnaire}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // Copy QR code link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate a new unique code
  const handleGenerateNewCode = () => {
    if (selectedQuestionnaire) {
      const uniqueId = Math.random().toString(36).substring(2, 10);
      setQrValue(`${baseUrl}/test/questionnaires/${selectedQuestionnaire}?code=${uniqueId}`);
    }
  };

  return (
    <TestLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Generate QR Code</h1>
        
        {error && <Alert type="error" message={error} className="mb-6" />}
        
        {isLoading ? (
          <Loading size="large" message="Loading questionnaires..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Questionnaire</h2>
              <div className="space-y-4">
                {questionnaires.map((questionnaire) => (
                  <div 
                    key={questionnaire.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedQuestionnaire === questionnaire.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleSelectQuestionnaire(questionnaire.id)}
                  >
                    <h3 className="font-medium">{questionnaire.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{questionnaire.description}</p>
                  </div>
                ))}
              </div>
            </Card>
            
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">QR Code</h2>
                
                {qrValue ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                      <QRCode 
                        id="qr-code"
                        value={qrValue} 
                        size={200}
                        level="H"
                        includeMargin
                      />
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4 text-center">
                      <p>Scan this code or share the link:</p>
                      <p className="font-mono text-xs mt-1 bg-gray-100 p-2 rounded">{qrValue}</p>
                    </div>
                    
                    <div className="flex space-x-2 w-full">
                      <Button 
                        variant="primary" 
                        onClick={handleDownloadQR}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      
                      <Button 
                        variant="secondary" 
                        onClick={handleCopyLink}
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? 'Copied!' : 'Copy Link'}
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleGenerateNewCode}
                      className="mt-4 w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Unique Code
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p>Select a questionnaire to generate a QR code</p>
                  </div>
                )}
              </Card>
              
              {qrValue && (
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">How to use:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Download the QR code or copy the link</li>
                    <li>Share with participants to complete the questionnaire</li>
                    <li>Responses will be stored in the test database</li>
                    <li>Generate a unique code for each distribution if needed</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TestLayout>
  );
};

export default TestGenerateQRPage;
