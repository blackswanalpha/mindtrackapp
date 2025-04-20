'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Brain } from 'lucide-react';

type ClientLayoutProps = {
  children: ReactNode;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">MindTrack</span>
          </Link>
          <div className="text-sm text-gray-600">
            Mental Health Assessment Platform
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} MindTrack. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
