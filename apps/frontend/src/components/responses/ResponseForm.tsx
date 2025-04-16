'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Loading, Alert } from '@/components/common';
import { isValidEmail } from '@/utils/validation';
import { handleApiError } from '@/utils/errorHandler';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/useToast';

type ResponseFormProps = {
  questionnaireId: number;
  questionnaire: any;
  onSuccess?: (response: any) => void;
};

const ResponseForm: React.FC<ResponseFormProps> = ({
  questionnaireId,
  questionnaire,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const router = useRouter();
  const { showToast } = useToast();
  
  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Submit response
      const response = await apiClient.post('/responses', {
        questionnaire_id: questionnaireId,
        patient_email: email
      });
      
      // Get unique code
      const uniqueCode = response.data.response.unique_code;
      setUniqueCode(uniqueCode);
      
      // Show success message
      showToast('success', 'Response submitted successfully');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.data.response);
      } else {
        // Redirect to questionnaire page
        router.push(`/questionnaires/respond/${questionnaireId}/${uniqueCode}`);
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to submit response');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // If unique code is set, show success message
  if (uniqueCode) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <Alert
          type="success"
          message="Response submitted successfully"
          showIcon
        />
        
        <div className="mt-4">
          <p className="text-gray-700">
            Your unique response code is:
          </p>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-center text-lg mt-2">
            {uniqueCode}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Please save this code for future reference. You can use it to access your results.
          </p>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button
            variant="primary"
            onClick={() => router.push(`/questionnaires/respond/${questionnaireId}/${uniqueCode}`)}
          >
            Continue to Questionnaire
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {questionnaire.title}
      </h2>
      
      {questionnaire.description && (
        <p className="text-gray-600 mb-6">{questionnaire.description}</p>
      )}
      
      {isLoading ? (
        <Loading message="Submitting response..." />
      ) : (
        <Form onSubmit={handleSubmit} error={error}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email address"
            required
            error={emailError}
            helpText="Your email will be used to send you your results and for follow-up communications."
            autoComplete="email"
          />
          
          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
            >
              Start Questionnaire
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ResponseForm;
