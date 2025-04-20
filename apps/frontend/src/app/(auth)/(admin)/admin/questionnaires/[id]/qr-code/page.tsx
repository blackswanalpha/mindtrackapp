'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Loading,
  Alert
} from '@/components/common';
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  QrCode,
  Settings,
  Check,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';

const QRCodePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrSize, setQrSize] = useState(300);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const response = await api.questionnaires.getById(Number(id));

        // Mock data for demonstration
        const mockQuestionnaire = {
          id: Number(id),
          title: 'Depression Assessment (PHQ-9)',
          description: 'A standardized questionnaire for screening and measuring the severity of depression.',
          is_active: true,
          is_public: true,
          created_at: '2023-01-15T10:30:00Z',
          updated_at: '2023-06-20T14:45:00Z',
          organization: {
            id: 1,
            name: 'Mental Health Clinic'
          }
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setQuestionnaire(mockQuestionnaire);
      } catch (err) {
        setError('Failed to load questionnaire');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuestionnaire();
    }
  }, [id]);

  const getQRCodeUrl = () => {
    // In a real implementation, this would be a URL to the questionnaire
    return `${window.location.origin}/q/${id}`;
  };

  const handleCopyLink = () => {
    const url = getQRCodeUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;

    // In a real implementation, this would download the QR code as an image
    // For now, we'll just show an alert
    alert('QR code downloaded successfully');
  };

  const handlePrintQR = () => {
    if (!qrRef.current) return;

    // In a real implementation, this would print the QR code
    // For now, we'll just show an alert
    alert('QR code sent to printer');
  };

  const handleShare = () => {
    const url = getQRCodeUrl();

    if (navigator.share) {
      navigator.share({
        title: questionnaire?.title || 'Questionnaire',
        text: 'Please complete this questionnaire',
        url
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading questionnaire..." />
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load questionnaire'} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.push('/questionnaires')}>
            Back to Questionnaires
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/questionnaires/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QR Code</h1>
          <p className="text-gray-600">
            {questionnaire.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-center">Scan this QR code to access the questionnaire</h2>
                <p className="text-gray-600 text-center mt-2">
                  Share this QR code with patients or clients to allow them to complete the questionnaire.
                </p>
              </div>

              <div
                ref={qrRef}
                className="bg-white p-4 rounded-lg shadow-md mb-6"
                style={{ width: qrSize + 32, height: qrSize + 32 }}
              >
                {/* This would be a real QR code component in a real implementation */}
                <div
                  className="bg-gray-100 flex items-center justify-center"
                  style={{ width: qrSize, height: qrSize }}
                >
                  <QrCode className="h-32 w-32 text-gray-800" />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button
                  variant="light"
                  onClick={handleDownloadQR}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="light"
                  onClick={handlePrintQR}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="light"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="light"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>

              {showSettings && (
                <div className="w-full max-w-md mb-6">
                  <h3 className="text-lg font-medium mb-3">QR Code Settings</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="qr-size" className="block text-sm font-medium text-gray-700 mb-1">
                        Size: {qrSize}px
                      </label>
                      <input
                        id="qr-size"
                        type="range"
                        min="100"
                        max="500"
                        step="10"
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full max-w-md">
                <h3 className="text-lg font-medium mb-3">Direct Link</h3>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={getQRCodeUrl()}
                    readOnly
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-600 text-sm mt-1">Link copied to clipboard!</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Questionnaire Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                <p className="mt-1 text-gray-800">{questionnaire.title}</p>
              </div>

              {questionnaire.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-gray-800">{questionnaire.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1 flex items-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    questionnaire.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {questionnaire.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Visibility</h3>
                <div className="mt-1 flex items-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    questionnaire.is_public ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {questionnaire.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Organization</h3>
                <p className="mt-1 text-gray-800">{questionnaire.organization.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-gray-800">
                  {new Date(questionnaire.updated_at || questionnaire.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="light"
                className="w-full"
                onClick={() => router.push(`/questionnaires/${id}/edit`)}
              >
                Edit Questionnaire
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
