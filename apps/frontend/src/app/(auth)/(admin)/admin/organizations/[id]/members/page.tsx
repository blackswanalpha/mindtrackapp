'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  Button,
  Loading,
  Alert,
  Input
} from '@/components/common';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Mail,
  MoreHorizontal,
  Download,
  Upload,
  UserPlus,
  UserMinus,
  Shield,
  Edit
} from 'lucide-react';
import api from '@/services/api';

type Member = {
  id: number;
  user_id: number;
  organization_id: number;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar_url?: string;
  joined_at: string;
  status: 'active' | 'pending' | 'inactive';
};

const OrganizationMembersPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrganizationAndMembers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const orgResponse = await api.organizations.getById(Number(id));
        // const membersResponse = await api.organizations.getMembers(Number(id));

        // Mock data for demonstration
        const mockOrganization = {
          id: Number(id),
          name: id === '1' ? 'Mental Health Clinic' :
                id === '2' ? 'Wellness Center' :
                id === '3' ? 'Community Health Services' : 'Research Institute',
        };

        const mockMembers: Member[] = [
          {
            id: 1,
            user_id: 101,
            organization_id: Number(id),
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
            joined_at: '2023-01-15T10:30:00Z',
            status: 'active'
          },
          {
            id: 2,
            user_id: 102,
            organization_id: Number(id),
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'member',
            avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg',
            joined_at: '2023-02-20T14:45:00Z',
            status: 'active'
          },
          {
            id: 3,
            user_id: 103,
            organization_id: Number(id),
            name: 'Robert Johnson',
            email: 'robert@example.com',
            role: 'member',
            avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
            joined_at: '2023-03-10T09:15:00Z',
            status: 'active'
          },
          {
            id: 4,
            user_id: 104,
            organization_id: Number(id),
            name: 'Emily Davis',
            email: 'emily@example.com',
            role: 'viewer',
            avatar_url: 'https://randomuser.me/api/portraits/women/4.jpg',
            joined_at: '2023-04-05T11:00:00Z',
            status: 'active'
          },
          {
            id: 5,
            user_id: 105,
            organization_id: Number(id),
            name: 'Michael Wilson',
            email: 'michael@example.com',
            role: 'member',
            joined_at: '2023-05-12T16:30:00Z',
            status: 'pending'
          },
          {
            id: 6,
            user_id: 106,
            organization_id: Number(id),
            name: 'Sarah Brown',
            email: 'sarah@example.com',
            role: 'member',
            avatar_url: 'https://randomuser.me/api/portraits/women/6.jpg',
            joined_at: '2023-06-18T13:45:00Z',
            status: 'inactive'
          },
          {
            id: 7,
            user_id: 107,
            organization_id: Number(id),
            name: 'David Miller',
            email: 'david@example.com',
            role: 'viewer',
            avatar_url: 'https://randomuser.me/api/portraits/men/7.jpg',
            joined_at: '2023-07-22T10:15:00Z',
            status: 'active'
          },
          {
            id: 8,
            user_id: 108,
            organization_id: Number(id),
            name: 'Jennifer Taylor',
            email: 'jennifer@example.com',
            role: 'member',
            avatar_url: 'https://randomuser.me/api/portraits/women/8.jpg',
            joined_at: '2023-08-30T09:00:00Z',
            status: 'pending'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setOrganization(mockOrganization);
        setMembers(mockMembers);
        setFilteredMembers(mockMembers);
      } catch (err) {
        setError('Failed to load organization members');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrganizationAndMembers();
    }
  }, [id]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...members];

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        member =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query)
      );
    }

    setFilteredMembers(filtered);
  }, [members, roleFilter, statusFilter, searchQuery]);

  // Handle member removal
  const handleRemoveMember = async (memberId: number) => {
    if (!window.confirm('Are you sure you want to remove this member from the organization?')) {
      return;
    }

    try {
      // In a real implementation, this would call the API
      // await api.organizations.removeMember(Number(id), memberId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setMembers(members.filter(member => member.id !== memberId));

      alert('Member removed successfully');
    } catch (err) {
      setError('Failed to remove member');
    }
  };

  // Handle role change
  const handleRoleChange = async (memberId: number, newRole: 'admin' | 'member' | 'viewer') => {
    try {
      // In a real implementation, this would call the API
      // await api.organizations.updateMemberRole(Number(id), memberId, newRole);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setMembers(members.map(member =>
        member.id === memberId ? { ...member, role: newRole } : member
      ));

      alert(`Member role updated to ${newRole}`);
    } catch (err) {
      setError('Failed to update member role');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading organization members..." />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load organization'} />
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
        <Link href={`/admin/organizations/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Members</h1>
          <p className="text-gray-600">
            {organization.name}
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => {/* Export functionality */}}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => {/* Import functionality */}}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={() => router.push(`/admin/organizations/${id}/members/invite`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No members found</h2>
            <p className="text-gray-500 mb-6">
              {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'No members match your search criteria.'
                : 'This organization doesn\'t have any members yet.'}
            </p>
            {!searchQuery && roleFilter === 'all' && statusFilter === 'all' && (
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => router.push(`/admin/organizations/${id}/members/invite`)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Your First Member
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt={member.name} className="h-10 w-10 object-cover" />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : member.role === 'member'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : member.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => {/* Send email */}}
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <div className="relative group">
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            title="More Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <button
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleRoleChange(member.id, 'admin')}
                              disabled={member.role === 'admin'}
                            >
                              <Shield className="h-4 w-4 inline mr-2" />
                              Make Admin
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleRoleChange(member.id, 'member')}
                              disabled={member.role === 'member'}
                            >
                              <Edit className="h-4 w-4 inline mr-2" />
                              Change to Member
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleRoleChange(member.id, 'viewer')}
                              disabled={member.role === 'viewer'}
                            >
                              <Edit className="h-4 w-4 inline mr-2" />
                              Change to Viewer
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <UserMinus className="h-4 w-4 inline mr-2" />
                              Remove Member
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredMembers.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredMembers.length} of {members.length} members
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
        )}
      </Card>
    </div>
  );
};

export default OrganizationMembersPage;
