'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert,
  Input,
  TextArea
} from '@/components/common';
import {
  ArrowLeft,
  UserPlus,
  Mail,
  Users,
  Send,
  Copy,
  CheckCircle,
  Info
} from 'lucide-react';
import api from '@/services/api';

type Organization = {
  id: number;
  name: string;
  description?: string;
  type?: string;
  member_count?: number;
};

type InviteFormData = {
  emails: string;
  message: string;
  role: 'admin' | 'member' | 'viewer';
};

const InviteMembersPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<InviteFormData>({
    emails: '',
    message: '',
    role: 'member'
  });
  const [linkCopied, setLinkCopied] = useState(false);
  const [showBulkHelp, setShowBulkHelp] = useState(false);

  // Fetch organization data
  useEffect(() => {
    const fetchOrganization = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const response = await api.organizations.getById(Number(id));

        // Mock data for demonstration
        const mockOrganization = {
          id: Number(id),
          name: id === '1' ? 'Mental Health Clinic' :
                id === '2' ? 'Wellness Center' :
                id === '3' ? 'Community Health Services' : 'Research Institute',
          description: 'A healthcare organization focused on mental health services.',
          type: 'healthcare',
          member_count: 5
        };

        setOrganization(mockOrganization);
      } catch (error: any) {
        console.error('Error fetching organization:', error);
        setError(error.message || 'Failed to load organization');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrganization();
    }
  }, [id]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    // Parse and validate email addresses
    const emailList = formData.emails
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emailList.length === 0) {
      setError('Please enter at least one valid email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }

    setIsSending(true);

    try {
      // In a real implementation, this would call the API
      // const response = await api.organizations.inviteMembers(Number(id), {
      //   emails: emailList,
      //   message: formData.message,
      //   role: formData.role
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(`Invitations sent to ${emailList.length} email${emailList.length !== 1 ? 's' : ''}`);

      // Reset form
      setFormData({
        emails: '',
        message: '',
        role: 'member'
      });
    } catch (error: any) {
      console.error('Error sending invitations:', error);
      setError(error.message || 'Failed to send invitations');
    } finally {
      setIsSending(false);
    }
  };

  // Generate and copy invitation link
  const handleCopyLink = () => {
    // In a real implementation, this would generate a unique invitation link
    const inviteLink = `${window.location.origin}/join-organization/${id}?role=${formData.role}&token=sample-token-${Date.now()}`;

    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        setError('Failed to copy link to clipboard');
      });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading organization..." />
      </div>
    );
  }

  if (error && !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.push('/admin/organizations')}>
            Back to Organizations
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
          <h1 className="text-2xl font-bold text-gray-800">Invite Members</h1>
          <p className="text-gray-600">
            {organization?.name}
          </p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {success && (
        <Alert type="success" message={success} className="mb-6" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Invite by Email</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
                      Email Addresses <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => setShowBulkHelp(!showBulkHelp)}
                    >
                      Bulk invite help
                    </button>
                  </div>

                  {showBulkHelp && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-2">
                      <div className="flex">
                        <Info className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm text-blue-700">
                            You can invite multiple people at once by:
                          </p>
                          <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
                            <li>Separating email addresses with commas</li>
                            <li>Separating email addresses with semicolons</li>
                            <li>Putting each email address on a new line</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <TextArea
                    id="emails"
                    name="emails"
                    value={formData.emails}
                    onChange={handleChange}
                    placeholder="Enter email addresses (e.g., user@example.com, another@example.com)"
                    rows={4}
                    required
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
                    <option value="admin">Admin (Full access)</option>
                    <option value="member">Member (Standard access)</option>
                    <option value="viewer">Viewer (Read-only access)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.role === 'admin'
                      ? 'Admins can manage members, questionnaires, and organization settings.'
                      : formData.role === 'member'
                      ? 'Members can create and manage questionnaires and view responses.'
                      : 'Viewers can only view questionnaires and responses, but cannot make changes.'}
                  </p>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Message (Optional)
                  </label>
                  <TextArea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Add a personal message to your invitation"
                    rows={3}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <div className="mr-2"><Loading size="small" /></div>
                        Sending Invitations...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Invitations
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Invitation Options</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Share Invitation Link</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Generate a link that allows anyone to join this organization with the selected role.
                </p>
                <Button
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={handleCopyLink}
                >
                  {linkCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Invitation Link
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Organization Details</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Name</h4>
                    <p className="text-gray-700">{organization?.name}</p>
                  </div>

                  {organization?.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="text-gray-700">{organization.description}</p>
                    </div>
                  )}

                  {organization?.type && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Type</h4>
                      <p className="text-gray-700 capitalize">{organization.type}</p>
                    </div>
                  )}

                  {organization?.member_count !== undefined && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Current Members</h4>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-700">{organization.member_count}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Role Permissions</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Admin</h4>
                    <p className="text-sm text-gray-600">Full access to manage members, questionnaires, and organization settings.</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Member</h4>
                    <p className="text-sm text-gray-600">Can create and manage questionnaires and view responses.</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Viewer</h4>
                    <p className="text-sm text-gray-600">Read-only access to questionnaires and responses.</p>
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

export default InviteMembersPage;
