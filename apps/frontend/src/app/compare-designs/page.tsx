import React from 'react';
import Link from 'next/link';
import SplashScreen from '@/components/landing/SplashScreen';
import SplashScreenRedesigned from '@/components/landing/SplashScreenRedesigned';

export default function CompareDesignsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Design Comparison</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Link 
            href="/original"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <h2 className="text-xl font-semibold mb-2">View Original Design</h2>
            <p className="text-gray-600">See the original splash screen design</p>
          </Link>
          
          <Link 
            href="/redesigned"
            className="bg-indigo-600 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">View Redesigned Version</h2>
            <p className="text-indigo-100">See the new redesigned splash screen</p>
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Key Improvements in the Redesign</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">1. Typography</h3>
              <p className="text-gray-700">Improved font pairing with Inter, Playfair Display, and DM Sans for better readability and visual hierarchy.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">2. Interactive Elements</h3>
              <p className="text-gray-700">Added scroll-triggered animations, hover effects, and micro-interactions for a more engaging experience.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">3. Visual Design</h3>
              <p className="text-gray-700">Enhanced color scheme, gradient effects, and improved use of whitespace for a more modern look.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">4. Layout</h3>
              <p className="text-gray-700">Refined spacing, asymmetrical layouts, and better visual flow to guide users through the content.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">5. Motion Design</h3>
              <p className="text-gray-700">Added parallax effects, staggered animations, and scroll-based interactions for a dynamic feel.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/"
            className="inline-block bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
