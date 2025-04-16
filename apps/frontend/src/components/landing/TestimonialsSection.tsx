'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  const testimonials = [
    {
      quote: "MindTrack has revolutionized how we monitor our patients' mental health. The detailed analytics and easy-to-use interface have made our work significantly more efficient.",
      author: "Dr. Sarah Johnson",
      title: "Clinical Psychologist",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      quote: "The ability to create custom questionnaires and track progress over time has been invaluable for our practice. Our patients appreciate the simple interface and privacy features.",
      author: "Dr. Michael Chen",
      title: "Psychiatrist",
      image: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      quote: "As a mental health researcher, I've found MindTrack's data collection and analysis capabilities to be exceptional. It's helped us identify patterns we might have otherwise missed.",
      author: "Dr. Emily Rodriguez",
      title: "Research Psychologist",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
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
            Trusted by Mental Health Professionals
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-600"
          >
            See what healthcare providers are saying about MindTrack
          </motion.p>
        </motion.div>

        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg p-8 shadow-md relative"
              whileHover={{ 
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="absolute -top-4 -left-4 bg-blue-600 rounded-full p-2 text-white">
                <Quote className="h-5 w-5" />
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-600">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
