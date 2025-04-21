'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Input,
  TextArea,
  Button,
  Alert
} from '@/components/common';
import {
  Save,
  AlertTriangle
} from 'lucide-react';
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
    instructions: initialData?.instructions || '',
    type: initialData?.type || 'assessment',
    category: initialData?.category || '',
    estimated_time: initialData?.estimated_time || '',
    is_active: initialData?.is_active ?? true,
    is_adaptive: initialData?.is_adaptive ?? false,
    is_qr_enabled: initialData?.is_qr_enabled ?? true,
    is_template: initialData?.is_template ?? false,
    is_public: initialData?.is_public ?? true,
    allow_anonymous: initialData?.allow_anonymous ?? true,
    requires_auth: initialData?.requires_auth ?? false,
    max_responses: initialData?.max_responses || '',
    organization_id: initialData?.organization_id || 1,
  });

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Fetch organizations for the dropdown
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        if (typeof window !== 'undefined') {
          const orgs = await api.organizations.getAll();
          // Always add 'Individual' option if not present
          const hasIndividual = orgs.some((org: any) => org.name === 'Individual');
          if (!hasIndividual) {
            orgs.unshift({ id: 0, name: 'Individual', description: 'For individual use' });
          }
          setOrganizations(orgs);
        }
      } catch (err) {
        // Fallback with at least the Individual option
        setOrganizations([
          { id: 0, name: 'Individual', description: 'For individual use' },
          { id: 1, name: 'Mental Health Clinic', description: 'Default organization' }
        ]);
      }
    };
    fetchOrganizations();
  }, []);

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
    setSuccess(null);

    try {
      // Format data for API
      const apiData = {
        ...formData,
        estimated_time_minutes: formData.estimated_time ? parseInt(formData.estimated_time) : undefined,
        max_responses: formData.max_responses ? parseInt(formData.max_responses) : undefined,
        organization_id: parseInt(formData.organization_id.toString()),
      };

      console.log('Submitting questionnaire data:', apiData);

      if (isEditing && initialData?.id) {
        // Update existing questionnaire
        const updatedQuestionnaire = await api.questionnaires.update(initialData.id, apiData);
        console.log('Questionnaire updated successfully:', updatedQuestionnaire);
        setSuccess('Questionnaire updated successfully!');

        // Wait a moment to show success message
        setTimeout(() => {
          router.push(`/admin/questionnaires/${initialData.id}`);
        }, 1500);
      } else {
        // Create new questionnaire
        const newQuestionnaire = await api.questionnaires.create(apiData);
        console.log('Questionnaire created successfully:', newQuestionnaire);
        setSuccess('Questionnaire created successfully!');

        // Wait a moment to show success message
        setTimeout(() => {
          router.push(`/admin/questionnaires/${newQuestionnaire.id}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving questionnaire:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving the questionnaire');
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter questionnaire title"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter a brief description of the questionnaire"
            />
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <TextArea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
              placeholder="Enter instructions for respondents"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="assessment">Assessment</option>
              <option value="survey">Survey</option>
              <option value="feedback">Feedback</option>
              <option value="screening">Screening</option>
              <option value="intake">Intake</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Depression">Depression</option>
              <option value="Anxiety">Anxiety</option>
              <option value="Well-being">Well-being</option>
              <option value="Sleep">Sleep</option>
              <option value="Stress">Stress</option>
              <option value="General">General</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Estimated Time */}
          <div>
            <label htmlFor="estimated_time" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time (minutes)
            </label>
            <Input
              id="estimated_time"
              name="estimated_time"
              type="number"
              min="1"
              max="120"
              value={formData.estimated_time}
              onChange={handleChange}
              placeholder="e.g., 5"
            />
          </div>

          {/* Organization */}
          <div>
            <label htmlFor="organization_id" className="block text-sm font-medium text-gray-700 mb-1">
              Organization <span className="text-red-500">*</span>
            </label>
            <select
              id="organization_id"
              name="organization_id"
              value={formData.organization_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))
              ) : (
                <option value="1">Mental Health Clinic</option>
              )}
            </select>
          </div>

          {/* Max Responses */}
          <div>
            <label htmlFor="max_responses" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Responses (optional)
            </label>
            <Input
              id="max_responses"
              name="max_responses"
              type="number"
              min="1"
              value={formData.max_responses}
              onChange={handleChange}
              placeholder="Leave blank for unlimited"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Active (available for responses)
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="is_public"
                name="is_public"
                type="checkbox"
                checked={formData.is_public}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                Public (visible to all)
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="is_qr_enabled"
                name="is_qr_enabled"
                type="checkbox"
                checked={formData.is_qr_enabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_qr_enabled" className="ml-2 block text-sm text-gray-700">
                Enable QR code
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="is_template"
                name="is_template"
                type="checkbox"
                checked={formData.is_template}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_template" className="ml-2 block text-sm text-gray-700">
                Save as template
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="allow_anonymous"
                name="allow_anonymous"
                type="checkbox"
                checked={formData.allow_anonymous}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allow_anonymous" className="ml-2 block text-sm text-gray-700">
                Allow anonymous responses
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="requires_auth"
                name="requires_auth"
                type="checkbox"
                checked={formData.requires_auth}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requires_auth" className="ml-2 block text-sm text-gray-700">
                Require authentication
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="is_adaptive"
                name="is_adaptive"
                type="checkbox"
                checked={formData.is_adaptive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_adaptive" className="ml-2 block text-sm text-gray-700">
                Enable adaptive questions
              </label>
            </div>
          </div>
        </div>

        {formData.requires_auth && !formData.allow_anonymous && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Warning: You have enabled required authentication but disabled anonymous responses.
                  Users will need to be logged in to respond to this questionnaire.
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
              ? 'Update Questionnaire'
              : 'Create Questionnaire'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionnaireForm;
