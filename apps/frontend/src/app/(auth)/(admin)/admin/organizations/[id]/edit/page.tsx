'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert
} from '@/components/common';
import {
  ArrowLeft,
  Save,
  Trash2
} from 'lucide-react';
import OrganizationForm from '@/components/organization/OrganizationForm';
import api from '@/services/api';

const EditOrganizationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          const data = await api.organizations.getById(Number(id));
          setOrganization(data);
        }
      } catch (err) {
        setError('Failed to load organization');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrganization();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        await api.organizations.delete(Number(id));
        router.push('/admin/organizations');
      }
    } catch (err) {
      setError('Failed to delete organization');
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading organization..." />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Organization not found'} />
        <div className="mt-4">
          <Button
            variant="light"
            onClick={() => router.push('/admin/organizations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/admin/organizations/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Organization</h1>
          <p className="text-gray-600">{organization.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <OrganizationForm initialData={organization} isEditing={true} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Actions</h2>

            <div className="space-y-4">
              <Button
                className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/organizations/${id}/members`)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Manage Members
              </Button>

              <Button
                className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/organizations/${id}/questionnaires`)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                View Questionnaires
              </Button>

              <Button
                className="w-full justify-start bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Organization'}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Organization Info</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="text-gray-700">{new Date(organization.created_at).toLocaleDateString()}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Members</h4>
                  <p className="text-gray-700">{organization.member_count || 0}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Questionnaires</h4>
                  <p className="text-gray-700">{organization.questionnaire_count || 0}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditOrganizationPage;
