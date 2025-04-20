'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Card, 
  Button, 
  Loading, 
  Alert,
  Input
} from '@/components/common';
import { 
  Plus, 
  Search, 
  Building, 
  Users, 
  FileText,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import api from '@/services/api';

type Organization = {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  member_count: number;
  questionnaire_count: number;
};

const OrganizationsPage = () => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call the API
        // const response = await api.organizations.getAll();
        
        // Mock data for demonstration
        const mockOrganizations: Organization[] = [
          {
            id: 1,
            name: 'Mental Health Clinic',
            description: 'A leading mental health clinic providing comprehensive care',
            logo_url: 'https://via.placeholder.com/150',
            website: 'https://mentalhealthclinic.example.com',
            address: '123 Health St, Medical District, MD 12345',
            phone: '+1 (555) 123-4567',
            email: 'info@mentalhealthclinic.example.com',
            created_at: '2023-01-15T10:30:00Z',
            member_count: 24,
            questionnaire_count: 15
          },
          {
            id: 2,
            name: 'Wellness Center',
            description: 'Holistic wellness services for mind and body',
            logo_url: 'https://via.placeholder.com/150',
            website: 'https://wellnesscenter.example.com',
            address: '456 Wellness Ave, Healthy City, HC 67890',
            phone: '+1 (555) 987-6543',
            email: 'contact@wellnesscenter.example.com',
            created_at: '2023-02-20T14:45:00Z',
            member_count: 18,
            questionnaire_count: 8
          },
          {
            id: 3,
            name: 'Community Health Services',
            description: 'Providing accessible health services to the community',
            logo_url: 'https://via.placeholder.com/150',
            website: 'https://communityhealth.example.org',
            address: '789 Community Blvd, Public Town, PT 54321',
            phone: '+1 (555) 456-7890',
            email: 'help@communityhealth.example.org',
            created_at: '2023-03-10T09:15:00Z',
            member_count: 32,
            questionnaire_count: 20
          },
          {
            id: 4,
            name: 'Research Institute',
            description: 'Advancing mental health research and treatment',
            logo_url: 'https://via.placeholder.com/150',
            website: 'https://research-institute.example.edu',
            address: '101 Research Park, Academic City, AC 13579',
            phone: '+1 (555) 246-8102',
            email: 'research@institute.example.edu',
            created_at: '2023-04-05T11:00:00Z',
            member_count: 45,
            questionnaire_count: 30
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setOrganizations(mockOrganizations);
        setFilteredOrganizations(mockOrganizations);
      } catch (err) {
        setError('Failed to load organizations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrganizations(organizations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = organizations.filter(org => 
        org.name.toLowerCase().includes(query) || 
        (org.description && org.description.toLowerCase().includes(query))
      );
      setFilteredOrganizations(filtered);
    }
  }, [searchQuery, organizations]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="large" message="Loading organizations..." />
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
          <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
          <p className="text-gray-600">Manage your organizations and their members</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="primary"
            onClick={() => router.push('/admin/organizations/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Organization
          </Button>
        </div>
      </div>
      
      {filteredOrganizations.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No organizations found</h2>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'No organizations match your search criteria.' : 'You haven\'t created any organizations yet.'}
            </p>
            {!searchQuery && (
              <Button 
                variant="primary"
                onClick={() => router.push('/admin/organizations/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Organization
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <Card key={org.id} className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {org.logo_url ? (
                    <img 
                      src={org.logo_url} 
                      alt={`${org.name} logo`} 
                      className="w-12 h-12 rounded-md object-cover mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{org.name}</h2>
                    <p className="text-sm text-gray-500">
                      Created {new Date(org.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Link 
                  href={`/admin/organizations/${org.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
              
              {org.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{org.description}</p>
              )}
              
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{org.member_count} Members</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{org.questionnaire_count} Questionnaires</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationsPage;
