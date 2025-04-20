'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Using the (admin) layout wrapper instead of DashboardLayout component
import { BarChart3, Users, FileText, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    questionnaires: 3,
    responses: 24,
    users: 8,
    pendingResponses: 5,
    flaggedResponses: 2
  });

  // Get user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your mental health tracking platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            title="Questionnaires"
            value={stats.questionnaires}
            icon={<FileText className="h-6 w-6 text-blue-600" />}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatCard
            title="Responses"
            value={stats.responses}
            icon={<BarChart3 className="h-6 w-6 text-green-600" />}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatCard
            title="Users"
            value={stats.users}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatCard
            title="Pending"
            value={stats.pendingResponses}
            icon={<Clock className="h-6 w-6 text-amber-600" />}
            bgColor="bg-amber-50"
            textColor="text-amber-600"
          />
          <StatCard
            title="Flagged"
            value={stats.flaggedResponses}
            icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
            bgColor="bg-red-50"
            textColor="text-red-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="Create Questionnaire"
              description="Design a new mental health assessment"
              href="/questionnaires/create"
              bgColor="bg-blue-600"
            />
            <ActionCard
              title="View Responses"
              description="Check recent patient submissions"
              href="/responses"
              bgColor="bg-green-600"
            />
            <ActionCard
              title="Analytics"
              description="View insights and trends"
              href="/analytics"
              bgColor="bg-purple-600"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Questionnaires</h2>
            <div className="space-y-4">
              <RecentItem
                title="Depression Assessment"
                subtitle="Created 2 days ago"
                href="/questionnaires/1"
              />
              <RecentItem
                title="Anxiety Screening"
                subtitle="Created 5 days ago"
                href="/questionnaires/2"
              />
              <RecentItem
                title="Well-being Check"
                subtitle="Created 1 week ago"
                href="/questionnaires/3"
              />
            </div>
            <div className="mt-4 text-right">
              <Link href="/questionnaires" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Questionnaires →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Responses</h2>
            <div className="space-y-4">
              <RecentItem
                title="John Doe"
                subtitle="Completed Depression Assessment"
                href="/responses/1"
                badge={{ text: 'Flagged', color: 'bg-red-100 text-red-800' }}
              />
              <RecentItem
                title="Jane Smith"
                subtitle="Completed Anxiety Screening"
                href="/responses/2"
              />
              <RecentItem
                title="Alex Johnson"
                subtitle="Completed Well-being Check"
                href="/responses/3"
              />
            </div>
            <div className="mt-4 text-right">
              <Link href="/responses" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Responses →
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor, textColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`${bgColor} p-3 rounded-full mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  bgColor: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, href, bgColor }) => {
  return (
    <Link href={href} className="block">
      <div className={`${bgColor} rounded-lg p-6 text-white hover:shadow-lg transition-shadow`}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </Link>
  );
};

interface RecentItemProps {
  title: string;
  subtitle: string;
  href: string;
  badge?: {
    text: string;
    color: string;
  };
}

const RecentItem: React.FC<RecentItemProps> = ({ title, subtitle, href, badge }) => {
  return (
    <Link href={href} className="block hover:bg-gray-50 -mx-4 px-4 py-3 rounded-md transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-900 font-medium">{title}</p>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        {badge && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
            {badge.text}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Dashboard;
