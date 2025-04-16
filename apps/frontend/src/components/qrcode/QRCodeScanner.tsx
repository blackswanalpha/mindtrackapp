'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Loading } from '@/components/common';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

type QRCodeScannerProps = {
  onScan?: (result: string) => void;
  className?: string;
};

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  className = ''
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const router = useRouter();
  const { showToast } = useToast();

  // Start scanning when component mounts
  useEffect(() => {
    if (isScanning) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScanning]);

  // Start QR code scanner
  const startScanner = async () => {
    try {
      // Dynamically import the QR scanner library
      const { Html5QrcodeScanner } = await import('html5-qrcode');

      // Create scanner instance
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: 250,
          aspectRatio: 1.0,
          formatsToSupport: [0] // 0 corresponds to QR_CODE in Html5QrcodeSupportedFormats
        },
        false
      );

      // Start scanning
      scanner.render(onScanSuccess, onScanFailure);

      // Store scanner instance in window for cleanup
      window.qrScanner = scanner;
    } catch (error) {
      console.error('Error starting QR scanner:', error);
      setError('Failed to start QR scanner. Please make sure your camera is enabled.');
      setHasCamera(false);
      setIsScanning(false);
    }
  };

  // Stop QR code scanner
  const stopScanner = () => {
    if (window.qrScanner) {
      try {
        window.qrScanner.clear();
      } catch (error) {
        console.error('Error stopping QR scanner:', error);
      }
    }
  };

  // Handle successful scan
  const onScanSuccess = (decodedText: string) => {
    // Stop scanner
    stopScanner();
    setIsScanning(false);

    // Check if URL is valid
    try {
      const url = new URL(decodedText);

      // Extract path from URL
      const path = url.pathname;

      // Check if path is for questionnaire or response
      if (path.includes('/questionnaires/respond/')) {
        const questionnaireId = path.split('/').pop();
        if (questionnaireId) {
          if (onScan) {
            onScan(decodedText);
          } else {
            router.push(`/questionnaires/respond/${questionnaireId}`);
          }
        }
      } else if (path.includes('/responses/view/')) {
        const uniqueCode = path.split('/').pop();
        if (uniqueCode) {
          if (onScan) {
            onScan(decodedText);
          } else {
            router.push(`/responses/view/${uniqueCode}`);
          }
        }
      } else {
        // Handle other URLs
        if (onScan) {
          onScan(decodedText);
        } else {
          showToast('info', 'QR code scanned, but not recognized as a MindTrack QR code.');
        }
      }
    } catch (error) {
      // Handle non-URL QR codes
      if (onScan) {
        onScan(decodedText);
      } else {
        showToast('info', 'QR code scanned, but not recognized as a valid URL.');
      }
    }
  };

  // Handle scan failure
  const onScanFailure = (error: any) => {
    // Don't show errors for normal scanning failures
    if (error && error.toString().includes('No QR code found')) {
      return;
    }

    console.error('QR scan error:', error);
  };

  // Toggle scanner
  const toggleScanner = () => {
    if (isScanning) {
      stopScanner();
    }
    setIsScanning(!isScanning);
    setError('');
  };

  return (
    <Card
      title="QR Code Scanner"
      className={`${className}`}
    >
      <div className="flex flex-col items-center">
        {!hasCamera ? (
          <div className="text-red-500 text-center p-4">
            Camera access is required to scan QR codes. Please enable camera access and refresh the page.
          </div>
        ) : (
          <>
            {isScanning ? (
              <div className="w-full">
                <div id="qr-reader" className="w-full"></div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Position the QR code within the frame to scan
                </p>
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-600 mb-4">
                  Click the button below to scan a QR code with your camera
                </p>
              </div>
            )}

            {error && <div className="text-red-500 text-center p-2">{error}</div>}

            <Button
              variant={isScanning ? 'danger' : 'primary'}
              className="mt-4"
              onClick={toggleScanner}
              icon={
                isScanning ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )
              }
            >
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

// Add global type for QR scanner
declare global {
  interface Window {
    qrScanner: any;
  }
}

export default QRCodeScanner;
