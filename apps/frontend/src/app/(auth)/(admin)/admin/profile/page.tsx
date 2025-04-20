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
  TabsContent,
  TextArea
} from '@/components/common';
import {
  User,
  Mail,
  Lock,
  Bell,
  Settings,
  Shield,
  Building,
  LogOut,
  Save,
  Camera,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import api from '@/services/api';

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string;
  last_login?: string;
  organizations: { id: number; name: string; role: string }[];
  preferences: {
    email_notifications: boolean;
    two_factor_auth: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
};

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const response = await api.users.getProfile();

        // Mock data for demonstration
        const mockProfile: UserProfile = {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
          created_at: '2023-01-15T10:30:00Z',
          last_login: '2023-04-22T09:15:00Z',
          organizations: [
            { id: 1, name: 'Mental Health Clinic', role: 'admin' },
            { id: 2, name: 'Wellness Center', role: 'member' }
          ],
          preferences: {
            email_notifications: true,
            two_factor_auth: false,
            theme: 'system',
            language: 'en'
          }
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setProfile(mockProfile);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validate passwords
    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      // In a real implementation, this would call the API
      // await api.users.changePassword(passwordForm);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setPasswordSuccess('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordError('Failed to change password');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // In a real implementation, this would call the API
      // await api.users.updateProfile(profile);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      alert('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // In a real implementation, this would call the API
      // await api.users.updatePreferences(profile.preferences);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      alert('Preferences updated successfully');
    } catch (err) {
      setError('Failed to update preferences');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading profile..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load profile'} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <User className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500">
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                      {profile.last_login && (
                        <p className="text-sm text-gray-500">
                          Last login: {new Date(profile.last_login).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <Input
                      id="role"
                      type="text"
                      value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      onChange={() => {}}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Your role cannot be changed from this page.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {passwordError && (
                    <Alert type="error" message={passwordError} />
                  )}

                  {passwordSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters long.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </form>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                <p className="text-gray-600 mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className={`h-5 w-5 ${profile.preferences.two_factor_auth ? 'text-green-500' : 'text-gray-400'} mr-2`} />
                    <span className="text-sm font-medium">
                      {profile.preferences.two_factor_auth ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <Button
                    className={profile.preferences.two_factor_auth ? 'bg-red-600 text-white hover:bg-red-700 transition-colors' : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'}
                    onClick={() => {
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          two_factor_auth: !profile.preferences.two_factor_auth
                        }
                      });
                    }}
                  >
                    {profile.preferences.two_factor_auth ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sessions</h3>
                <p className="text-gray-600 mb-4">
                  Manage your active sessions and sign out from other devices.
                </p>

                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Last active: Just now</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                </div>

                <Button className="bg-red-600 text-white hover:bg-red-700 transition-colors">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out From All Devices
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <form onSubmit={handleUpdatePreferences}>
              <h2 className="text-xl font-semibold mb-6">Preferences</h2>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                  <p className="text-gray-600 mb-4">
                    Configure how you receive notifications.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        checked={profile.preferences.email_notifications}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            email_notifications: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                        Receive email notifications
                      </label>
                    </div>

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
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
                  <p className="text-gray-600 mb-4">
                    Customize the appearance of the application.
                  </p>

                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      id="theme"
                      value={profile.preferences.theme}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          theme: e.target.value as 'light' | 'dark' | 'system'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
                  <p className="text-gray-600 mb-4">
                    Choose your preferred language.
                  </p>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      value={profile.preferences.language}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          language: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="organizations">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Your Organizations</h2>

            {profile.organizations.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">No organizations</h2>
                <p className="text-gray-500 mb-6">
                  You are not a member of any organizations yet.
                </p>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => router.push('/organizations')}
                >
                  Browse Organizations
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.organizations.map((org, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{org.name}</h3>
                        <p className="text-sm text-gray-500">
                          Role: {org.role.charAt(0).toUpperCase() + org.role.slice(1)}
                        </p>
                      </div>
                      <Button
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => router.push(`/organizations/${org.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <Button
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => router.push('/organizations')}
                  >
                    View All Organizations
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
