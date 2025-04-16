'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ClipboardList, 
  BarChart3, 
  QrCode, 
  Mail, 
  Shield, 
  Brain 
} from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

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

  const features = [
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: 'Customizable Questionnaires',
      description: 'Create tailored mental health assessments with various question types and scoring methods.'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Detailed Analytics',
      description: 'Gain insights with comprehensive analytics and visualizations of patient responses.'
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: 'QR Code Distribution',
      description: 'Easily share questionnaires with patients using automatically generated QR codes.'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Notifications',
      description: 'Automated email notifications for completed assessments and high-risk responses.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Compliant',
      description: 'Patient data is encrypted and securely stored, complying with healthcare privacy standards.'
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered Insights',
      description: 'Advanced AI analysis provides deeper understanding of patient responses and trends.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            Powerful Features for Mental Health Professionals
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-600"
          >
            Everything you need to create, distribute, and analyze mental health assessments
          </motion.p>
        </motion.div>

        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-50 rounded-lg p-8 transition-all hover:shadow-md"
              whileHover={{ y: -5, backgroundColor: '#f0f7ff' }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-md text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
