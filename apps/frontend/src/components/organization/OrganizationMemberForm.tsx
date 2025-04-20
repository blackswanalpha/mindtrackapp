'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Input,
  Button,
  Alert
} from '@/components/common';
import {
  Save
} from 'lucide-react';
import api from '@/services/api';

type OrganizationMemberFormProps = {
  organizationId: number;
  initialData?: any;
  isEditing?: boolean;
};

const OrganizationMemberForm: React.FC<OrganizationMemberFormProps> = ({
  organizationId,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'member',
    status: initialData?.status || 'active',
    avatar_url: initialData?.avatar_url || '',
  });

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Fetch users for the dropdown if not editing
  useEffect(() => {
    if (!isEditing) {
      const fetchUsers = async () => {
        setIsUsersLoading(true);
        try {
          if (typeof window !== 'undefined') {
            // In a real implementation, this would fetch users not already in the organization
            const allUsers = await api.users.getAll();
            setUsers(allUsers);
          }
        } catch (err) {
          console.error('Failed to fetch users:', err);
        } finally {
          setIsUsersLoading(false);
        }
      };

      fetchUsers();
    }
  }, [isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      if (isEditing && initialData) {
        // Update existing member (only role can be updated)
        await api.organizations.updateMemberRole(
          organizationId,
          initialData.user_id,
          formData.role
        );
        setSuccess('Member updated successfully!');

        // Wait a moment to show success message
        setTimeout(() => {
          router.push(`/admin/organizations/${organizationId}/members`);
        }, 1500);
      } else {
        // Add new member
        // In a real implementation, you would select a user from a dropdown
        // For now, we'll just use the email to simulate adding a user
        const userId = 1; // This would come from the selected user

        await api.organizations.addMember(organizationId, userId, formData.role);
        setSuccess('Member added successfully!');

        // Wait a moment to show success message
        setTimeout(() => {
          router.push(`/admin/organizations/${organizationId}/members`);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the member');
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
        {isEditing ? (
          // Editing existing member - only role can be changed
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                disabled
                className="bg-gray-50"
                onChange={() => {}}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
                onChange={() => {}}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                <strong>Admin:</strong> Can manage the organization, members, and questionnaires<br />
                <strong>Member:</strong> Can create and manage questionnaires<br />
                <strong>Viewer:</strong> Can view questionnaires and responses
              </p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Input
                id="status"
                name="status"
                value={formData.status === 'active' ? 'Active' : 'Inactive'}
                disabled
                className="bg-gray-50"
                onChange={() => {}}
              />
            </div>
          </div>
        ) : (
          // Adding new member
          <div className="space-y-6">
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                User <span className="text-red-500">*</span>
              </label>
              <select
                id="user"
                name="user"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isUsersLoading}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {isUsersLoading && (
                <p className="mt-1 text-sm text-gray-500">Loading users...</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                <strong>Admin:</strong> Can manage the organization, members, and questionnaires<br />
                <strong>Member:</strong> Can create and manage questionnaires<br />
                <strong>Viewer:</strong> Can view questionnaires and responses
              </p>
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
                : 'Adding...'
              : isEditing
              ? 'Update Member'
              : 'Add Member'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationMemberForm;
