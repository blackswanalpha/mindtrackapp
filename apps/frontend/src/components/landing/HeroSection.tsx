'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Activity, Shield, QrCode, ScanLine } from 'lucide-react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.6
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-purple-100 opacity-40 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800">
              Mental Health Tracking Made Simple
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
            variants={itemVariants}
          >
            Monitor mental health with
            <span className="block text-blue-600">precision and care</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600"
            variants={itemVariants}
          >
            MindTrack helps healthcare providers create, distribute, and analyze mental health questionnaires
            to better understand and support their patients' wellbeing.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            variants={itemVariants}
          >
            <Link href="/dashboard">
              <motion.button
                className="flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </Link>
            <Link href="/scan">
              <motion.button
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Scan QR Code
                <ScanLine className="ml-2 h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={featureVariants}
          initial="hidden"
          animate="visible"
        >
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-blue-600" />}
            title="Comprehensive Assessments"
            description="Create customizable mental health questionnaires with various question types and scoring methods."
          />
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-blue-600" />}
            title="Insightful Analytics"
            description="Track progress over time with detailed analytics and visualizations of patient responses."
          />
          <FeatureCard
            icon={<QrCode className="h-8 w-8 text-blue-600" />}
            title="Easy Access"
            description="Scan QR codes to quickly access questionnaires without needing to create an account or log in."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-blue-600" />}
            title="Secure & Private"
            description="Patient data is encrypted and securely stored, complying with healthcare privacy standards."
          />
        </motion.div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg"
      whileHover={{ y: -5 }}
    >
      <div className="mb-4 rounded-full bg-blue-50 p-3 inline-flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default HeroSection;
