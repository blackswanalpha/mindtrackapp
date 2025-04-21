'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Eye,
  Edit,
  Trash2,
  List,
  QrCode,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Globe,
  BookTemplate,
  Clock,
  Calendar,
  BarChart2
} from 'lucide-react';
import api from '@/services/api';
import { Card, Button, Loading, Alert, Badge, Input } from '@/components/common';

type Questionnaire = {
  id: number;
  title: string;
  description: string;
  type: string;
  category?: string;
  is_active: boolean;
  is_public: boolean;
  is_template?: boolean;
  created_at: string;
  updated_at?: string;
  estimated_time?: number;
  response_count?: number;
};

const QuestionnaireList: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, active, public, templates
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'type'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Fetch questionnaires
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let params: any = {};

        // Apply filters
        if (filter === 'active') {
          params = { is_active: true };
        } else if (filter === 'public') {
          params = { is_public: true };
        } else if (filter === 'templates') {
          params = { is_template: true };
        }

        const response = await api.questionnaires.getAll(params);

        // Ensure response.questionnaires is an array
        const questionnairesData = Array.isArray(response)
          ? response
          : (response.questionnaires || []);

        // Add mock response count for demo purposes
        const enhancedData = questionnairesData.map((q: any) => ({
          ...q,
          response_count: Math.floor(Math.random() * 100)
        }));

        setQuestionnaires(enhancedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questionnaires');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionnaires();
  }, [filter]);

  // Handle delete questionnaire
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this questionnaire?')) {
      return;
    }

    try {
      setIsDeleting(id);
      await api.questionnaires.delete(id);
      // Remove deleted questionnaire from state
      setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete questionnaire');
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle copy QR code
  const handleCopyQRCode = async (id: number) => {
    try {
      // In a real implementation, this would generate and copy a QR code URL
      const url = `${window.location.origin}/respond/questionnaires/${id}`;
      await navigator.clipboard.writeText(url);
      alert('QR code URL copied to clipboard!');
    } catch (err) {
      setError('Failed to copy QR code URL');
    }
  };

  // Sort functionality is implemented but UI controls are not shown in this version
  // This function would be used if we add sort controls to the UI
  const _handleSortChange = (field: 'title' | 'created_at' | 'type') => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort questionnaires
  const filteredAndSortedQuestionnaires = useMemo(() => {
    // First filter by search query
    let filtered = questionnaires;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = questionnaires.filter(q =>
        q.title.toLowerCase().includes(query) ||
        (q.description && q.description.toLowerCase().includes(query))
      );
    }

    // Then sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'created_at') {
        return sortOrder === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'type') {
        return sortOrder === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
      return 0;
    });
  }, [questionnaires, searchQuery, sortBy, sortOrder]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="large" message="Loading questionnaires..." />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert
        type="error"
        message={error}
        className="mb-4"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <FileText className="h-7 w-7 mr-3 text-indigo-600" />
            Questionnaires
          </h2>
          <p className="text-gray-600">Create and manage your assessment questionnaires</p>
        </div>

        <Link href="/questionnaires/create">
          <Button variant="primary" className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search questionnaires..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'light'}
              onClick={() => setFilter('all')}
              className="flex items-center"
            >
              <List className="h-4 w-4 mr-1" />
              All
            </Button>

            <Button
              variant={filter === 'active' ? 'primary' : 'light'}
              onClick={() => setFilter('active')}
              className="flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Active
            </Button>

            <Button
              variant={filter === 'public' ? 'primary' : 'light'}
              onClick={() => setFilter('public')}
              className="flex items-center"
            >
              <Globe className="h-4 w-4 mr-1" />
              Public
            </Button>

            <Button
              variant={filter === 'templates' ? 'primary' : 'light'}
              onClick={() => setFilter('templates')}
              className="flex items-center"
            >
              <BookTemplate className="h-4 w-4 mr-1" />
              Templates
            </Button>
          </div>
        </div>
      </div>

      {/* Questionnaire Cards */}
      {filteredAndSortedQuestionnaires.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No questionnaires found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first questionnaire'}
            </p>
            {!searchQuery && (
              <Link href="/questionnaires/create">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Questionnaire
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAndSortedQuestionnaires.map((questionnaire, index) => (
              <motion.div
                key={questionnaire.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                  {/* Card Header */}
                  <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                        {questionnaire.title}
                      </h3>
                      <div className="flex space-x-1">
                        {questionnaire.is_active && (
                          <Badge variant="success" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                        {!questionnaire.is_active && (
                          <Badge className="flex items-center bg-gray-100 text-gray-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                        {questionnaire.is_public && (
                          <Badge variant="info" className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {questionnaire.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-grow">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 mr-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="text-sm font-medium">
                            {questionnaire.type.charAt(0).toUpperCase() + questionnaire.type.slice(1)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-100 mr-3">
                          <BarChart2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Responses</p>
                          <p className="text-sm font-medium">{questionnaire.response_count || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-purple-100 mr-3">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Est. Time</p>
                          <p className="text-sm font-medium">{questionnaire.estimated_time || '—'} min</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-amber-100 mr-3">
                          <Calendar className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-sm font-medium">
                            {new Date(questionnaire.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/questionnaires/${questionnaire.id}`}>
                        <Button variant="light" size="small" className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>

                      <Link href={`/questionnaires/${questionnaire.id}/edit`}>
                        <Button variant="light" size="small" className="flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>

                      <Link href={`/questionnaires/${questionnaire.id}/questions`}>
                        <Button variant="light" size="small" className="flex items-center">
                          <List className="h-4 w-4 mr-1" />
                          Questions
                        </Button>
                      </Link>

                      <Button
                        variant="light"
                        size="small"
                        className="flex items-center"
                        onClick={() => handleCopyQRCode(questionnaire.id)}
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        QR Code
                      </Button>

                      <Button
                        variant="light"
                        size="small"
                        className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(questionnaire.id)}
                        disabled={isDeleting === questionnaire.id}
                      >
                        {isDeleting === questionnaire.id ? (
                          <>
                            <Loading size="small" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionnaireList;
