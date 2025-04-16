'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, Card, Loading } from '@/components/common';
import { handleApiError } from '@/utils/errorHandler';
import { generateQuestionnaireQrDataUrl } from '@/utils/qrCode';
// import { useToast } from '@/hooks/useToast';
import { downloadQuestionnaireQr } from '@/utils/qrCode';
import { apiClient } from '@/lib/apiClient';

type QRCodeGeneratorProps = {
  questionnaireId: number;
  title: string;
  className?: string;
};

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  questionnaireId,
  title,
  className = ''
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  // const { showToast } = useToast();

  // Generate QR code on mount
  useEffect(() => {
    generateQRCode();
  }, [questionnaireId]);

  // Generate QR code
  const generateQRCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Try to get QR code from API first
      const response = await apiClient.get(`/qr-codes/questionnaires/${questionnaireId}`);
      setQrCodeUrl(response.data.qrCode);
    } catch (apiError) {
      // Fall back to client-side generation if API fails
      try {
        const dataUrl = await generateQuestionnaireQrDataUrl(questionnaireId);
        setQrCodeUrl(dataUrl);
      } catch (clientError) {
        const errorMessage = handleApiError(clientError, 'Failed to generate QR code');
        setError(errorMessage);
        // showToast('error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Download QR code
  const handleDownload = async () => {
    try {
      // Try API download first
      try {
        const response = await apiClient.get(`/qr-codes/questionnaires/${questionnaireId}/download`, {
          responseType: 'blob'
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (apiError) {
        // Fall back to client-side download
        await downloadQuestionnaireQr(questionnaireId, title);
      }

      // showToast('success', 'QR code downloaded successfully');
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to download QR code');
      // showToast('error', errorMessage);
    }
  };

  // Refresh QR code
  const handleRefresh = () => {
    generateQRCode();
  };

  return (
    <Card
      title="QR Code"
      className={`${className}`}
      headerAction={
        <Button
          variant="light"
          size="small"
          onClick={handleRefresh}
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
        >
          Refresh
        </Button>
      }
    >
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
                alt={`QR code for ${title}`}
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Scan this QR code to access the questionnaire
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
            No QR code available. Click refresh to generate.
          </div>
        )}
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
