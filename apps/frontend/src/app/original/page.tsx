import React from 'react';
import Link from 'next/link';

export default function OriginalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Welcome to the Mental Health Assessment Platform</h1>
      <p className="text-xl text-gray-600 text-center max-w-2xl mb-8">
        Create, distribute, and analyze mental health questionnaires with powerful AI-driven insights.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/admin/questionnaires"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Admin Dashboard
        </Link>
        <Link
          href="/respond/questionnaires/1"
          className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Try a Questionnaire
        </Link>
      </div>
    </div>
  );
}
