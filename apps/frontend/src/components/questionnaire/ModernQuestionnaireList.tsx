'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Search,
  Filter,
  ClipboardList,
  CheckCircle,
  XCircle,
  Globe,
  Lock,
  Calendar,
  Users,
  BarChart2,
  Edit,
  Trash2,
  Copy,
  Eye,
  SortAsc,
  SortDesc,
  Clock,
  Tag,
  QrCode,
  ChevronRight,
  MoreHorizontal,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { ModernCard, ModernButton, Input } from '@/components/common';
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

const ModernQuestionnaireList: React.FC = () => {
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
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Use intersection observer for animations
  const [listRef, listInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

        const response = await api.questionnaires.getAll(params);
        setQuestionnaires(response);

        // Extract all unique tags
        const allTags = response.reduce((tags: string[], q: Questionnaire) => {
          if (q.tags && Array.isArray(q.tags)) {
            return [...tags, ...q.tags.filter(tag => !tags.includes(tag))];
          }
          return tags;
        }, []);

        setAvailableTags(allTags);
      } catch (err) {
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
        return 'bg-primary-100 text-primary-800';
      case 'survey':
        return 'bg-success-100 text-success-800';
      case 'feedback':
        return 'bg-secondary-100 text-secondary-800';
      case 'screening':
        return 'bg-accent-100 text-accent-800';
      case 'intake':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  // Handle duplicate questionnaire
  const handleDuplicate = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (window.confirm('Are you sure you want to duplicate this questionnaire?')) {
      try {
        // Check if the duplicate method exists
        if (typeof api.questionnaires.duplicate === 'function') {
          const duplicated = await api.questionnaires.duplicate(id);
          // Refresh the list
          const response = await api.questionnaires.getAll();
          setQuestionnaires(response);
          alert(`Questionnaire duplicated successfully with ID: ${duplicated.id}`);
        } else {
          // Fallback if the method doesn't exist
          alert('Duplicate functionality is not implemented yet');
        }
      } catch (err) {
        alert('Failed to duplicate questionnaire');
      }
    }
  };

  // Handle delete questionnaire
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (window.confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      try {
        await api.questionnaires.delete(id);
        // Remove from state
        setQuestionnaires(prev => prev.filter(q => q.id !== id));
        alert('Questionnaire deleted successfully');
      } catch (err) {
        alert('Failed to delete questionnaire');
      }
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-neutral-600 font-body">Loading questionnaires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ModernCard className="p-6 border-l-4 border-error-500">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-error-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-error-700 font-medium">
              {error}
            </p>
          </div>
        </div>
      </ModernCard>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and filters */}
      <ModernCard className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Search */}
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                type="text"
                placeholder="Search questionnaires..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-neutral-50 border-neutral-200 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
              />
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {currentSort.direction === 'asc' ? (
                  <SortAsc className="h-5 w-5 text-neutral-400" />
                ) : (
                  <SortDesc className="h-5 w-5 text-neutral-400" />
                )}
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
                className="pl-10 w-full bg-neutral-50 border-neutral-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          <ModernButton
            variant={showFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="h-4 w-4" />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </ModernButton>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-neutral-200">
                <div className="flex flex-wrap gap-3 mb-6">
                  <ModernButton
                    variant={activeFilter === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                  >
                    All
                  </ModernButton>
                  <ModernButton
                    variant={activeFilter === 'active' ? 'success' : 'outline'}
                    size="sm"
                    icon={<CheckCircle className="h-4 w-4" />}
                    onClick={() => setActiveFilter('active')}
                  >
                    Active
                  </ModernButton>
                  <ModernButton
                    variant={activeFilter === 'inactive' ? 'danger' : 'outline'}
                    size="sm"
                    icon={<XCircle className="h-4 w-4" />}
                    onClick={() => setActiveFilter('inactive')}
                  >
                    Inactive
                  </ModernButton>
                  <ModernButton
                    variant={activeFilter === 'public' ? 'secondary' : 'outline'}
                    size="sm"
                    icon={<Globe className="h-4 w-4" />}
                    onClick={() => setActiveFilter('public')}
                  >
                    Public
                  </ModernButton>
                  <ModernButton
                    variant={activeFilter === 'private' ? 'secondary' : 'outline'}
                    size="sm"
                    icon={<Lock className="h-4 w-4" />}
                    onClick={() => setActiveFilter('private')}
                  >
                    Private
                  </ModernButton>
                  <ModernButton
                    variant={activeFilter === 'templates' ? 'secondary' : 'outline'}
                    size="sm"
                    icon={<Copy className="h-4 w-4" />}
                    onClick={() => setActiveFilter('templates')}
                  >
                    Templates
                  </ModernButton>
                </div>

                {/* Tags filter */}
                {availableTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Filter by Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedTags.includes(tag)
                              ? 'bg-primary-100 text-primary-800 border border-primary-300'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200 hover:bg-neutral-200'
                          } transition-colors`}
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
      </ModernCard>

      {/* Results count */}
      <div className="text-sm text-neutral-600 font-medium">
        Showing {filteredQuestionnaires.length} of {questionnaires.length} questionnaires
      </div>

      {/* Questionnaires list */}
      {filteredQuestionnaires.length === 0 ? (
        <ModernCard className="p-12 text-center">
          <ClipboardList className="h-16 w-16 text-neutral-400 mx-auto mb-6" />
          <h3 className="text-xl font-display font-semibold text-neutral-900 mb-3">No questionnaires found</h3>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            {searchQuery || selectedTags.length > 0 || activeFilter !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Create your first questionnaire to get started.'}
          </p>
          <ModernButton
            variant="primary"
            size="lg"
            icon={<Plus className="h-5 w-5" />}
            onClick={() => router.push('/admin/questionnaires/create')}
          >
            Create Questionnaire
          </ModernButton>
        </ModernCard>
      ) : (
        <motion.div
          ref={listRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={listInView ? "visible" : "hidden"}
        >
          {filteredQuestionnaires.map((questionnaire) => (
            <motion.div
              key={questionnaire.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              onClick={() => router.push(`/admin/questionnaires/${questionnaire.id}`)}
            >
              <ModernCard className="h-full p-0 overflow-hidden cursor-pointer">
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {questionnaire.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                          Inactive
                        </span>
                      )}

                      {questionnaire.is_public ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-800">
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                          Private
                        </span>
                      )}

                      {questionnaire.is_template && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                          Template
                        </span>
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => toggleDropdown(questionnaire.id, e)}
                        className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
                      >
                        <MoreHorizontal className="h-5 w-5 text-neutral-500" />
                      </button>

                      {activeDropdown === questionnaire.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-neutral-200">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              router.push(`/admin/questionnaires/${questionnaire.id}/edit`);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>

                          <button
                            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              window.open(`/respond/questionnaires/${questionnaire.id}`, '_blank');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </button>

                          <button
                            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                            onClick={(e) => handleDuplicate(questionnaire.id, e)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </button>

                          <button
                            className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 flex items-center"
                            onClick={(e) => handleDelete(questionnaire.id, e)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-semibold text-neutral-900 mb-2 line-clamp-1">
                    {questionnaire.title}
                  </h3>

                  <p className="text-neutral-600 mb-4 line-clamp-2 text-sm">
                    {questionnaire.description}
                  </p>

                  {/* Type and Category */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {questionnaire.type && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(questionnaire.type)}`}>
                        {questionnaire.type}
                      </span>
                    )}

                    {questionnaire.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                        {questionnaire.category}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {questionnaire.tags && questionnaire.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {questionnaire.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {questionnaire.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-700">
                          +{questionnaire.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="border-t border-neutral-200 p-4 bg-neutral-50 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(questionnaire.created_at)}
                    </span>

                    {questionnaire.estimated_time && (
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {questionnaire.estimated_time} min
                      </span>
                    )}

                    {typeof questionnaire.response_count === 'number' && (
                      <span className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {questionnaire.response_count}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <ModernButton
                      variant="ghost"
                      size="sm"
                      icon={<ChevronRight className="h-4 w-4" />}
                      iconPosition="right"
                    >
                      View
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ModernQuestionnaireList;
