'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

type QuestionnaireFormProps = {
  initialData?: any;
  isEditing?: boolean;
};

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'standard',
    category: initialData?.category || '',
    estimated_time: initialData?.estimated_time || '',
    is_active: initialData?.is_active ?? true,
    is_adaptive: initialData?.is_adaptive ?? false,
    is_qr_enabled: initialData?.is_qr_enabled ?? true,
    is_template: initialData?.is_template ?? false,
    is_public: initialData?.is_public ?? false,
    allow_anonymous: initialData?.allow_anonymous ?? true,
    requires_auth: initialData?.requires_auth ?? false,
    max_responses: initialData?.max_responses || '',
    expires_at: initialData?.expires_at
      ? new Date(initialData.expires_at).toISOString().split('T')[0]
      : '',
    organization_id: initialData?.organization_id || '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Format data for API
      const apiData = {
        ...formData,
        estimated_time: formData.estimated_time ? parseInt(formData.estimated_time) : undefined,
        max_responses: formData.max_responses ? parseInt(formData.max_responses) : undefined,
        organization_id: formData.organization_id ? parseInt(formData.organization_id) : undefined,
      };

      if (isEditing && initialData?.id) {
        // Update existing questionnaire
        await api.questionnaires.update(initialData.id, apiData);
      } else {
        // Create new questionnaire
        await api.questionnaires.create(apiData);
      }

      // Redirect to questionnaires list
      router.push('/questionnaires');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Questionnaire' : 'Create New Questionnaire'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="assessment">Assessment</option>
              <option value="survey">Survey</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estimated Time */}
          <div>
            <label htmlFor="estimated_time" className="block text-gray-700 font-medium mb-2">
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              id="estimated_time"
              name="estimated_time"
              value={formData.estimated_time}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Responses */}
          <div>
            <label htmlFor="max_responses" className="block text-gray-700 font-medium mb-2">
              Max Responses
            </label>
            <input
              type="number"
              id="max_responses"
              name="max_responses"
              value={formData.max_responses}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label htmlFor="expires_at" className="block text-gray-700 font-medium mb-2">
              Expiration Date
            </label>
            <input
              type="date"
              id="expires_at"
              name="expires_at"
              value={formData.expires_at}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Organization ID */}
          <div>
            <label htmlFor="organization_id" className="block text-gray-700 font-medium mb-2">
              Organization ID
            </label>
            <input
              type="number"
              id="organization_id"
              name="organization_id"
              value={formData.organization_id}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Checkboxes */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-gray-700">
                Active
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_adaptive"
                name="is_adaptive"
                checked={formData.is_adaptive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_adaptive" className="ml-2 block text-gray-700">
                Adaptive
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_qr_enabled"
                name="is_qr_enabled"
                checked={formData.is_qr_enabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_qr_enabled" className="ml-2 block text-gray-700">
                QR Code Enabled
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_template"
                name="is_template"
                checked={formData.is_template}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_template" className="ml-2 block text-gray-700">
                Template
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_public" className="ml-2 block text-gray-700">
                Public
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allow_anonymous"
                name="allow_anonymous"
                checked={formData.allow_anonymous}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allow_anonymous" className="ml-2 block text-gray-700">
                Allow Anonymous Responses
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requires_auth"
                name="requires_auth"
                checked={formData.requires_auth}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requires_auth" className="ml-2 block text-gray-700">
                Requires Authentication
              </label>
            </div>
          </div>
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
              ? 'Update Questionnaire'
              : 'Create Questionnaire'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionnaireForm;
