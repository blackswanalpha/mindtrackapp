import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  ListChecks,
  QrCode,
  Users,
  BarChart2,
  Brain,
  Mail,
  ArrowRight
} from 'lucide-react';

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
  linkTo,
  linkText = 'Learn More',
  adminFeature = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  linkTo: string;
  linkText?: string;
  adminFeature?: boolean;
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-lg ${adminFeature ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            {icon}
          </div>
          <h3 className="ml-3 text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          href={linkTo}
          className={`inline-flex items-center text-sm font-medium ${adminFeature ? 'text-purple-600 hover:text-purple-800' : 'text-blue-600 hover:text-blue-800'}`}
        >
          {linkText} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

const SplashScreen = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-16 md:py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                <span className="block">Mental Health</span>
                <span className="block text-blue-600">Assessment Platform</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-6 max-w-lg mx-auto text-xl text-gray-500"
              >
                Create, distribute, and analyze mental health questionnaires with powerful AI-driven insights.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="mt-10 flex justify-center gap-4"
              >
                <Link
                  href="/admin/questionnaires"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Admin Dashboard
                </Link>
                <Link
                  href="/respond/questionnaires/1"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white border-blue-600 hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Try a Questionnaire
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-blue-50 to-transparent"></div>
        <div className="absolute -right-20 top-1/4 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -left-20 bottom-1/4 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-extrabold text-gray-900">
            Comprehensive Mental Health Assessment Tools
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform provides everything you need to create, distribute, and analyze mental health questionnaires.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Admin Features */}
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Create Questionnaires"
            description="Design custom mental health assessments with various question types to gather the information you need."
            delay={0.1}
            linkTo="/admin/questionnaires/create"
            linkText="Create Now"
            adminFeature={true}
          />

          <FeatureCard
            icon={<ListChecks className="h-6 w-6" />}
            title="Manage Questions"
            description="Add, edit, and organize questions to create comprehensive and effective assessments."
            delay={0.2}
            linkTo="/admin/questionnaires"
            adminFeature={true}
          />

          <FeatureCard
            icon={<QrCode className="h-6 w-6" />}
            title="Generate QR Codes"
            description="Create QR codes for easy distribution of questionnaires to clients and patients."
            delay={0.3}
            linkTo="/admin/questionnaires/1/qr-code"
            linkText="Generate QR Code"
            adminFeature={true}
          />

          {/* Client Features */}
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Answer Questionnaires"
            description="Clients can easily access and complete questionnaires on any device with a simple, intuitive interface."
            delay={0.4}
            linkTo="/respond/questionnaires/1"
            linkText="Try a Questionnaire"
          />

          {/* Admin Analysis Features */}
          <FeatureCard
            icon={<BarChart2 className="h-6 w-6" />}
            title="View & Score Responses"
            description="Review client responses and apply scoring systems to quantify assessment results."
            delay={0.5}
            linkTo="/admin/responses"
            adminFeature={true}
          />

          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="AI Analysis"
            description="Leverage AI to analyze responses and gain deeper insights into client mental health status."
            delay={0.6}
            linkTo="/admin/responses/1"
            linkText="See AI Analysis"
            adminFeature={true}
          />

          <FeatureCard
            icon={<Mail className="h-6 w-6" />}
            title="Email Communication"
            description="Send personalized emails to clients with their results and follow-up recommendations."
            delay={0.7}
            linkTo="/email/send"
            linkText="Send Email"
            adminFeature={true}
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-extrabold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes mental health assessment simple and effective.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-blue-200 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Create",
                  description: "Admins create questionnaires and questions",
                  delay: 0.1,
                  color: "bg-blue-100 text-blue-600 border-blue-200"
                },
                {
                  step: 2,
                  title: "Distribute",
                  description: "Share via QR codes or direct links",
                  delay: 0.2,
                  color: "bg-green-100 text-green-600 border-green-200"
                },
                {
                  step: 3,
                  title: "Collect",
                  description: "Clients complete questionnaires",
                  delay: 0.3,
                  color: "bg-yellow-100 text-yellow-600 border-yellow-200"
                },
                {
                  step: 4,
                  title: "Analyze",
                  description: "Review, score, and get AI insights",
                  delay: 0.4,
                  color: "bg-purple-100 text-purple-600 border-purple-200"
                }
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  className="text-center relative"
                >
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mx-auto mb-4 relative z-10 border-2`}>
                    <span className="text-lg font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Ready to get started?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-blue-100">
                Start creating questionnaires and gathering valuable mental health insights today.
              </p>
            </div>
            <div className="mt-8 md:mt-0">
              <Link
                href="/admin/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
