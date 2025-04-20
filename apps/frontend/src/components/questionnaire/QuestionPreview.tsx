'use client';

import React, { useState } from 'react';
import { Card, Button, Alert } from '@/components/common';
import { 
  AlertTriangle, 
  HelpCircle, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Star,
  Calendar
} from 'lucide-react';

type QuestionPreviewProps = {
  question: {
    id: string | number;
    text: string;
    description?: string;
    type: string;
    required: boolean;
    options?: string[] | Array<{ value: number | string; label: string }>;
    validation_rules?: any;
  };
  showControls?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  showControls = true,
  onNext,
  onPrevious,
  isFirst = false,
  isLast = false
}) => {
  const [answer, setAnswer] = useState<string | string[]>('');
  const [error, setError] = useState<string | null>(null);

  // Format options to a consistent structure
  const formatOptions = () => {
    if (!question.options) return [];
    
    if (typeof question.options[0] === 'string') {
      return (question.options as string[]).map((option, index) => ({
        value: index.toString(),
        label: option
      }));
    }
    
    return question.options as Array<{ value: number | string; label: string }>;
  };

  const options = formatOptions();

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setError(null);
    
    if (question.type === 'multiple_choice' && e.target instanceof HTMLInputElement) {
      const value = e.target.value;
      
      if (e.target.checked) {
        setAnswer(prev => 
          Array.isArray(prev) ? [...prev, value] : [value]
        );
      } else {
        setAnswer(prev => 
          Array.isArray(prev) ? prev.filter(item => item !== value) : []
        );
      }
    } else {
      setAnswer(e.target.value);
    }
  };

  // Handle next button click
  const handleNext = () => {
    // Validate if required
    if (question.required) {
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        setError('This question requires an answer');
        return;
      }
    }
    
    if (onNext) onNext();
  };

  // Render different input types based on question type
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={answer as string}
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />
        );
        
      case 'email':
        return (
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={answer as string}
            onChange={handleInputChange}
            placeholder="Enter your email address"
          />
        );
        
      case 'single_choice':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${option.value}`}
                  name={`question-${question.id}`}
                  value={option.value.toString()}
                  checked={answer === option.value.toString()}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`option-${option.value}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`option-${option.value}`}
                  name={`question-${question.id}`}
                  value={option.value.toString()}
                  checked={Array.isArray(answer) && answer.includes(option.value.toString())}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`option-${option.value}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'rating':
        return (
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAnswer(value.toString())}
                className={`h-10 w-10 flex items-center justify-center rounded-full ${
                  answer === value.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                {value}
              </button>
            ))}
          </div>
        );
        
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Low</span>
              <span className="text-sm text-gray-500">High</span>
            </div>
            <div className="flex justify-between space-x-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAnswer(value.toString())}
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    answer === value.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors text-sm`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'yes_no':
        return (
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setAnswer('yes')}
              className={`px-4 py-2 rounded-md flex items-center ${
                answer === 'yes'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <Check className="h-4 w-4 mr-2" />
              Yes
            </button>
            <button
              type="button"
              onClick={() => setAnswer('no')}
              className={`px-4 py-2 rounded-md flex items-center ${
                answer === 'no'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <X className="h-4 w-4 mr-2" />
              No
            </button>
          </div>
        );
        
      case 'date':
        return (
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={answer as string}
              onChange={handleInputChange}
            />
          </div>
        );
        
      default:
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Unknown question type: {question.type}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Question Header */}
        <div>
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {question.description && (
                <p className="mt-1 text-sm text-gray-500">{question.description}</p>
              )}
            </div>
            {question.type === 'rating' && (
              <div className="flex-shrink-0">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Question Input */}
        <div>
          {renderQuestionInput()}
          
          {error && (
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}
        </div>
        
        {/* Navigation Controls */}
        {showControls && (
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button
              type="button"
              className={`bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors ${
                isFirst ? 'invisible' : ''
              }`}
              onClick={onPrevious}
              disabled={isFirst}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <Button
              type="button"
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={handleNext}
            >
              {isLast ? 'Submit' : 'Next'}
              {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuestionPreview;
