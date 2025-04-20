'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Input,
  TextArea,
  Button,
  Alert
} from '@/components/common';
import {
  Save
} from 'lucide-react';
import api from '@/services/api';

type OrganizationFormProps = {
  initialData?: any;
  isEditing?: boolean;
};

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    logo_url: initialData?.logo_url || '',
    website: initialData?.website || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error('Organization name is required');
      }

      if (isEditing && initialData?.id) {
        // Update existing organization
        await api.organizations.update(initialData.id, formData);
        setSuccess('Organization updated successfully!');

        // Wait a moment to show success message
        setTimeout(() => {
          router.push(`/admin/organizations/${initialData.id}`);
        }, 1500);
      } else {
        // Create new organization
        const newOrganization = await api.organizations.create(formData);
        setSuccess('Organization created successfully!');

        // Wait a moment to show success message
        setTimeout(() => {
          router.push(`/admin/organizations/${newOrganization.id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the organization');
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
          {/* Organization Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter organization name"
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
              placeholder="Enter organization description"
            />
          </div>

          {/* Logo URL */}
          <div className="md:col-span-2">
            <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <Input
              id="logo_url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              placeholder="Enter logo URL"
            />
            {formData.logo_url && (
              <div className="mt-2">
                <img
                  src={formData.logo_url}
                  alt="Organization Logo Preview"
                  className="h-16 w-16 object-contain border border-gray-200 rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                  }}
                />
              </div>
            )}
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <TextArea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              placeholder="Enter organization address"
            />
          </div>
        </div>

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
              ? 'Update Organization'
              : 'Create Organization'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationForm;
