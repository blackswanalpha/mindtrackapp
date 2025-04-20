'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Input,
  TextArea,
  Button,
  Alert,
  Loading
} from '@/components/common';
import {
  Save,
  AlertTriangle
} from 'lucide-react';
import api from '@/services/api';

type ResponseFormProps = {
  responseId: number;
  questionnaireId: number;
  initialData?: any;
  isEditing?: boolean;
};

const ResponseForm: React.FC<ResponseFormProps> = ({
  responseId,
  questionnaireId,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    patient_email: initialData?.patient_email || '',
    patient_name: initialData?.patient_name || '',
    patient_age: initialData?.patient_age || '',
    patient_gender: initialData?.patient_gender || '',
    flagged_for_review: initialData?.flagged_for_review ?? false,
  });

  const [answers, setAnswers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Fetch questions for the questionnaire
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsQuestionsLoading(true);
      try {
        const data = await api.questionnaires.getWithQuestions(questionnaireId);
        setQuestions(data.questions.sort((a: any, b: any) => a.order_num - b.order_num));

        // Initialize answers if editing
        if (isEditing && initialData?.answers) {
          setAnswers(initialData.answers);
        }
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load questions');
      } finally {
        setIsQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [questionnaireId, isEditing, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers(prev => {
      // Find if answer already exists
      const existingAnswerIndex = prev.findIndex(a => a.question_id === questionId);

      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          value
        };
        return updatedAnswers;
      } else {
        // Add new answer
        return [...prev, {
          question_id: questionId,
          value
        }];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate email
      if (!formData.patient_email) {
        throw new Error('Email is required');
      }

      // Format data for API
      const apiData = {
        ...formData,
        patient_age: formData.patient_age ? parseInt(formData.patient_age.toString()) : undefined,
        answers
      };

      if (isEditing) {
        // Update existing response
        await api.responses.update(responseId, apiData);
        setSuccess('Response updated successfully!');

        // Wait a moment to show success message
        setTimeout(() => {
          router.push(`/admin/responses/${responseId}`);
        }, 1500);
      } else {
        // Create new response
        const newResponse = await api.responses.create(questionnaireId, apiData);
        setSuccess('Response created successfully!');

        // Wait a moment to show success message
        setTimeout(() => {
          router.push(`/admin/responses/${newResponse.id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the response');
    } finally {
      setIsLoading(false);
    }
  };

  if (isQuestionsLoading) {
    return <Loading size="large" message="Loading questions..." />;
  }

  return (
    <div>
      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {success && (
        <Alert type="success" message={success} className="mb-6" />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Email */}
          <div>
            <label htmlFor="patient_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="patient_email"
              name="patient_email"
              type="email"
              value={formData.patient_email}
              onChange={handleChange}
              required
              placeholder="Enter patient email"
            />
          </div>

          {/* Patient Name */}
          <div>
            <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              id="patient_name"
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              placeholder="Enter patient name"
            />
          </div>

          {/* Patient Age */}
          <div>
            <label htmlFor="patient_age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <Input
              id="patient_age"
              name="patient_age"
              type="number"
              min="0"
              max="120"
              value={formData.patient_age}
              onChange={handleChange}
              placeholder="Enter patient age"
            />
          </div>

          {/* Patient Gender */}
          <div>
            <label htmlFor="patient_gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="patient_gender"
              name="patient_gender"
              value={formData.patient_gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Flag for Review */}
        <div className="flex items-center">
          <input
            id="flagged_for_review"
            name="flagged_for_review"
            type="checkbox"
            checked={formData.flagged_for_review}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="flagged_for_review" className="ml-2 block text-sm text-gray-700">
            Flag for review
          </label>
        </div>

        {/* Questions and Answers */}
        {questions.length > 0 ? (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Answers</h3>

            <div className="space-y-6">
              {questions.map((question) => {
                const answer = answers.find(a => a.question_id === question.id);

                return (
                  <div key={question.id} className="p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium text-gray-800 mb-2">
                      {question.text}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>

                    {question.description && (
                      <p className="text-sm text-gray-600 mb-3">{question.description}</p>
                    )}

                    {/* Render different input types based on question type */}
                    {question.type === 'text' && (
                      <Input
                        value={answer?.value || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Enter your answer"
                        required={question.required}
                      />
                    )}

                    {question.type === 'textarea' && (
                      <TextArea
                        value={answer?.value || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Enter your answer"
                        rows={3}
                        required={question.required}
                      />
                    )}

                    {question.type === 'single_choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option: any) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              id={`question_${question.id}_option_${option.value}`}
                              name={`question_${question.id}`}
                              value={option.value}
                              checked={answer?.value === option.value}
                              onChange={() => handleAnswerChange(question.id, option.value)}
                              required={question.required && !answer}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                              htmlFor={`question_${question.id}_option_${option.value}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option: any) => {
                          const selectedValues = Array.isArray(answer?.value) ? answer.value : [];

                          return (
                            <div key={option.value} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`question_${question.id}_option_${option.value}`}
                                name={`question_${question.id}_option_${option.value}`}
                                checked={selectedValues.includes(option.value)}
                                onChange={(e) => {
                                  const newSelectedValues = e.target.checked
                                    ? [...selectedValues, option.value]
                                    : selectedValues.filter((v: any) => v !== option.value);

                                  handleAnswerChange(question.id, newSelectedValues);
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`question_${question.id}_option_${option.value}`}
                                className="ml-2 block text-sm text-gray-700"
                              >
                                {option.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {question.type === 'boolean' && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`question_${question.id}_true`}
                            name={`question_${question.id}`}
                            checked={answer?.value === true}
                            onChange={() => handleAnswerChange(question.id, true)}
                            required={question.required && answer?.value === undefined}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor={`question_${question.id}_true`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`question_${question.id}_false`}
                            name={`question_${question.id}`}
                            checked={answer?.value === false}
                            onChange={() => handleAnswerChange(question.id, false)}
                            required={question.required && answer?.value === undefined}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor={`question_${question.id}_false`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No questions found for this questionnaire. Please add questions first.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="light"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
              ? 'Update Response'
              : 'Create Response'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResponseForm;
