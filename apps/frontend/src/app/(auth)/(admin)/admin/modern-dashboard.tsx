'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FileQuestion,
  Users,
  BarChart4,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Mail,
  Brain
} from 'lucide-react';
import { ModernCard, ModernButton } from '@/components/common';

const ModernDashboard: React.FC = () => {
  // Use intersection observer for animations
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [chartsRef, chartsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [actionsRef, actionsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Welcome back, Admin User</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <ModernButton
            variant="primary"
            icon={<FileQuestion className="h-4 w-4" />}
          >
            <Link href="/admin/questionnaires/create">Create Questionnaire</Link>
          </ModernButton>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        ref={statsRef}
        variants={containerVariants}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Questionnaires */}
        <motion.div variants={itemVariants}>
          <ModernCard className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm font-medium">Total Questionnaires</p>
                <h3 className="text-3xl font-bold mt-2">24</h3>
                <div className="flex items-center mt-2 text-success-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">12% from last month</span>
                </div>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileQuestion className="h-6 w-6 text-primary-700" />
              </div>
            </div>
          </ModernCard>
        </motion.div>

        {/* Total Responses */}
        <motion.div variants={itemVariants}>
          <ModernCard className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm font-medium">Total Responses</p>
                <h3 className="text-3xl font-bold mt-2">156</h3>
                <div className="flex items-center mt-2 text-success-600">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">24% from last month</span>
                </div>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <BarChart4 className="h-6 w-6 text-secondary-700" />
              </div>
            </div>
          </ModernCard>
        </motion.div>

        {/* Active Users */}
        <motion.div variants={itemVariants}>
          <ModernCard className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm font-medium">Active Users</p>
                <h3 className="text-3xl font-bold mt-2">32</h3>
                <div className="flex items-center mt-2 text-error-600">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">5% from last month</span>
                </div>
              </div>
              <div className="bg-accent-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-accent-700" />
              </div>
            </div>
          </ModernCard>
        </motion.div>

        {/* Avg. Completion Time */}
        <motion.div variants={itemVariants}>
          <ModernCard className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-500 text-sm font-medium">Avg. Completion Time</p>
                <h3 className="text-3xl font-bold mt-2">4:32</h3>
                <div className="flex items-center mt-2 text-neutral-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Minutes per response</span>
                </div>
              </div>
              <div className="bg-neutral-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-neutral-700" />
              </div>
            </div>
          </ModernCard>
        </motion.div>
      </motion.div>

      {/* Charts and Recent Activity */}
      <div 
        ref={chartsRef}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Response Trends */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ModernCard className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Response Trends</h3>
              <select className="text-sm border border-neutral-300 rounded-md px-2 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center">
              <p className="text-neutral-500">Chart visualization would go here</p>
            </div>
          </ModernCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ModernCard className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Link href="/admin/responses" className="text-primary-600 text-sm hover:text-primary-700">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-success-100 p-2 rounded-full mr-3">
                  <CheckCircle2 className="h-4 w-4 text-success-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">New response submitted</p>
                  <p className="text-xs text-neutral-500">PHQ-9 Assessment • 10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-warning-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-4 w-4 text-warning-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Response flagged for review</p>
                  <p className="text-xs text-neutral-500">Anxiety Assessment • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-100 p-2 rounded-full mr-3">
                  <FileQuestion className="h-4 w-4 text-primary-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">New questionnaire created</p>
                  <p className="text-xs text-neutral-500">Stress Assessment • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-info-100 p-2 rounded-full mr-3">
                  <Users className="h-4 w-4 text-info-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-neutral-500">john.doe@example.com • 2 days ago</p>
                </div>
              </div>
            </div>
          </ModernCard>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        ref={actionsRef}
        variants={containerVariants}
        initial="hidden"
        animate={actionsInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <ModernCard className="h-full hover:border-primary-300 transition-all">
            <Link href="/admin/questionnaires/create" className="block">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <FileQuestion className="h-8 w-8 text-primary-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Create Questionnaire</h3>
                <p className="text-neutral-500 text-sm mb-4">Design a new questionnaire with custom questions</p>
                <ModernButton variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                  Get Started
                </ModernButton>
              </div>
            </Link>
          </ModernCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ModernCard className="h-full hover:border-secondary-300 transition-all">
            <Link href="/admin/questionnaires/qr-codes" className="block">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-secondary-100 p-4 rounded-full mb-4">
                  <QrCode className="h-8 w-8 text-secondary-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Generate QR Code</h3>
                <p className="text-neutral-500 text-sm mb-4">Create QR codes for easy questionnaire access</p>
                <ModernButton variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                  Generate
                </ModernButton>
              </div>
            </Link>
          </ModernCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ModernCard className="h-full hover:border-accent-300 transition-all">
            <Link href="/admin/responses/analytics" className="block">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-accent-100 p-4 rounded-full mb-4">
                  <BarChart4 className="h-8 w-8 text-accent-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
                <p className="text-neutral-500 text-sm mb-4">Analyze response data with detailed metrics</p>
                <ModernButton variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                  Explore
                </ModernButton>
              </div>
            </Link>
          </ModernCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ModernCard className="h-full hover:border-info-300 transition-all">
            <Link href="/admin/ai-analysis" className="block">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-info-100 p-4 rounded-full mb-4">
                  <Brain className="h-8 w-8 text-info-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                <p className="text-neutral-500 text-sm mb-4">Get AI-powered insights from your responses</p>
                <ModernButton variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                  Analyze
                </ModernButton>
              </div>
            </Link>
          </ModernCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModernDashboard;
