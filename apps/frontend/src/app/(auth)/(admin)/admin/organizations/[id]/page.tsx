'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/common';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  FileText,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building,
  Plus
} from 'lucide-react';
import api from '@/services/api';

type Organization = {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at?: string;
  member_count: number;
  questionnaire_count: number;
};

const OrganizationDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchOrganization = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const response = await api.organizations.getById(Number(id));

        // Mock data for demonstration
        const mockOrganization: Organization = {
          id: Number(id),
          name: id === '1' ? 'Mental Health Clinic' :
                id === '2' ? 'Wellness Center' :
                id === '3' ? 'Community Health Services' : 'Research Institute',
          description: 'A leading organization providing comprehensive mental health services and assessments.',
          logo_url: 'https://via.placeholder.com/150',
          website: 'https://example.org',
          address: '123 Health Street, Medical District, MD 12345',
          phone: '+1 (555) 123-4567',
          email: 'contact@example.org',
          created_at: '2023-01-15T10:30:00Z',
          updated_at: '2023-06-20T14:45:00Z',
          member_count: 24,
          questionnaire_count: 15
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setOrganization(mockOrganization);
      } catch (err) {
        setError('Failed to load organization details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrganization();
    }
  }, [id]);

  // Handle delete organization
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real implementation, this would call the API
      // await api.organizations.delete(Number(id));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      alert('Organization deleted successfully');
      router.push('/organizations');
    } catch (err) {
      setError('Failed to delete organization');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading organization details..." />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load organization'} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.push('/organizations')}>
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/organizations" className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{organization.name}</h1>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            {organization.logo_url ? (
              <img
                src={organization.logo_url}
                alt={`${organization.name} logo`}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            )}
            <div>
              <p className="text-gray-600">
                Created {new Date(organization.created_at).toLocaleDateString()}
              </p>
              {organization.updated_at && (
                <p className="text-gray-500 text-sm">
                  Last updated {new Date(organization.updated_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3"
              onClick={() => router.push(`/organizations/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 transition-colors text-sm py-1 px-3"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <h2 className="text-xl font-semibold mb-4">Organization Details</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1 text-gray-800">{organization.description || 'No description provided'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organization.email && (
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <a href={`mailto:${organization.email}`} className="mt-1 text-blue-600 hover:text-blue-800">
                            {organization.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {organization.phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                          <a href={`tel:${organization.phone}`} className="mt-1 text-blue-600 hover:text-blue-800">
                            {organization.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {organization.website && (
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Website</h3>
                          <a
                            href={organization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-blue-600 hover:text-blue-800"
                          >
                            {organization.website}
                          </a>
                        </div>
                      </div>
                    )}

                    {organization.address && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Address</h3>
                          <p className="mt-1 text-gray-800">{organization.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <h2 className="text-xl font-semibold mb-4">Statistics</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Members</h3>
                    <div className="flex items-center mt-1">
                      <Users className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-2xl font-bold text-blue-600">{organization.member_count}</p>
                    </div>
                    <Button
                      className="mt-2 w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3"
                      onClick={() => setActiveTab('members')}
                    >
                      View Members
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Questionnaires</h3>
                    <div className="flex items-center mt-1">
                      <FileText className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-2xl font-bold text-green-600">{organization.questionnaire_count}</p>
                    </div>
                    <Button
                      className="mt-2 w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3"
                      onClick={() => setActiveTab('questionnaires')}
                    >
                      View Questionnaires
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Members</h2>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => router.push(`/admin/organizations/${id}/members/invite`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][index]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {['john@example.com', 'jane@example.com', 'robert@example.com', 'emily@example.com', 'michael@example.com'][index]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {index === 0 ? 'Admin' : 'Member'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing 5 of {organization.member_count} members
              </div>
              <div className="flex space-x-2">
                <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Previous
                </Button>
                <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3">
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Questionnaires Tab */}
        <TabsContent value="questionnaires">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Questionnaires</h2>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => router.push('/admin/organizations/${id}/questionnaires/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Questionnaire
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">
                      {['Depression Assessment', 'Anxiety Screening', 'Well-being Check', 'Sleep Quality Survey', 'Stress Evaluation', 'Mental Health Checkup'][index]}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      index % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {index % 2 === 0 ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {['A standardized questionnaire for screening depression symptoms.',
                      'Evaluates anxiety levels and potential disorders.',
                      'Assesses overall mental well-being and life satisfaction.',
                      'Measures sleep quality and identifies potential sleep disorders.',
                      'Evaluates stress levels and coping mechanisms.',
                      'Comprehensive mental health assessment tool.'][index]}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Responses: {(index + 1) * 12}</span>
                    <Link
                      href={`/admin/organizations/${id}/questionnaires/${index + 1}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {organization.questionnaire_count > 6 && (
              <div className="mt-6 flex justify-center">
                <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                  View All Questionnaires
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDetailPage;
