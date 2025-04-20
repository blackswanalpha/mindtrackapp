'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Loading,
  Alert,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/common';
import {
  Plus,
  Search,
  Filter,
  Users as UsersIcon,
  UserPlus,
  Mail,
  MoreHorizontal,
  Shield,
  UserMinus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Building
} from 'lucide-react';
import api from '@/services/api';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string;
  status: 'active' | 'inactive' | 'pending';
  organizations?: { id: number; name: string; role: string }[];
};

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const response = await api.users.getAll();

        // Mock data for demonstration
        const mockUsers: User[] = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
            created_at: '2023-01-15T10:30:00Z',
            status: 'active',
            organizations: [
              { id: 1, name: 'Mental Health Clinic', role: 'admin' },
              { id: 2, name: 'Wellness Center', role: 'member' }
            ]
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg',
            created_at: '2023-02-20T14:45:00Z',
            status: 'active',
            organizations: [
              { id: 1, name: 'Mental Health Clinic', role: 'member' }
            ]
          },
          {
            id: 3,
            name: 'Robert Johnson',
            email: 'robert@example.com',
            role: 'user',
            avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg',
            created_at: '2023-03-10T09:15:00Z',
            status: 'inactive',
            organizations: []
          },
          {
            id: 4,
            name: 'Emily Davis',
            email: 'emily@example.com',
            role: 'user',
            avatar_url: 'https://randomuser.me/api/portraits/women/4.jpg',
            created_at: '2023-04-05T11:00:00Z',
            status: 'active',
            organizations: [
              { id: 2, name: 'Wellness Center', role: 'admin' }
            ]
          },
          {
            id: 5,
            name: 'Michael Wilson',
            email: 'michael@example.com',
            role: 'user',
            created_at: '2023-05-12T16:30:00Z',
            status: 'pending',
            organizations: []
          },
          {
            id: 6,
            name: 'Sarah Brown',
            email: 'sarah@example.com',
            role: 'admin',
            avatar_url: 'https://randomuser.me/api/portraits/women/6.jpg',
            created_at: '2023-06-18T13:45:00Z',
            status: 'active',
            organizations: [
              { id: 1, name: 'Mental Health Clinic', role: 'member' },
              { id: 2, name: 'Wellness Center', role: 'member' }
            ]
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...users];

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter, statusFilter, searchQuery]);

  // Handle user status toggle
  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    try {
      // In a real implementation, this would call the API
      // await api.users.updateStatus(userId, currentStatus === 'active' ? 'inactive' : 'active');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
          : user
      ));

      alert(`User ${currentStatus === 'active' ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  // Handle user role change
  const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
    try {
      // In a real implementation, this would call the API
      // await api.users.updateRole(userId, newRole);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      alert(`User role updated to ${newRole}`);
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real implementation, this would call the API
      // await api.users.delete(userId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setUsers(users.filter(user => user.id !== userId));

      alert('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600">Manage users and their access</p>
        </div>

        <Button
          variant="primary"
          onClick={() => router.push('/users/invite')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search users..."
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
                  <option value="user">User</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">No users found</h2>
                <p className="text-gray-500 mb-6">
                  {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'No users match your search criteria.'
                    : 'There are no users in the system yet.'}
                </p>
                {!searchQuery && roleFilter === 'all' && statusFilter === 'all' && (
                  <Button
                    variant="primary"
                    onClick={() => router.push('/users/invite')}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Your First User
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organizations
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
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="h-10 w-10 object-cover" />
                              ) : (
                                <span className="text-gray-600 font-medium">
                                  {user.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.organizations && user.organizations.length > 0 ? (
                            <div className="flex flex-col space-y-1">
                              {user.organizations.slice(0, 2).map((org, index) => (
                                <div key={index} className="flex items-center">
                                  <Building className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-600">{org.name}</span>
                                  <span className="text-xs text-gray-400 ml-1">({org.role})</span>
                                </div>
                              ))}
                              {user.organizations.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{user.organizations.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
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
                            <button
                              className={`${
                                user.status === 'active'
                                  ? 'text-green-500 hover:text-green-700'
                                  : 'text-red-500 hover:text-red-700'
                              }`}
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {user.status === 'active' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
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
                                  onClick={() => router.push(`/users/${user.id}`)}
                                >
                                  <Edit className="h-4 w-4 inline mr-2" />
                                  View Profile
                                </button>
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                                >
                                  <Shield className="h-4 w-4 inline mr-2" />
                                  {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                </button>
                                <button
                                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 inline mr-2" />
                                  Delete User
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

            {filteredUsers.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                <div className="flex space-x-2">
                  <Button variant="light" size="small" disabled>
                    Previous
                  </Button>
                  <Button variant="light" size="small">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Pending Invitations</h2>
              <Button
                variant="primary"
                onClick={() => router.push('/users/invite')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </div>

            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">No pending invitations</h2>
              <p className="text-gray-500 mb-6">
                There are no pending invitations at the moment.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <h2 className="text-xl font-semibold mb-6">User Settings</h2>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Default User Permissions</h3>
                <p className="text-gray-600 mb-4">
                  Configure the default permissions for new users.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="create-questionnaires"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="create-questionnaires" className="ml-2 block text-sm text-gray-700">
                      Can create questionnaires
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="view-responses"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="view-responses" className="ml-2 block text-sm text-gray-700">
                      Can view responses
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="access-ai-analysis"
                      checked={false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="access-ai-analysis" className="ml-2 block text-sm text-gray-700">
                      Can access AI analysis
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="invite-users"
                      checked={false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="invite-users" className="ml-2 block text-sm text-gray-700">
                      Can invite other users
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure authentication requirements for users.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="require-2fa"
                      checked={false}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="require-2fa" className="ml-2 block text-sm text-gray-700">
                      Require two-factor authentication
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="password-expiry"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="password-expiry" className="ml-2 block text-sm text-gray-700">
                      Password expires after 90 days
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="session-timeout"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="session-timeout" className="ml-2 block text-sm text-gray-700">
                      Session timeout after 30 minutes of inactivity
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notification Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure email notifications for users.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-new-response"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-new-response" className="ml-2 block text-sm text-gray-700">
                      Notify when new responses are received
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-high-risk"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-high-risk" className="ml-2 block text-sm text-gray-700">
                      Notify for high-risk responses
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-account-changes"
                      checked={true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-account-changes" className="ml-2 block text-sm text-gray-700">
                      Notify for account changes
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="primary">
                Save Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersPage;
