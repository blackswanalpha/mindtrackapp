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
  Mail,
  Send,
  User,
  FileText,
  FileText as TemplateIcon,
  Edit,
  CheckCircle,
  AlertTriangle,
  Copy,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

type Response = {
  id: number;
  questionnaire_id: number;
  patient_email: string;
  patient_name?: string;
  score?: number;
  risk_level?: string;
  unique_code: string;
};

type Questionnaire = {
  id: number;
  title: string;
};

type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  content: string;
};

const SendEmailPage = () => {
  const { id, questionnaireId, responseId } = useParams();
  const router = useRouter();

  const [response, setResponse] = useState<Response | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subject: '',
    template_id: '',
    custom_message: ''
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const responseData = await api.responses.getById(Number(responseId));
        // const questionnaireData = await api.questionnaires.getById(Number(questionnaireId));
        // const templatesData = await api.emailTemplates.getAll();

        // Mock data for demonstration
        const mockResponse: Response = {
          id: Number(responseId),
          questionnaire_id: Number(questionnaireId),
          patient_email: `patient${responseId}@example.com`,
          patient_name: `Patient ${responseId}`,
          score: Math.floor(Math.random() * 27),
          risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          unique_code: `R${questionnaireId}${responseId}${Math.floor(Math.random() * 1000)}`
        };

        const mockQuestionnaire: Questionnaire = {
          id: Number(questionnaireId),
          title: questionnaireId === '1' ? 'Depression Assessment (PHQ-9)' :
                 questionnaireId === '2' ? 'Anxiety Screening (GAD-7)' :
                 'Mental Health Questionnaire'
        };

        const mockTemplates: EmailTemplate[] = [
          {
            id: 1,
            name: 'Assessment Results',
            subject: 'Your Assessment Results',
            content: 'Dear {{patient_name}},\n\nThank you for completing the {{questionnaire_title}}. Your results have been processed, and we wanted to share them with you.\n\nYour score: {{score}}\nRisk level: {{risk_level}}\n\n{{custom_message}}\n\nYou can view your full results using your unique code: {{unique_code}}\n\nBest regards,\nThe Mental Health Team'
          },
          {
            id: 2,
            name: 'Follow-up Appointment',
            subject: 'Follow-up Appointment for Your Recent Assessment',
            content: 'Dear {{patient_name}},\n\nBased on your recent {{questionnaire_title}}, we recommend scheduling a follow-up appointment to discuss your results in more detail.\n\n{{custom_message}}\n\nYour assessment code: {{unique_code}}\n\nPlease contact us to schedule your appointment.\n\nBest regards,\nThe Mental Health Team'
          },
          {
            id: 3,
            name: 'Resources and Support',
            subject: 'Resources and Support for Your Mental Health',
            content: 'Dear {{patient_name}},\n\nThank you for completing the {{questionnaire_title}}. We wanted to provide you with some resources that might be helpful based on your responses.\n\n{{custom_message}}\n\nYou can access your full assessment results using your unique code: {{unique_code}}\n\nRemember that support is always available.\n\nBest regards,\nThe Mental Health Team'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setResponse(mockResponse);
        setQuestionnaire(mockQuestionnaire);
        setTemplates(mockTemplates);

        // Set default subject
        setFormData({
          ...formData,
          subject: `Your ${mockQuestionnaire.title} Results`
        });
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (responseId && questionnaireId) {
      fetchData();
    }
  }, [responseId, questionnaireId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle template selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setFormData({
      ...formData,
      template_id: templateId
    });

    if (templateId) {
      const selectedTemplate = templates.find(t => t.id === Number(templateId));
      if (selectedTemplate) {
        setFormData({
          ...formData,
          template_id: templateId,
          subject: selectedTemplate.subject
        });
      }
    }
  };

  // Preview email content
  const getPreviewContent = () => {
    if (!response || !questionnaire) return '';

    let content = '';

    if (formData.template_id) {
      const selectedTemplate = templates.find(t => t.id === Number(formData.template_id));
      if (selectedTemplate) {
        content = selectedTemplate.content;
      }
    }

    // If no template or custom message, show placeholder
    if (!content && !formData.custom_message) {
      return 'Select a template or enter a custom message to preview content.';
    }

    // If no template but has custom message
    if (!content && formData.custom_message) {
      content = `Dear ${response.patient_name || 'Patient'},\n\n${formData.custom_message}\n\nBest regards,\nThe Mental Health Team`;
    }

    // Replace placeholders with actual values
    content = content
      .replace(/{{patient_name}}/g, response.patient_name || 'Patient')
      .replace(/{{questionnaire_title}}/g, questionnaire.title)
      .replace(/{{score}}/g, String(response.score || 'N/A'))
      .replace(/{{risk_level}}/g, response.risk_level ? response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1) : 'N/A')
      .replace(/{{unique_code}}/g, response.unique_code)
      .replace(/{{custom_message}}/g, formData.custom_message);

    return content;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!response) return;

    if (!formData.subject.trim()) {
      setError('Subject is required');
      return;
    }

    if (!formData.template_id && !formData.custom_message.trim()) {
      setError('Please select a template or enter a custom message');
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real implementation, this would call the API
      // await api.email.send({
      //   response_ids: [Number(responseId)],
      //   subject: formData.subject,
      //   template_id: formData.template_id ? Number(formData.template_id) : undefined,
      //   custom_message: formData.custom_message
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess('Email sent successfully');

      // Redirect after a delay
      setTimeout(() => {
        router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses/${responseId}`);
      }, 2000);
    } catch (err) {
      setError('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading..." />
      </div>
    );
  }

  if (error && !response) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Failed to load data'} />
        <div className="mt-4">
          <Button variant="primary" onClick={() => router.push(`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses/${responseId}`)}>
            Back to Response
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="flex items-center mb-8">
        <Link href={`/admin/organizations/${id}/questionnaires/${questionnaireId}/responses/${responseId}`}
          className="text-blue-600 hover:text-blue-800 mr-4 transition-transform hover:scale-110"
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.9 }}>
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Send Email
            </span>
          </h1>
          <p className="text-gray-600 flex items-center flex-wrap">
            <span className="font-medium">{questionnaire?.title}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span>Response {responseId}</span>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert type="success" message={success} />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert type="error" message={error} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-500" />
                Email Message
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="bg-blue-100 p-1 rounded-md mr-2">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </span>
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter email subject"
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm transition-all duration-200"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="template_id" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="bg-purple-100 p-1 rounded-md mr-2">
                      <TemplateIcon className="h-4 w-4 text-purple-600" />
                    </span>
                    Template (Optional)
                  </label>
                  <div className="relative">
                    <select
                      id="template_id"
                      name="template_id"
                      value={formData.template_id}
                      onChange={handleTemplateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition-all duration-200 pr-10"
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="custom_message" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="bg-green-100 p-1 rounded-md mr-2">
                      <Edit className="h-4 w-4 text-green-600" />
                    </span>
                    Custom Message
                  </label>
                  <TextArea
                    id="custom_message"
                    name="custom_message"
                    value={formData.custom_message}
                    onChange={handleInputChange}
                    placeholder="Enter your custom message"
                    rows={6}
                    className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-start">
                    <AlertTriangle className="h-3 w-3 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                    <span>This will be included in the email. If you selected a template, this will replace the custom_message placeholder.</span>
                  </p>
                </motion.div>

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full py-2.5 shadow-md hover:shadow-lg transition-all duration-300 group bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSending}
                    >
                      {isSending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-500" />
                Recipient
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{response?.patient_name || 'Anonymous'}</p>
                    <p className="text-gray-600">{response?.patient_email}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Questionnaire</h3>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-gray-800 font-medium">{questionnaire?.title}</p>
                </div>
              </div>

              {response?.score !== undefined && (
                <div className="p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Score</h3>
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-gray-800 font-medium">{response.score}</p>
                  </div>
                </div>
              )}

              {response?.risk_level && (
                <div className="p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Level</h3>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      response.risk_level === 'low' ? 'bg-green-100' :
                      response.risk_level === 'medium' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      {response.risk_level === 'low' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : response.risk_level === 'medium' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      response.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                      response.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {response.risk_level.charAt(0).toUpperCase() + response.risk_level.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6"
          >
            <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-500" />
                    Preview
                  </h2>
                  <Button
                    onClick={() => window.print()}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors text-sm py-1 px-3"
                  >
                    Print Preview
                  </Button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 w-16">To:</span>
                    <span className="text-gray-800 font-medium">{response?.patient_email}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-16">Subject:</span>
                    <span className="text-gray-800 font-medium">{formData.subject || 'No subject'}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-gray-800 whitespace-pre-line">
                    {getPreviewContent()}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center mb-2">
                  <TemplateIcon className="h-4 w-4 text-gray-500 mr-1" />
                  <p className="text-sm font-medium text-gray-700">Available placeholders:</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'patient_name',
                    'questionnaire_title',
                    'score',
                    'risk_level',
                    'unique_code',
                    'custom_message'
                  ].map(placeholder => (
                    <div
                      key={placeholder}
                      className="flex items-center group cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(`{{${placeholder}}}`);
                        alert(`Copied {{${placeholder}}} to clipboard`);
                      }}
                    >
                      <div className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-mono group-hover:bg-blue-100 transition-colors duration-200 flex items-center">
                        <span>{`{{${placeholder}}}`}</span>
                        <Copy className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SendEmailPage;
