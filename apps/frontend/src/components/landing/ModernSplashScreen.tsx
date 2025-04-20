'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowRight, 
  FileQuestion, 
  QrCode, 
  Users, 
  BarChart4, 
  Mail, 
  CheckCircle2, 
  Brain, 
  Sparkles
} from 'lucide-react';

const ModernSplashScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'admin' | 'client'>('admin');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Use intersection observer for scroll animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Decorative elements */}
      <div className="fixed -z-10 top-0 left-0 w-96 h-96 blob blob-1 opacity-50 animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="fixed -z-10 top-40 right-20 w-80 h-80 blob blob-2 opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="fixed -z-10 bottom-20 left-40 w-64 h-64 blob blob-3 opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      
      {/* Header */}
      <header className="py-6 px-8">
        <div className="container-fluid mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-display font-bold text-gradient-primary">QuestFlow</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="font-medium text-neutral-700 hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="font-medium text-neutral-700 hover:text-primary-600 transition-colors">How It Works</a>
            <a href="#get-started" className="font-medium text-neutral-700 hover:text-primary-600 transition-colors">Get Started</a>
          </nav>
          <div>
            <Link href="/admin" className="btn btn-primary">
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-spacing py-20" ref={heroRef}>
        <div className="container-fluid mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="badge badge-primary mb-4">Questionnaire Management Platform</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Create, Share, and <span className="text-gradient-primary">Analyze</span> Questionnaires
            </h1>
            <p className="font-body text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive platform for creating questionnaires, collecting responses, and gaining valuable insights through advanced analytics and AI-powered analysis.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/admin/questionnaires/create" className="btn btn-primary text-lg px-8 py-4">
                Create Questionnaire
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/admin" className="btn btn-outline text-lg px-8 py-4">
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing py-24 bg-white" ref={featuresRef}>
        <div className="container-fluid mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-secondary mb-4">Powerful Features</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="font-body text-xl text-neutral-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you create, distribute, and analyze questionnaires with ease.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="card p-8 hover:border-primary-300 transition-all">
              <div className="bg-primary-100 text-primary-700 p-3 rounded-lg inline-block mb-4">
                <FileQuestion className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Questionnaire Creation</h3>
              <p className="text-neutral-600">
                Create custom questionnaires with various question types, branching logic, and scoring systems.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="card p-8 hover:border-primary-300 transition-all">
              <div className="bg-primary-100 text-primary-700 p-3 rounded-lg inline-block mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">QR Code Generation</h3>
              <p className="text-neutral-600">
                Generate QR codes for easy distribution and access to your questionnaires.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="card p-8 hover:border-primary-300 transition-all">
              <div className="bg-primary-100 text-primary-700 p-3 rounded-lg inline-block mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Response Collection</h3>
              <p className="text-neutral-600">
                Collect responses from users with or without requiring authentication.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="card p-8 hover:border-primary-300 transition-all">
              <div className="bg-primary-100 text-primary-700 p-3 rounded-lg inline-block mb-4">
                <BarChart4 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Response Analysis</h3>
              <p className="text-neutral-600">
                View and analyze responses with detailed metrics and visualizations.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={itemVariants} className="card p-8 hover:border-primary-300 transition-all">
              <div className="bg-primary-100 text-primary-700 p-3 rounded-lg inline-block mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Response Scoring</h3>
              <p className="text-neutral-600">
                Automatically score responses based on predefined criteria and view results.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={itemVariants} className="card p-8 hover:border-primary-300 transition-all">
              <div className="bg-primary-100 text-primary-700 p-3 rounded-lg inline-block mb-4">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-neutral-600">
                Leverage AI to gain deeper insights from your questionnaire responses.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-spacing py-24">
        <div className="container-fluid mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-accent mb-4">Simple Process</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="font-body text-xl text-neutral-600 max-w-3xl mx-auto">
              Our platform makes it easy to create, distribute, and analyze questionnaires.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
            <div className="flex gap-4">
              <button 
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'admin' 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
                onClick={() => setActiveTab('admin')}
              >
                For Administrators
              </button>
              <button 
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'client' 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
                onClick={() => setActiveTab('client')}
              >
                For Respondents
              </button>
            </div>
          </div>

          {activeTab === 'admin' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-700">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Questionnaire</h3>
                <p className="text-neutral-600">
                  Design your questionnaire with various question types and customize settings.
                </p>
              </div>
              
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-700">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Share QR Code</h3>
                <p className="text-neutral-600">
                  Generate and share QR codes for easy access to your questionnaire.
                </p>
              </div>
              
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-700">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Analyze Results</h3>
                <p className="text-neutral-600">
                  View responses, analyze data, and gain insights through AI-powered analysis.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-secondary-700">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Scan QR Code</h3>
                <p className="text-neutral-600">
                  Scan the QR code or click the link to access the questionnaire.
                </p>
              </div>
              
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-secondary-700">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Complete Questionnaire</h3>
                <p className="text-neutral-600">
                  Answer the questions at your own pace with a user-friendly interface.
                </p>
              </div>
              
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-secondary-700">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Receive Results</h3>
                <p className="text-neutral-600">
                  Get immediate feedback and results via email after submission.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="section-spacing py-24 bg-gradient-primary text-white" ref={ctaRef}>
        <div className="container-fluid mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge bg-white text-primary-700 mb-4">Get Started Today</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Questionnaire Process?
            </h2>
            <p className="font-body text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Join thousands of organizations that use our platform to create, distribute, and analyze questionnaires with ease.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/admin/questionnaires/create" className="btn bg-white text-primary-700 hover:bg-neutral-100 text-lg px-8 py-4">
                Create Your First Questionnaire
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <div className="container-fluid mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-6">QuestFlow</h3>
              <p className="text-neutral-400 mb-6">
                A comprehensive platform for creating, distributing, and analyzing questionnaires.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Questionnaire Creation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">QR Code Generation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Response Collection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Response Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Insights</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:support@questflow.com" className="hover:text-white transition-colors">support@questflow.com</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500">
            <p>&copy; {new Date().getFullYear()} QuestFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernSplashScreen;
