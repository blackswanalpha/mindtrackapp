'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeScanner } from '@/components/qrcode';
import { Card, Button } from '@/components/common';
import { ArrowLeft } from 'lucide-react';

const ScanPage = () => {
  const router = useRouter();
  
  // Handle scan result
  const handleScan = (result: string) => {
    try {
      const url = new URL(result);
      
      // Check if URL is for questionnaire or response
      if (url.pathname.includes('/questionnaires/respond/')) {
        const questionnaireId = url.pathname.split('/').pop();
        if (questionnaireId) {
          router.push(`/questionnaires/respond/${questionnaireId}`);
        }
      } else if (url.pathname.includes('/responses/view/')) {
        const uniqueCode = url.pathname.split('/').pop();
        if (uniqueCode) {
          router.push(`/responses/view/${uniqueCode}`);
        }
      } else {
        // Handle other URLs
        console.log('Scanned URL not recognized:', result);
      }
    } catch (error) {
      // Handle non-URL QR codes
      console.log('Invalid URL in QR code:', result);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="light"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold text-center">Scan QR Code</h1>
        <p className="text-gray-600 text-center mt-2">
          Scan a MindTrack QR code to access a questionnaire or view a response
        </p>
      </div>
      
      <QRCodeScanner onScan={handleScan} />
      
      <Card className="mt-6">
        <h3 className="text-lg font-semibold mb-2">How to use</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click "Start Scanning" to activate your camera</li>
          <li>Position the QR code within the frame</li>
          <li>The app will automatically detect and process the QR code</li>
          <li>You'll be redirected to the questionnaire or response page</li>
        </ol>
      </Card>
    </div>
  );
};

export default ScanPage;
