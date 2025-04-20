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
  Search,
  Mail,
  Bell,
  Settings,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Clock,
  Calendar,
  Send,
  AlertTriangle,
  FileText,
  BarChart3,
  User,
  Users
} from 'lucide-react';
import api from '@/services/api';

type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'response' | 'high_risk' | 'invitation' | 'password_reset' | 'custom';
  created_at: string;
  updated_at?: string;
  is_active: boolean;
};

type NotificationLog = {
  id: number;
  template_id: number;
  template_name: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sent_at: string;
  error_message?: string;
};

const NotificationsPage = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('templates');

  // Notification settings state
  const [notifyNewResponse, setNotifyNewResponse] = useState(true);
  const [notifyHighRisk, setNotifyHighRisk] = useState(true);
  const [notifyNewUser, setNotifyNewUser] = useState(true);
  const [notifyPasswordReset, setNotifyPasswordReset] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const templatesResponse = await api.notifications.getTemplates();
        // const logsResponse = await api.notifications.getLogs();

        // Mock data for demonstration
        const mockTemplates: EmailTemplate[] = [
          {
            id: 1,
            name: 'Welcome Email',
            subject: 'Welcome to our platform!',
            body: 'Dear {{name}},\n\nWelcome to our mental health assessment platform. We\'re glad to have you on board.\n\nBest regards,\nThe Team',
            type: 'welcome',
            created_at: '2023-01-15T10:30:00Z',
            updated_at: '2023-03-20T14:45:00Z',
            is_active: true
          },
          {
            id: 2,
            name: 'New Response Notification',
            subject: 'New questionnaire response received',
            body: 'Dear {{name}},\n\nA new response has been submitted for the questionnaire "{{questionnaire_title}}".\n\nPatient: {{patient_email}}\nScore: {{score}}\nRisk Level: {{risk_level}}\n\nPlease log in to view the full response.\n\nBest regards,\nThe Team',
            type: 'response',
            created_at: '2023-02-10T09:15:00Z',
            is_active: true
          },
          {
            id: 3,
            name: 'High Risk Alert',
            subject: 'ALERT: High Risk Response Detected',
            body: 'Dear {{name}},\n\nA high-risk response has been detected for the questionnaire "{{questionnaire_title}}".\n\nPatient: {{patient_email}}\nScore: {{score}}\nRisk Level: {{risk_level}}\n\nPlease review this response as soon as possible.\n\nBest regards,\nThe Team',
            type: 'high_risk',
            created_at: '2023-02-15T11:30:00Z',
            updated_at: '2023-04-05T16:20:00Z',
            is_active: true
          },
          {
            id: 4,
            name: 'User Invitation',
            subject: 'You\'ve been invited to join our platform',
            body: 'Dear {{name}},\n\nYou have been invited to join our mental health assessment platform.\n\nPlease click the link below to create your account:\n{{invitation_link}}\n\nBest regards,\nThe Team',
            type: 'invitation',
            created_at: '2023-03-05T14:20:00Z',
            is_active: true
          },
          {
            id: 5,
            name: 'Password Reset',
            subject: 'Password Reset Request',
            body: 'Dear {{name}},\n\nWe received a request to reset your password. Please click the link below to reset your password:\n{{reset_link}}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe Team',
            type: 'password_reset',
            created_at: '2023-03-10T09:45:00Z',
            is_active: true
          },
          {
            id: 6,
            name: 'Monthly Summary',
            subject: 'Your Monthly Response Summary',
            body: 'Dear {{name}},\n\nHere is your monthly summary of questionnaire responses:\n\nTotal Responses: {{total_responses}}\nHigh Risk Responses: {{high_risk_responses}}\nAverage Score: {{average_score}}\n\nPlease log in to view more detailed statistics.\n\nBest regards,\nThe Team',
            type: 'custom',
            created_at: '2023-04-12T16:45:00Z',
            is_active: false
          }
        ];

        const mockLogs: NotificationLog[] = [
          {
            id: 1,
            template_id: 3,
            template_name: 'High Risk Alert',
            recipient: 'doctor@example.com',
            subject: 'ALERT: High Risk Response Detected',
            status: 'sent',
            sent_at: '2023-04-15T11:30:00Z'
          },
          {
            id: 2,
            template_id: 2,
            template_name: 'New Response Notification',
            recipient: 'therapist@example.com',
            subject: 'New questionnaire response received',
            status: 'sent',
            sent_at: '2023-04-16T14:45:00Z'
          },
          {
            id: 3,
            template_id: 1,
            template_name: 'Welcome Email',
            recipient: 'newuser@example.com',
            subject: 'Welcome to our platform!',
            status: 'sent',
            sent_at: '2023-04-18T09:20:00Z'
          },
          {
            id: 4,
            template_id: 4,
            template_name: 'User Invitation',
            recipient: 'invite@example.com',
            subject: 'You\'ve been invited to join our platform',
            status: 'pending',
            sent_at: '2023-04-20T10:15:00Z'
          },
          {
            id: 5,
            template_id: 3,
            template_name: 'High Risk Alert',
            recipient: 'clinician@example.com',
            subject: 'ALERT: High Risk Response Detected',
            status: 'failed',
            sent_at: '2023-04-22T15:30:00Z',
            error_message: 'Invalid email address'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setTemplates(mockTemplates);
        setFilteredTemplates(mockTemplates);
        setLogs(mockLogs);
        setFilteredLogs(mockLogs);
      } catch (err) {
        setError('Failed to load notification data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search for templates
  useEffect(() => {
    let filtered = [...templates];

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(template => template.type === typeFilter);
    }

    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        template =>
          template.name.toLowerCase().includes(query) ||
          template.subject.toLowerCase().includes(query) ||
          template.body.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, typeFilter, searchQuery]);

  // Apply filters and search for logs
  useEffect(() => {
    let filtered = [...logs];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.template_name.toLowerCase().includes(query) ||
          log.recipient.toLowerCase().includes(query) ||
          log.subject.toLowerCase().includes(query)
      );
    }

    setFilteredLogs(filtered);
  }, [logs, statusFilter, searchQuery]);

  // Handle template status toggle
  const handleToggleStatus = async (templateId: number, currentStatus: boolean) => {
    try {
      // In a real implementation, this would call the API
      // await api.notifications.updateTemplateStatus(templateId, !currentStatus);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setTemplates(templates.map(template =>
        template.id === templateId ? { ...template, is_active: !currentStatus } : template
      ));

      alert(`Template ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      setError('Failed to update template status');
    }
  };

  // Handle template deletion
  const handleDeleteTemplate = async (templateId: number) => {
    if (!window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real implementation, this would call the API
      // await api.notifications.deleteTemplate(templateId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setTemplates(templates.filter(template => template.id !== templateId));

      alert('Template deleted successfully');
    } catch (err) {
      setError('Failed to delete template');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading notification data..." />
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
          <h1 className="text-2xl font-bold text-gray-800">Email Notifications</h1>
          <p className="text-gray-600">Manage email templates and notification settings</p>
        </div>

        <Button
          variant="primary"
          onClick={() => router.push('/notifications/templates/create')}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="logs">Notification Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="welcome">Welcome</option>
                  <option value="response">Response</option>
                  <option value="high_risk">High Risk</option>
                  <option value="invitation">Invitation</option>
                  <option value="password_reset">Password Reset</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">No templates found</h2>
                <p className="text-gray-500 mb-6">
                  {searchQuery || typeFilter !== 'all'
                    ? 'No templates match your search criteria.'
                    : 'You haven\'t created any email templates yet.'}
                </p>
                {!searchQuery && typeFilter === 'all' && (
                  <Button
                    variant="primary"
                    onClick={() => router.push('/notifications/templates/create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Template
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                              template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {template.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Type: {template.type.replace('_', ' ').charAt(0).toUpperCase() + template.type.replace('_', ' ').slice(1)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3"
                            onClick={() => router.push(`/notifications/templates/${template.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            className={template.is_active ? 'bg-red-600 text-white hover:bg-red-700 transition-colors text-sm py-1 px-3' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1 px-3'}
                            onClick={() => handleToggleStatus(template.id, template.is_active)}
                          >
                            {template.is_active ? (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button
                            className="bg-red-600 text-white hover:bg-red-700 transition-colors text-sm py-1 px-3"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Subject</h4>
                        <p className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3">{template.subject}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Body Preview</h4>
                        <div className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3 whitespace-pre-line line-clamp-3">
                          {template.body}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                        {template.updated_at && (
                          <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="sent">Sent</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">No notification logs found</h2>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No logs match your search criteria.'
                    : 'No notification logs are available yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sent At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{log.template_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{log.recipient}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 truncate max-w-xs">{log.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.status === 'sent'
                              ? 'bg-green-100 text-green-800'
                              : log.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                          {log.status === 'failed' && log.error_message && (
                            <div className="text-xs text-red-500 mt-1">{log.error_message}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.sent_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredLogs.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredLogs.length} of {logs.length} logs
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
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure email sender settings.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="sender-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Sender Name
                    </label>
                    <Input
                      id="sender-name"
                      type="text"
                      value="Mental Health Assessment Platform"
                      onChange={() => {}}
                    />
                  </div>

                  <div>
                    <label htmlFor="sender-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Sender Email
                    </label>
                    <Input
                      id="sender-email"
                      type="email"
                      value="notifications@example.com"
                      onChange={() => {}}
                    />
                  </div>

                  <div>
                    <label htmlFor="reply-to" className="block text-sm font-medium text-gray-700 mb-1">
                      Reply-To Email
                    </label>
                    <Input
                      id="reply-to"
                      type="email"
                      value="support@example.com"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Triggers</h3>
                <p className="text-gray-600 mb-4">
                  Configure when notifications are sent.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-new-response"
                      checked={notifyNewResponse}
                      onChange={(e) => setNotifyNewResponse(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-new-response" className="ml-2 block text-sm text-gray-700">
                      Send notification for new questionnaire responses
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-high-risk"
                      checked={notifyHighRisk}
                      onChange={(e) => setNotifyHighRisk(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-high-risk" className="ml-2 block text-sm text-gray-700">
                      Send notification for high-risk responses
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-new-user"
                      checked={notifyNewUser}
                      onChange={(e) => setNotifyNewUser(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-new-user" className="ml-2 block text-sm text-gray-700">
                      Send welcome email to new users
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-password-reset"
                      checked={notifyPasswordReset}
                      onChange={(e) => setNotifyPasswordReset(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-password-reset" className="ml-2 block text-sm text-gray-700">
                      Send password reset emails
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Footer</h3>
                <p className="text-gray-600 mb-4">
                  Configure the footer that appears in all emails.
                </p>

                <div>
                  <label htmlFor="email-footer" className="block text-sm font-medium text-gray-700 mb-1">
                    Footer Text
                  </label>
                  <TextArea
                    id="email-footer"
                    rows={4}
                    value="© 2023 Mental Health Assessment Platform. All rights reserved.\nThis email was sent to {{recipient_email}}. If you believe you received this email in error, please contact support@example.com."
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // In a real implementation, this would save the settings to the API
                  alert('Settings saved successfully');
                }}
              >
                Save Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
