'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  instructions: string;
  created_at: string;
}

const QuestionnaireList: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Mock data for questionnaires
    const mockQuestionnaires: Questionnaire[] = [
      {
        id: 1,
        title: 'Depression Assessment',
        description: 'A comprehensive assessment for depression symptoms based on PHQ-9.',
        instructions: 'Please answer all questions honestly based on how you felt in the past 2 weeks.',
        created_at: '2023-04-15T10:30:00Z'
      },
      {
        id: 2,
        title: 'Anxiety Screening',
        description: 'Screening tool for anxiety disorders based on GAD-7 criteria.',
        instructions: 'Rate how often you have been bothered by the following problems over the last 2 weeks.',
        created_at: '2023-04-10T14:20:00Z'
      },
      {
        id: 3,
        title: 'Well-being Check',
        description: 'General assessment of mental well-being and life satisfaction.',
        instructions: 'Please indicate how much you agree with each statement.',
        created_at: '2023-04-05T09:15:00Z'
      },
      {
        id: 4,
        title: 'Stress Evaluation',
        description: 'Evaluation of current stress levels and coping mechanisms.',
        instructions: 'Answer based on your experiences in the past month.',
        created_at: '2023-04-01T11:45:00Z'
      },
      {
        id: 5,
        title: 'Sleep Quality Assessment',
        description: 'Assessment of sleep patterns and quality based on PSQI.',
        instructions: 'Please answer the following questions about your sleep habits.',
        created_at: '2023-03-28T16:30:00Z'
      },
      {
        id: 6,
        title: 'Mood Tracker',
        description: 'Daily mood tracking questionnaire for monitoring emotional patterns.',
        instructions: 'Rate your mood and emotions for today.',
        created_at: '2023-03-25T08:20:00Z'
      }
    ];

    // Simulate API call delay
    const timer = setTimeout(() => {
      setQuestionnaires(mockQuestionnaires);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 flex justify-center items-center">
        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading questionnaires...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {questionnaires.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">No questionnaires available at the moment.</p>
          <p className="text-gray-500">Please check back later or contact your administrator.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {questionnaires.map((questionnaire) => (
            <motion.div
              key={questionnaire.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{questionnaire.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{questionnaire.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(questionnaire.created_at).toLocaleDateString()}
                  </span>
                  <Link href={`/questionnaires/${questionnaire.id}`}>
                    <motion.button
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default QuestionnaireList;
