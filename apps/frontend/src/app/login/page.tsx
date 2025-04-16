'use client';

import React, { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // Redirect to dashboard if already logged in
        router.push('/dashboard');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">MindTrack</h1>
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-600">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
