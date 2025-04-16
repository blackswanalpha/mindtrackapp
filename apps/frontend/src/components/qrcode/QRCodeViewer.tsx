'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, Loading } from '@/components/common';
import { handleApiError } from '@/utils/errorHandler';
import { apiClient } from '@/lib/apiClient';

type QRCodeViewerProps = {
  uniqueCode: string;
  className?: string;
};

const QRCodeViewer: React.FC<QRCodeViewerProps> = ({
  uniqueCode,
  className = ''
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Generate QR code on mount
  useEffect(() => {
    generateQRCode();
  }, [uniqueCode]);
  
  // Generate QR code
  const generateQRCode = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiClient.get(`/qr-codes/responses/${uniqueCode}`);
      setQrCodeUrl(response.data.qrCode);
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to generate QR code');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Download QR code
  const handleDownload = async () => {
    try {
      const response = await apiClient.get(`/qr-codes/responses/${uniqueCode}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `response-${uniqueCode}-qr.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to download QR code');
      setError(errorMessage);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Response QR Code</h3>
      
      <div className="flex flex-col items-center">
        {isLoading ? (
          <Loading size="medium" message="Generating QR code..." />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : qrCodeUrl ? (
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src={qrCodeUrl}
                alt={`QR code for response ${uniqueCode}`}
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Scan this QR code to view your response
            </p>
            <p className="text-sm font-medium text-gray-700 mt-1 text-center">
              Unique Code: {uniqueCode}
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={handleDownload}
              icon={
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              }
            >
              Download QR Code
            </Button>
          </div>
        ) : (
          <div className="text-gray-500 text-center p-4">
            No QR code available.
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeViewer;
