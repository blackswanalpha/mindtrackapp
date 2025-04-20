'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Input,
  TextArea,
  Button,
  Alert,
  Card
} from '@/components/common';
import {
  Save,
  AlertTriangle,
  Info,
  Tag,
  Clock,
  Users,
  Calendar,
  Lock,
  Unlock,
  Globe,
  Building,
  CheckCircle,
  XCircle,
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react';
import api from '@/services/api';

type EnhancedQuestionnaireFormProps = {
  initialData?: any;
  isEditing?: boolean;
  onSuccess?: (questionnaire: any) => void;
};

const EnhancedQuestionnaireForm: React.FC<EnhancedQuestionnaireFormProps> = ({
  initialData,
  isEditing = false,
  onSuccess
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
    expires_at: initialData?.expires_at || '',
    organization_id: initialData?.organization_id || '',
    tags: initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags : JSON.parse(initialData.tags)) : [],
  });

  const [newTag, setNewTag] = useState('');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState(false);
  const router = useRouter();

  // Fetch organizations for the dropdown
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        if (typeof window !== 'undefined') {
          const orgs = await api.organizations.getAll();
          setOrganizations(orgs);
        }
      } catch (err) {
        console.error('Failed to fetch organizations:', err);
        // Use mock data if API fails
        setOrganizations([
          { id: 1, name: 'Mental Health Clinic' },
          { id: 2, name: 'Community Wellness Center' },
          { id: 3, name: 'University Research Department' }
        ]);
      }
    };

    fetchOrganizations();
  }, []);

  // Validate form data
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.type) {
      errors.type = 'Type is required';
    }

    if (formData.estimated_time && isNaN(Number(formData.estimated_time))) {
      errors.estimated_time = 'Estimated time must be a number';
    }

    if (formData.max_responses && isNaN(Number(formData.max_responses))) {
      errors.max_responses = 'Maximum responses must be a number';
    }

    if (formData.expires_at) {
      const expiryDate = new Date(formData.expires_at);
      if (isNaN(expiryDate.getTime())) {
        errors.expires_at = 'Invalid date format';
      } else if (expiryDate < new Date()) {
        errors.expires_at = 'Expiry date cannot be in the past';
      }
    }

    if (!formData.organization_id) {
      errors.organization_id = 'Organization is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
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

    // Mark form as touched when user makes changes
    if (!formTouched) {
      setFormTouched(true);
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  // Add a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for API
      const apiData = {
        ...formData,
        estimated_time: formData.estimated_time ? Number(formData.estimated_time) : null,
        max_responses: formData.max_responses ? Number(formData.max_responses) : null,
        organization_id: Number(formData.organization_id),
        tags: JSON.stringify(formData.tags)
      };

      let result;
      if (isEditing && initialData?.id) {
        // Update existing questionnaire
        result = await api.questionnaires.update(initialData.id, apiData);
        setSuccess('Questionnaire updated successfully!');
      } else {
        // Create new questionnaire
        result = await api.questionnaires.create(apiData);
        setSuccess('Questionnaire created successfully!');
      }

      // Call onSuccess callback if provided
      if (onSuccess && result) {
        onSuccess(result);
      }

      // Wait a moment to show success message
      setTimeout(() => {
        if (isEditing) {
          router.push(`/admin/questionnaires/${initialData.id}`);
        } else if (result?.id) {
          router.push(`/admin/questionnaires/${result.id}`);
        } else {
          router.push('/admin/questionnaires');
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the questionnaire');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle window beforeunload event to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formTouched) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formTouched]);

  return (
    <div>
      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {success && (
        <Alert type="success" message={success} className="mb-6" />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter questionnaire title"
                className={validationErrors.title ? 'border-red-300' : ''}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter questionnaire description"
                rows={3}
                className={validationErrors.description ? 'border-red-300' : ''}
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Instructions */}
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <TextArea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Enter instructions for respondents"
                rows={3}
              />
              <p className="mt-1 text-sm text-gray-500">
                These instructions will be shown to respondents before they start the questionnaire.
              </p>
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className={`w-full px-3 py-2 border ${validationErrors.type ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select a type</option>
                  <option value="assessment">Assessment</option>
                  <option value="survey">Survey</option>
                  <option value="feedback">Feedback</option>
                  <option value="screening">Screening</option>
                  <option value="intake">Intake</option>
                  <option value="custom">Custom</option>
                </select>
                {validationErrors.type && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.type}</p>
                )}
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
                  <option value="mental_health">Mental Health</option>
                  <option value="depression">Depression</option>
                  <option value="anxiety">Anxiety</option>
                  <option value="wellbeing">Wellbeing</option>
                  <option value="stress">Stress</option>
                  <option value="trauma">Trauma</option>
                  <option value="addiction">Addiction</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Estimated Time */}
            <div>
              <label htmlFor="estimated_time" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Completion Time (minutes)
              </label>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  id="estimated_time"
                  name="estimated_time"
                  type="number"
                  min="1"
                  value={formData.estimated_time}
                  onChange={handleChange}
                  placeholder="e.g., 10"
                  className={`w-32 ${validationErrors.estimated_time ? 'border-red-300' : ''}`}
                />
              </div>
              {validationErrors.estimated_time && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.estimated_time}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag: string, index: number) => (
                  <div
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <Input
                  id="newTag"
                  value={newTag}
                  onChange={handleTagInputChange}
                  placeholder="Add a tag"
                  className="rounded-r-none"
                />
                <Button
                  type="button"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors rounded-l-none"
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Tags help categorize and find your questionnaire more easily.
              </p>
            </div>
          </div>
        </Card>

        {/* Settings Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>

          <div className="space-y-6">
            {/* Organization */}
            <div>
              <label htmlFor="organization_id" className="block text-sm font-medium text-gray-700 mb-1">
                Organization <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  id="organization_id"
                  name="organization_id"
                  value={formData.organization_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${validationErrors.organization_id ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select an organization</option>
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
              {validationErrors.organization_id && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.organization_id}</p>
              )}
            </div>

            {/* Status and Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">Status</h3>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>

                {/* Public Status */}
                <div className="flex items-center">
                  <input
                    id="is_public"
                    name="is_public"
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                    Public
                  </label>
                </div>

                {/* Template Status */}
                <div className="flex items-center">
                  <input
                    id="is_template"
                    name="is_template"
                    type="checkbox"
                    checked={formData.is_template}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_template" className="ml-2 block text-sm text-gray-700">
                    Template
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">Features</h3>

                {/* QR Code */}
                <div className="flex items-center">
                  <input
                    id="is_qr_enabled"
                    name="is_qr_enabled"
                    type="checkbox"
                    checked={formData.is_qr_enabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_qr_enabled" className="ml-2 block text-sm text-gray-700">
                    Enable QR Code
                  </label>
                </div>

                {/* Adaptive Questionnaire */}
                <div className="flex items-center">
                  <input
                    id="is_adaptive"
                    name="is_adaptive"
                    type="checkbox"
                    checked={formData.is_adaptive}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_adaptive" className="ml-2 block text-sm text-gray-700">
                    Adaptive Questionnaire
                  </label>
                </div>

                <div className="flex items-center">
                  <HelpCircle className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">
                    Adaptive questionnaires change based on previous answers
                  </span>
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-700 mb-4">Access Control</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Anonymous Responses */}
                  <div className="flex items-center">
                    <input
                      id="allow_anonymous"
                      name="allow_anonymous"
                      type="checkbox"
                      checked={formData.allow_anonymous}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allow_anonymous" className="ml-2 block text-sm text-gray-700">
                      Allow Anonymous Responses
                    </label>
                  </div>

                  {/* Requires Authentication */}
                  <div className="flex items-center">
                    <input
                      id="requires_auth"
                      name="requires_auth"
                      type="checkbox"
                      checked={formData.requires_auth}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requires_auth" className="ml-2 block text-sm text-gray-700">
                      Requires Authentication
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Maximum Responses */}
                  <div>
                    <label htmlFor="max_responses" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Responses
                    </label>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <Input
                        id="max_responses"
                        name="max_responses"
                        type="number"
                        min="0"
                        value={formData.max_responses}
                        onChange={handleChange}
                        placeholder="Unlimited"
                        className={`w-32 ${validationErrors.max_responses ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {validationErrors.max_responses && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.max_responses}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Leave blank for unlimited responses
                    </p>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <Input
                        id="expires_at"
                        name="expires_at"
                        type="date"
                        value={formData.expires_at}
                        onChange={handleChange}
                        className={validationErrors.expires_at ? 'border-red-300' : ''}
                      />
                    </div>
                    {validationErrors.expires_at && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.expires_at}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Leave blank for no expiry date
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Warning Messages */}
        {formData.requires_auth && !formData.allow_anonymous && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Warning:</strong> You have enabled required authentication but disabled anonymous responses.
                  Users will need to be logged in to respond to this questionnaire.
                </p>
              </div>
            </div>
          </div>
        )}

        {formTouched && Object.keys(validationErrors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Please fix the following errors:</strong>
                </p>
                <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>
                      <button
                        type="button"
                        className="underline focus:outline-none"
                        onClick={() => {
                          const element = document.getElementById(field);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element.focus();
                          }
                        }}
                      >
                        {error}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => {
              if (formTouched) {
                if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                  router.back();
                }
              } else {
                router.back();
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EnhancedQuestionnaireForm;
