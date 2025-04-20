'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Loading,
  Alert,
  Input,
  TextArea,
  Select
} from '@/components/common';
import { Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/services/api';

type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  content: string;
};

type EmailFormProps = {
  responseId: number;
  patientEmail: string;
  patientName?: string;
  questionnaireName?: string;
  uniqueCode?: string;
  score?: number;
  riskLevel?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const EmailForm: React.FC<EmailFormProps> = ({
  responseId,
  patientEmail,
  patientName,
  questionnaireName,
  uniqueCode,
  score,
  riskLevel,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    template_id: '',
    custom_message: ''
  });
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [previewContent, setPreviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Load email templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        // Get email templates from API
        const response = await api.email.getTemplates();
        setTemplates(response.templates);

        // Set default template and subject if templates are available
        if (response.templates && response.templates.length > 0) {
          setFormData({
            ...formData,
            template_id: String(response.templates[0].id),
            subject: response.templates[0].subject
          });
        }
      } catch (err) {
        console.error('Error fetching email templates:', err);
        setError('Failed to load email templates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Update preview when form data changes
  useEffect(() => {
    updatePreview();
  }, [formData, templates]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // If template changes, update subject
    if (name === 'template_id' && value) {
      const template = templates.find(t => t.id === parseInt(value));
      if (template) {
        setFormData(prev => ({
          ...prev,
          subject: template.subject
        }));
      }
    }
  };

  // Update email preview
  const updatePreview = () => {
    if (!formData.template_id) {
      setPreviewContent('');
      return;
    }

    const template = templates.find(t => t.id === parseInt(formData.template_id));
    if (!template) {
      setPreviewContent('');
      return;
    }

    let content = template.content;

    // Replace placeholders with actual values
    content = content
      .replace(/{{patient_name}}/g, patientName || 'Patient')
      .replace(/{{questionnaire_title}}/g, questionnaireName || 'Assessment')
      .replace(/{{score}}/g, score !== undefined ? String(score) : 'N/A')
      .replace(/{{risk_level}}/g, riskLevel ? riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1) : 'N/A')
      .replace(/{{unique_code}}/g, uniqueCode || '')
      .replace(/{{custom_message}}/g, formData.custom_message);

    setPreviewContent(content);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      setError('Please enter a subject');
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      // Send email using API
      await api.email.send({
        response_ids: [responseId],
        subject: formData.subject,
        template_id: formData.template_id ? parseInt(formData.template_id) : undefined,
        custom_message: formData.custom_message
      });

      setSuccess('Email sent successfully to ' + patientEmail);

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center py-8">
          <Loading size="large" message="Loading email templates..." />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Send Email to Respondent</h2>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-4"
        />
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Mail className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Recipient</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-700">{patientEmail}</p>
            {patientName && <p className="text-sm text-gray-500">{patientName}</p>}
          </div>
        </div>

        <div className="mb-4">
          <Select
            label="Email Template"
            name="template_id"
            value={formData.template_id}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select a template' },
              ...templates.map(template => ({
                value: String(template.id),
                label: template.name
              }))
            ]}
            required
          />
        </div>

        <div className="mb-4">
          <Input
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-6">
          <TextArea
            label="Custom Message"
            name="custom_message"
            value={formData.custom_message}
            onChange={handleInputChange}
            rows={4}
            placeholder="Enter a custom message to include in the email..."
          />
        </div>

        {previewContent && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Email Preview</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="whitespace-pre-wrap text-gray-700">{previewContent}</div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <Button
              type="button"
              variant="light"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EmailForm;
