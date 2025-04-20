'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Palette,
  Link as LinkIcon,
  Share2,
  Scissors,
  ExternalLink,
  ClipboardCopy,
  Facebook,
  Twitter,
  Mail,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { Button, Card } from '@/components/common';
import { QRCodeSVG } from 'qrcode.react';

interface EnhancedQRCodeProps {
  value: string;
  size?: number;
  className?: string;
  title?: string;
  shortUrl?: string;
}

// QR code style options
const QR_STYLES = [
  {
    name: 'Classic',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    cornerColor: '#000000',
    cornerRadius: 0
  },
  {
    name: 'Blue',
    fgColor: '#1E40AF',
    bgColor: '#EFF6FF',
    cornerColor: '#1E40AF',
    cornerRadius: 8
  },
  {
    name: 'Green',
    fgColor: '#047857',
    bgColor: '#ECFDF5',
    cornerColor: '#047857',
    cornerRadius: 8
  },
  {
    name: 'Purple',
    fgColor: '#7E22CE',
    bgColor: '#F5F3FF',
    cornerColor: '#7E22CE',
    cornerRadius: 8
  },
  {
    name: 'Orange',
    fgColor: '#C2410C',
    bgColor: '#FFF7ED',
    cornerColor: '#C2410C',
    cornerRadius: 8
  },
  {
    name: 'Dark',
    fgColor: '#FFFFFF',
    bgColor: '#1F2937',
    cornerColor: '#FFFFFF',
    cornerRadius: 0
  },
  {
    name: 'Gradient',
    fgColor: '#4F46E5',
    bgColor: '#FFFFFF',
    cornerColor: '#7C3AED',
    cornerRadius: 12
  },
  {
    name: 'Rounded',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    cornerColor: '#000000',
    cornerRadius: 16
  }
];

