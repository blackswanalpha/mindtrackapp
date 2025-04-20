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
  Trash2,
  User
} from 'lucide-react';
import OrganizationMemberForm from '@/components/organization/OrganizationMemberForm';
import api from '@/services/api';

const EditOrganizationMemberPage = () => {
  const { id, memberId } = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (typeof window !== 'undefined') {
          // Fetch organization
          const organizationData = await api.organizations.getById(Number(id));
          setOrganization(organizationData);

          // Fetch members
          const members = await api.organizations.getMembers(Number(id));
          const memberData = members.find((m: any) => m.id === Number(memberId));

          if (!memberData) {
            throw new Error('Member not found');
          }

          setMember(memberData);
        }
      } catch (err) {
        setError('Failed to load member data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && memberId) {
      fetchData();
    }
  }, [id, memberId]);

  const handleRemoveMember = async () => {
    if (!window.confirm('Are you sure you want to remove this member from the organization? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      if (typeof window !== 'undefined' && member) {
        await api.organizations.removeMember(Number(id), member.user_id);
        router.push(`/admin/organizations/${id}/members`);
      }
    } catch (err) {
      setError('Failed to remove member');
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading member data..." />
      </div>
    );
  }

  if (error || !organization || !member) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Member not found'} />
        <div className="mt-4">
          <Button
            variant="light"
            onClick={() => router.push(`/admin/organizations/${id}/members`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/admin/organizations/${id}/members`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Member</h1>
          <p className="text-gray-600">
            {organization.name} - {member.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <OrganizationMemberForm
              organizationId={Number(id)}
              initialData={member}
              isEditing={true}
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center mb-6">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={`${member.name}'s avatar`}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
              )}
              <h2 className="text-xl font-semibold text-center">{member.name}</h2>
              <p className="text-gray-600 text-center">{member.email}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full justify-start bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRemoveMember}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Removing...' : 'Remove from Organization'}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Member Info</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Joined</h4>
                  <p className="text-gray-700">{new Date(member.joined_at).toLocaleDateString()}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditOrganizationMemberPage;
