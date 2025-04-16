'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Button, Loading, Alert } from '@/components/common';
import { handleApiError } from '@/utils/errorHandler';
import { apiClient } from '@/lib/apiClient';

const SendEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const responseIds = searchParams.get('responses')?.split(',').map(Number) || [];
  
  const [recipients, setRecipients] = useState<any[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [formData, setFormData] = useState({
    subject: '',
    template_id: '',
    custom_message: '',
  });
  
  // Fetch recipients and email templates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch recipients (responses with email)
        if (responseIds.length > 0) {
          const recipientsRes = await apiClient.post('/responses/recipients', {
            response_ids: responseIds
          });
          setRecipients(recipientsRes.data.recipients);
        }
        
        // Fetch email templates
        const templatesRes = await apiClient.get('/email/templates');
        setEmailTemplates(templatesRes.data.templates);
        
        // Set default template if available
        if (templatesRes.data.templates.length > 0) {
          setFormData(prev => ({
            ...prev,
            template_id: templatesRes.data.templates[0].id
          }));
        }
      } catch (error) {
        const errorMessage = handleApiError(error, 'Failed to load data');
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [responseIds]);
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recipients.length === 0) {
      setError('No recipients selected');
      return;
    }
    
    setIsSending(true);
    setError('');
    setSuccess('');
    
    try {
      // Send email
      await apiClient.post('/email/send', {
        response_ids: responseIds,
        subject: formData.subject,
        template_id: formData.template_id ? Number(formData.template_id) : undefined,
        custom_message: formData.custom_message
      });
      
      setSuccess('Email sent successfully');
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/responses');
      }, 2000);
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to send email');
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Send Email</h1>
            <p className="text-gray-600 mt-1">
              Send email to questionnaire respondents
            </p>
          </div>
          
          <Button
            variant="light"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
        
        {/* Error and Success Alerts */}
        {error && (
          <Alert type="error" message={error} />
        )}
        
        {success && (
          <Alert type="success" message={success} />
        )}
        
        {/* Email Form */}
        <Card>
          {isLoading ? (
            <Loading message="Loading data..." />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Recipients */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Recipients</h2>
                  
                  {recipients.length === 0 ? (
                    <Alert
                      type="warning"
                      message="No recipients found with email addresses"
                    />
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-700 mb-2">
                        Sending to {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recipients.map((recipient, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {recipient.patient_email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Email Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                {/* Email Template */}
                <div>
                  <label htmlFor="template_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Template
                  </label>
                  <select
                    id="template_id"
                    name="template_id"
                    value={formData.template_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a template</option>
                    {emailTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Custom Message */}
                <div>
                  <label htmlFor="custom_message" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Message
                  </label>
                  <textarea
                    id="custom_message"
                    name="custom_message"
                    value={formData.custom_message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a custom message to include in the email..."
                  />
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSending}
                    disabled={recipients.length === 0 || isSending}
                  >
                    {isSending ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SendEmailPage;
