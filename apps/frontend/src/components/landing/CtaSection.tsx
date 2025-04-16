'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CtaSection: React.FC = () => {
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

  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            Ready to transform your mental health practice?
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mt-4 text-xl text-blue-100"
          >
            Join thousands of healthcare providers using MindTrack to improve patient outcomes
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link href="/register">
              <motion.button
                className="flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                className="flex items-center justify-center rounded-md border border-blue-300 bg-transparent px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="mt-6 text-sm text-blue-200"
          >
            No credit card required. Free trial for 14 days.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
