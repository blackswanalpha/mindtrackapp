'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ClipboardList, CheckCircle, XCircle, Globe, Lock, Calendar, Users,
  Edit, Trash2, Copy, Eye, SortAsc, SortDesc, Clock, Tag, PlusCircle, QrCode
} from 'lucide-react';
import { Button, Card, Input } from '@/components/common';
import api from '@/services/api';

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
  response_count?: number;
  estimated_time?: number;
  tags?: string[];
};

type SortOption = {
  field: keyof Questionnaire;
  direction: 'asc' | 'desc';
  label: string;
};

const sortOptions: SortOption[] = [
  { field: 'created_at', direction: 'desc', label: 'Newest First' },
  { field: 'created_at', direction: 'asc', label: 'Oldest First' },
  { field: 'title', direction: 'asc', label: 'Title (A-Z)' },
  { field: 'title', direction: 'desc', label: 'Title (Z-A)' },
  { field: 'response_count', direction: 'desc', label: 'Most Responses' },
  { field: 'response_count', direction: 'asc', label: 'Least Responses' },
];



const EnhancedQuestionnaireList: React.FC = () => {
  const router = useRouter();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Modal state for confirmation dialogs
  const [modal, setModal] = useState<{ type: 'delete' | 'duplicate', id: number } | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Fetch questionnaires
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let params = {};

        // Apply filters
        if (activeFilter === 'active') {
          params = { is_active: true };
        } else if (activeFilter === 'inactive') {
          params = { is_active: false };
        } else if (activeFilter === 'public') {
          params = { is_public: true };
        } else if (activeFilter === 'private') {
          params = { is_public: false };
        } else if (activeFilter === 'templates') {
          params = { is_template: true };
        }

        console.log('Fetching questionnaires with params:', params);
        const response = await api.questionnaires.getAll(params);
        console.log('Fetched questionnaires:', response);

        // Ensure we have an array of questionnaires
        const questionnaireData = Array.isArray(response) ? response : [];

        // Process the questionnaire data to ensure all required fields are present
        const processedData = questionnaireData.map(q => ({
          ...q,
          // Ensure tags is an array
          tags: q.tags ? (typeof q.tags === 'string' ? JSON.parse(q.tags) : q.tags) : [],
          // Ensure response_count is a number
          response_count: q.response_count || 0,
          // Ensure is_active is a boolean
          is_active: q.is_active !== undefined ? q.is_active : true,
          // Ensure is_public is a boolean
          is_public: q.is_public !== undefined ? q.is_public : false,
          // Ensure is_template is a boolean
          is_template: q.is_template !== undefined ? q.is_template : false,
        }));

        setQuestionnaires(processedData);

        // Extract all unique tags
        const allTags = processedData.reduce((tags: string[], q: Questionnaire) => {
          if (q.tags && Array.isArray(q.tags)) {
            return [...tags, ...q.tags.filter(tag => !tags.includes(tag))];
          }
          return tags;
        }, []);

        setAvailableTags(allTags);
      } catch (err) {
        console.error('Error fetching questionnaires:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch questionnaires');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionnaires();
  }, [activeFilter]);

  // Apply search, filters, and sorting
  useEffect(() => {
    if (!questionnaires.length) {
      setFilteredQuestionnaires([]);
      return;
    }

    let filtered = [...questionnaires];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(query) ||
        (q.description && q.description.toLowerCase().includes(query)) ||
        (q.category && q.category.toLowerCase().includes(query))
      );
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(q => {
        if (!q.tags || !Array.isArray(q.tags)) return false;
        return selectedTags.some(tag => q.tags?.includes(tag));
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[currentSort.field];
      const bValue = b[currentSort.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return currentSort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return currentSort.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return currentSort.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Handle dates stored as strings
      if (currentSort.field === 'created_at' || currentSort.field === 'updated_at') {
        const aDate = new Date(a[currentSort.field] as string);
        const bDate = new Date(b[currentSort.field] as string);
        return currentSort.direction === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      return 0;
    });

    setFilteredQuestionnaires(filtered);
  }, [questionnaires, searchQuery, currentSort, selectedTags]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get questionnaire type badge color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'assessment':
        return 'bg-blue-100 text-blue-800';
      case 'survey':
        return 'bg-green-100 text-green-800';
      case 'feedback':
        return 'bg-purple-100 text-purple-800';
      case 'screening':
        return 'bg-amber-100 text-amber-800';
      case 'intake':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle duplicate with modal
  const handleDuplicate = async (id: number) => {
    setModal({ type: 'duplicate', id });
  };

  // Handle delete with modal
  const handleDelete = async (id: number) => {
    setModal({ type: 'delete', id });
  };

  // Skeleton array for loading state
  const skeletonArray = Array(6).fill(0);

  // Skeleton loader for cards
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse p-6 flex flex-col gap-4 min-h-[180px]">
      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="flex gap-2">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  // Sticky header for controls
  const HeaderControls = (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 p-4 mb-4 rounded-t-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-grow w-full md:w-auto">
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
              aria-label="Search questionnaires"
            />
          </div>
        </div>
        {/* Sort */}
        <div className="w-full md:w-64">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {currentSort.direction === 'asc'
                ? <SortAsc className="h-5 w-5 text-gray-400" />
                : <SortDesc className="h-5 w-5 text-gray-400" />}
            </div>
            <select
              value={`${currentSort.field}-${currentSort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setCurrentSort({
                  field: field as keyof Questionnaire,
                  direction: direction as 'asc' | 'desc',
                  label: sortOptions.find(
                    opt => opt.field === field && opt.direction === direction
                  )?.label || ''
                });
              }}
              className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Sort questionnaires"
            >
              {sortOptions.map((option) => (
                <option
                  key={`${option.field}-${option.direction}`}
                  value={`${option.field}-${option.direction}`}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Filter toggle */}
        <Button
          className={`${
            showFilters
              ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          } transition-colors`}
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        {/* Create button */}
        <Button
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center"
          onClick={() => router.push('/admin/questionnaires/create')}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create
        </Button>
      </div>
      {/* Animated filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  className={`${
                    activeFilter === 'all'
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </Button>
                <Button
                  className={`${
                    activeFilter === 'active'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setActiveFilter('active')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Active
                </Button>
                <Button
                  className={`${
                    activeFilter === 'inactive'
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setActiveFilter('inactive')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Inactive
                </Button>
                <Button
                  className={`${
                    activeFilter === 'public'
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setActiveFilter('public')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Public
                </Button>
                <Button
                  className={`${
                    activeFilter === 'private'
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setActiveFilter('private')}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Private
                </Button>
                <Button
                  className={`${
                    activeFilter === 'templates'
                      ? 'bg-purple-100 text-purple-700 border-purple-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setActiveFilter('templates')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </div>
              {/* Tags filter */}
              {availableTags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Filter by Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                        } transition-colors`}
                        aria-pressed={selectedTags.includes(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Handle modal confirmation
  const handleModalConfirm = async () => {
    if (!modal) return;

    if (modal.type === 'delete') {
      try {
        await api.questionnaires.delete(modal.id);
        setQuestionnaires(prev => prev.filter(q => q.id !== modal.id));
        setModal(null);
      } catch (err) {
        console.error('Error deleting questionnaire:', err);
        alert('Failed to delete questionnaire');
      }
    } else if (modal.type === 'duplicate') {
      try {
        if (typeof api.questionnaires.duplicate === 'function') {
          await api.questionnaires.duplicate(modal.id);
          const response = await api.questionnaires.getAll();

          // Ensure we have an array of questionnaires
          const questionnaireData = Array.isArray(response) ? response : [];

          // Process the questionnaire data to ensure all required fields are present
          const processedData = questionnaireData.map(q => ({
            ...q,
            // Ensure tags is an array
            tags: q.tags ? (typeof q.tags === 'string' ? JSON.parse(q.tags) : q.tags) : [],
            // Ensure response_count is a number
            response_count: q.response_count || 0,
            // Ensure is_active is a boolean
            is_active: q.is_active !== undefined ? q.is_active : true,
            // Ensure is_public is a boolean
            is_public: q.is_public !== undefined ? q.is_public : false,
            // Ensure is_template is a boolean
            is_template: q.is_template !== undefined ? q.is_template : false,
          }));

          setQuestionnaires(processedData);
          setModal(null);
        } else {
          alert('Duplicate functionality is not implemented yet');
          setModal(null);
        }
      } catch (err) {
        console.error('Error duplicating questionnaire:', err);
        alert('Failed to duplicate questionnaire');
      }
    }
  };

  // Main render
  return (
    <div className="relative">
      {HeaderControls}
      {/* Results count */}
      <div className="text-sm text-gray-600 mb-2 px-2">
        Showing {filteredQuestionnaires.length} of {questionnaires.length} questionnaires
      </div>
      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonArray.map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      ) : filteredQuestionnaires.length === 0 ? (
        <Card className="p-8 text-center">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questionnaires found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedTags.length > 0 || activeFilter !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Create your first questionnaire to get started.'}
          </p>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mx-auto"
            onClick={() => router.push('/admin/questionnaires/create')}
          >
            Create Questionnaire
          </Button>
        </Card>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredQuestionnaires.map((questionnaire) => (
            <motion.div
              key={questionnaire.id}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 8px 32px 0 rgba(60,60,120,0.10)' }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => router.push(`/admin/questionnaires/${questionnaire.id}`)}
              tabIndex={0}
              aria-label={`View questionnaire ${questionnaire.title}`}
            >
              <div className="p-6 flex flex-col gap-2 h-full">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{questionnaire.title}</h3>
                  {/* Status badges */}
                  {questionnaire.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>
                  )}
                  {questionnaire.is_public ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Public</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Private</span>
                  )}
                  {questionnaire.is_template && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Template</span>
                  )}
                </div>
                <p className="text-gray-600 mb-2 line-clamp-2">{questionnaire.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-2">
                  {/* Type, category, date, time, responses */}
                  {questionnaire.type && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(questionnaire.type)}`}>{questionnaire.type}</span>
                  )}
                  {questionnaire.category && (
                    <span className="flex items-center"><Tag className="h-4 w-4 mr-1" />{questionnaire.category}</span>
                  )}
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{formatDate(questionnaire.created_at)}</span>
                  {questionnaire.estimated_time && (
                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1" />{questionnaire.estimated_time} min</span>
                  )}
                  {typeof questionnaire.response_count === 'number' && (
                    <span className="flex items-center"><Users className="h-4 w-4 mr-1" />{questionnaire.response_count} {questionnaire.response_count === 1 ? 'response' : 'responses'}</span>
                  )}
                </div>
                {/* Tags */}
                {questionnaire.tags && questionnaire.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {questionnaire.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{tag}</span>
                    ))}
                  </div>
                )}
                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Button
                    className="bg-primary border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors p-2"
                    aria-label="Edit questionnaire"
                    onClick={e => {e.stopPropagation();e.preventDefault();router.push(`/admin/questionnaires/${questionnaire.id}/edit`);}}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    className="bg-grey border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors p-2"
                    aria-label="Preview questionnaire"
                    onClick={e => {e.stopPropagation();e.preventDefault();window.open(`/respond/questionnaires/${questionnaire.id}`, '_blank');}}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(`/admin/questionnaires/${questionnaire.id}/qr-code`, '_blank');
                    }}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button
                    className="bg-white border border-gray-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors p-2"
                    aria-label="Duplicate questionnaire"
                    onClick={e => {e.stopPropagation();e.preventDefault();handleDuplicate(questionnaire.id);}}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    className="bg-white border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors p-2"
                    aria-label="Delete questionnaire"
                    onClick={e => {e.stopPropagation();e.preventDefault();handleDelete(questionnaire.id);}}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      {/* Modal for confirmation */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-medium mb-4">
                {modal.type === 'delete' ? 'Delete Questionnaire' : 'Duplicate Questionnaire'}
              </h3>
              <p className="text-gray-600 mb-6">
                {modal.type === 'delete'
                  ? 'Are you sure you want to delete this questionnaire? This action cannot be undone.'
                  : 'Are you sure you want to duplicate this questionnaire?'}
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  className={modal.type === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}
                  onClick={() => handleModalConfirm()}
                >
                  {modal.type === 'delete' ? 'Delete' : 'Duplicate'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedQuestionnaireList;
