'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { generateQuestionnaireQrUrl } from '@/utils/qrCode';
import Image from 'next/image';

interface SimpleQRCodeProps {
  data: string;
  size?: number;
  className?: string;
}

const SimpleQRCode: React.FC<SimpleQRCodeProps> = ({
  data,
  size = 200,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    // Use the QR code API to generate the QR code
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
    setQrUrl(url);
    setIsLoading(false);
  }, [data, size]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <Image
        src={qrUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="mx-auto"
      />
    </div>
  );
};

export default SimpleQRCode;