const EnhancedQRCode: React.FC<EnhancedQRCodeProps> = ({
  value,
  size = 200,
  className = '',
  title = 'QR Code',
  shortUrl
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(QR_STYLES[0]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [displayUrl, setDisplayUrl] = useState(value);
  const [isShortened, setIsShortened] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize displayUrl with shortUrl if available
  useEffect(() => {
    if (shortUrl) {
      setDisplayUrl(shortUrl);
      setIsShortened(true);
    } else {
      setDisplayUrl(value);
      setIsShortened(false);
    }
  }, [value, shortUrl]);

  // Handle click outside to close share options
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show tooltip with message
  const showTooltip = (message: string) => {
    setTooltipMessage(message);
    setTooltipVisible(true);

    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    // Hide tooltip after 2 seconds
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipVisible(false);
    }, 2000);
  };

  // Generate a random style
  const generateRandomStyle = () => {
    setIsLoading(true);

    // Get a random style different from the current one
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * QR_STYLES.length);
    } while (QR_STYLES[randomIndex].name === currentStyle.name);

    // Set the new style after a brief delay for visual feedback
    setTimeout(() => {
      setCurrentStyle(QR_STYLES[randomIndex]);
      setIsLoading(false);
    }, 500);
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    // Use the displayed URL (which might be shortened)
    navigator.clipboard.writeText(displayUrl);
    setIsCopied(true);
    showTooltip('Link copied to clipboard!');

    // Highlight the input field
    if (linkInputRef.current) {
      linkInputRef.current.select();
    }

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Toggle between original and shortened URL
  const toggleUrlShortening = async () => {
    if (isShortened) {
      // Switch back to original URL
      setDisplayUrl(value);
      setIsShortened(false);
      showTooltip('Using original URL');
    } else {
      // Try to use provided shortUrl or generate one
      if (shortUrl) {
        setDisplayUrl(shortUrl);
        setIsShortened(true);
        showTooltip('Using shortened URL');
      } else {
        // Simulate URL shortening (in a real app, you would call an API)
        setIsLoading(true);
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Create a mock shortened URL
          const domain = 'qr.link/';
          const randomChars = Math.random().toString(36).substring(2, 8);
          const mockShortUrl = `https://${domain}${randomChars}`;

          setDisplayUrl(mockShortUrl);
          setIsShortened(true);
          showTooltip('URL shortened successfully!');
        } catch (error) {
          showTooltip('Failed to shorten URL');
          console.error('Error shortening URL:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // Share the QR code link
  const shareLink = (method: 'copy' | 'facebook' | 'twitter' | 'email' | 'sms') => {
    switch (method) {
      case 'copy':
        copyToClipboard();
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(displayUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(displayUrl)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?body=${encodeURIComponent(displayUrl)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(displayUrl)}`, '_blank');
        break;
    }

    // Hide share options after selection
    setShowShareOptions(false);
  };

  // Download QR code as SVG
  const downloadAsSVG = () => {
    if (!qrCodeRef.current) return;

    // Get SVG element
    const svgElement = qrCodeRef.current.querySelector('svg');
    if (!svgElement) return;

    // Clone the SVG to avoid modifying the displayed one
    const svgClone = svgElement.cloneNode(true) as SVGElement;

    // Add proper XML declaration and set attributes
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `qrcode_${new Date().getTime()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up
    URL.revokeObjectURL(svgUrl);
  };

  // Download QR code as PNG
  const downloadAsPNG = () => {
    if (!qrCodeRef.current) return;

    // Get canvas element (qrcode.react creates a canvas)
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (!canvas) return;

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `qrcode_${new Date().getTime()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

        {/* QR Code with animation */}
        <div className="mb-6" ref={qrCodeRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStyle.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              {isLoading ? (
                <div
                  className="flex items-center justify-center"
                  style={{ width: size, height: size }}
                >
                  <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                </div>
              ) : (
                <QRCodeSVG
                  value={value}
                  size={size}
                  fgColor={currentStyle.fgColor}
                  bgColor={currentStyle.bgColor}
                  level="H" // High error correction
                  includeMargin={true}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-sm text-gray-500 mb-4 text-center">
          Scan this QR code to access the questionnaire
        </p>

        {/* Enhanced Link Section */}
        <div className="w-full max-w-md mb-6">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <LinkIcon className="h-4 w-4 mr-1" />
              Questionnaire Link
            </h3>
            <div className="relative">
              {/* URL Input Field */}
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={displayUrl}
                    readOnly
                    ref={linkInputRef}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="w-full pr-20 pl-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800 font-mono text-sm"
                  />
                  {/* URL Type Indicator */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isShortened ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {isShortened ? 'Short' : 'Full'}
                    </span>
                  </div>
                </div>
                {/* Copy Button */}
                <button
                  onClick={copyToClipboard}
                  className={`px-3 py-2 ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-r-md transition-colors flex items-center justify-center`}
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                </button>
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {tooltipVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 right-0 -bottom-8 flex justify-center"
                  >
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md">
                      {tooltipMessage}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Link Actions */}
          <div className="flex space-x-2">
            {/* Shorten URL Button */}
            <Button
              className={`flex-1 ${isShortened ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors text-sm`}
              onClick={toggleUrlShortening}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Scissors className="h-3.5 w-3.5 mr-1" />
              )}
              {isShortened ? 'Use Full URL' : 'Shorten URL'}
            </Button>

            {/* Open Link Button */}
            <Button
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              onClick={() => window.open(displayUrl, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Open Link
            </Button>

            {/* Share Button */}
            <div className="relative flex-1" ref={shareMenuRef}>
              <Button
                className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>

              {/* Share Options Dropdown */}
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => shareLink('copy')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ClipboardCopy className="h-4 w-4 mr-3 text-gray-500" />
                        Copy to clipboard
                      </button>
                      <button
                        onClick={() => shareLink('facebook')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => shareLink('twitter')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Twitter className="h-4 w-4 mr-3 text-blue-400" />
                        Twitter
                      </button>
                      <button
                        onClick={() => shareLink('email')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Mail className="h-4 w-4 mr-3 text-gray-500" />
                        Email
                      </button>
                      <button
                        onClick={() => shareLink('sms')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Smartphone className="h-4 w-4 mr-3 text-gray-500" />
                        SMS
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
          {/* Download as SVG */}
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            onClick={downloadAsSVG}
          >
            <Download className="h-4 w-4 mr-2" />
            Download as SVG
          </Button>

          {/* Download as PNG */}
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            onClick={downloadAsPNG}
          >
            <Download className="h-4 w-4 mr-2" />
            Download as PNG
          </Button>

          {/* Generate random style */}
          <Button
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors col-span-2"
            onClick={generateRandomStyle}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Palette className="h-4 w-4 mr-2" />
                Random Style
              </>
            )}
          </Button>
        </div>

        {/* Current style indicator */}
        <div className="mt-4 text-sm text-gray-500">
          Current style: <span className="font-medium">{currentStyle.name}</span>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedQRCode;
