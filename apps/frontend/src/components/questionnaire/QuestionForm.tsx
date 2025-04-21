'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

type QuestionFormProps = {
  questionnaireId: number;
  initialData?: any;
  isEditing?: boolean;
};

const QuestionForm: React.FC<QuestionFormProps> = ({
  questionnaireId,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    text: initialData?.text || '',
    description: initialData?.description || '',
    type: initialData?.type || 'text',
    required: initialData?.required ?? true,
    order_num: initialData?.order_num || '',
    options: initialData?.options ?
      (typeof initialData.options === 'string' ?
        JSON.parse(initialData.options) : initialData.options) :
      [],
    scoring_weight: initialData?.scoring_weight || 1,
  });

  // Log initial data for debugging
  useEffect(() => {
    if (initialData) {
      console.log('Initial question data:', initialData);
    }
  }, [initialData]);

  const [newOption, setNewOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const addOption = () => {
    if (newOption.trim()) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, { value: prev.options.length + 1, label: newOption.trim() }],
      }));
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_: any, i: number) => i !== index),
    }));
  };

  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Format data for API
      const apiData = {
        ...formData,
        order_num: formData.order_num ? parseInt(formData.order_num.toString()) : undefined,
        scoring_weight: parseInt(formData.scoring_weight.toString()),
        options: formData.options.length > 0 ? JSON.stringify(formData.options) : undefined,
        questionnaire_id: questionnaireId
      };

      console.log('Submitting question data:', apiData);

      if (isEditing && initialData?.id) {
        // Update existing question
        if (typeof window !== 'undefined') {
          const updatedQuestion = await api.questions.update(initialData.id, apiData);
          console.log('Question updated successfully:', updatedQuestion);
          setSuccess('Question updated successfully!');
        }
      } else {
        // Create new question
        if (typeof window !== 'undefined') {
          const newQuestion = await api.questions.create(questionnaireId, apiData);
          console.log('Question created successfully:', newQuestion);
          setSuccess('Question created successfully!');
        }
      }

      // Wait a moment to show success message
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to questionnaire questions page
      router.push(`/admin/questionnaires/${questionnaireId}/questions`);
    } catch (err) {
      console.error('Error saving question:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving the question');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if options are needed based on question type
  const showOptions = ['single_choice', 'multiple_choice', 'rating', 'scale'].includes(formData.type);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Question' : 'Add New Question'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Text */}
          <div className="col-span-2">
            <label htmlFor="text" className="block text-gray-700 font-medium mb-2">
              Question Text *
            </label>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Question Type */}
          <div>
            <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
              Question Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="text">Text</option>
              <option value="single_choice">Single Choice</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="rating">Rating</option>
              <option value="yes_no">Yes/No</option>
              <option value="scale">Scale</option>
              <option value="date">Date</option>
            </select>
          </div>

          {/* Order Number */}
          <div>
            <label htmlFor="order_num" className="block text-gray-700 font-medium mb-2">
              Order Number
            </label>
            <input
              type="number"
              id="order_num"
              name="order_num"
              value={formData.order_num}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Scoring Weight */}
          <div>
            <label htmlFor="scoring_weight" className="block text-gray-700 font-medium mb-2">
              Scoring Weight
            </label>
            <input
              type="number"
              id="scoring_weight"
              name="scoring_weight"
              value={formData.scoring_weight}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Required Checkbox */}
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                name="required"
                checked={formData.required}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="required" className="ml-2 block text-gray-700">
                Required
              </label>
            </div>
          </div>

          {/* Options (for choice-based questions) */}
          {showOptions && (
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Options</label>

              <div className="mb-2 flex">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter option text"
                />
                <button
                  type="button"
                  onClick={addOption}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>

              {formData.options.length > 0 ? (
                <ul className="border border-gray-300 rounded-md divide-y divide-gray-300">
                  {formData.options.map((option: any, index: number) => (
                    <li key={index} className="flex items-center justify-between p-3">
                      <span>
                        {option.value}. {option.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No options added yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
              ? 'Update Question'
              : 'Add Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
