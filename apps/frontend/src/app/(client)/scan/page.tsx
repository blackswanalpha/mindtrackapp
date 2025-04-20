'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert } from '@/components/common';
import QRCodeScanner from '@/components/qrcode/QRCodeScanner';
import { ScanLine, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ClientScanPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = (data: string) => {
    try {
      // Check if the scanned data is a valid URL
      const url = new URL(data);

      // Check if it's a MindTrack questionnaire URL
      if (url.pathname.includes('/questionnaires/')) {
        // Extract the questionnaire ID from the URL
        const pathParts = url.pathname.split('/');
        const questionnaireId = pathParts[pathParts.indexOf('questionnaires') + 1];

        if (questionnaireId) {
          // Redirect to the questionnaire page
          router.push(`/questionnaires/${questionnaireId}`);
          return;
        }
      }

      // If we get here, it's not a valid MindTrack QR code
      setError('QR code scanned, but not recognized as a MindTrack questionnaire.');
    } catch (err) {
      setError('QR code scanned, but not recognized as a valid URL.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <ScanLine className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Scan QR Code</h1>
          <p className="text-gray-600 mt-2">
            Position the QR code within the scanner to access your questionnaire
          </p>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <div className="mb-6">
          {scanning ? (
            <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-lg">
              <QRCodeScanner onScan={handleScan} />
            </div>
          ) : (
            <div className="text-center">
              <Button
                variant="primary"
                onClick={() => setScanning(true)}
                className="mx-auto"
              >
                Start Scanning
              </Button>
            </div>
          )}
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>Having trouble scanning?</p>
          <p className="mt-1">Make sure the QR code is well-lit and your camera is focused.</p>
        </div>
      </Card>
    </div>
  );
};

export default ClientScanPage;
