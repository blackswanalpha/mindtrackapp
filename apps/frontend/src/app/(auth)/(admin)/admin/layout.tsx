'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Building2,
  Users,
  BarChart3,
  Brain,
  FileSpreadsheet,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Calculator,
  Activity
} from 'lucide-react';

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
      active
        ? 'bg-blue-700 text-white'
        : 'text-gray-300 hover:bg-blue-800 hover:text-white'
    }`}
  >
    {icon}
    {label}
  </Link>
);

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Get user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // TEMPORARY: Create a mock user for testing
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      };
      setUser(mockUser);

      // Original authentication code (commented out)
      /*
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Get user data
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
      */
    }
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // AUTHENTICATION DISABLED
    // Just redirect to home page
    router.push('/');

    // Original logout code (commented out)
    /*
    if (typeof window !== 'undefined') {
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      router.push('/login');
    }
    */
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-blue-900 text-white ${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-blue-800 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">MindTrack</h1>
          ) : (
            <h1 className="text-xl font-bold">MT</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-blue-800"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-2">
            <li>
              <NavItem
                href="/"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label={sidebarOpen ? 'Dashboard' : ''}
                active={pathname === '/dashboard'}
              />
            </li>
            <li>
              <NavItem
                href="/admin/questionnaires"
                icon={<ClipboardList className="h-5 w-5" />}
                label={sidebarOpen ? 'Questionnaires' : ''}
                active={pathname?.startsWith('/questionnaires')}
              />
            </li>
            <li>
              <NavItem
                href="/admin/responses"
                icon={<MessageSquare className="h-5 w-5" />}
                label={sidebarOpen ? 'Responses' : ''}
                active={pathname?.startsWith('/responses')}
              />
            </li>
            <li>
              <NavItem
                href="/admin/organizations"
                icon={<Building2 className="h-5 w-5" />}
                label={sidebarOpen ? 'Organizations' : ''}
                active={pathname?.startsWith('/organizations')}
              />
            </li>
            <li>
              <NavItem
                href="/admin/users"
                icon={<Users className="h-5 w-5" />}
                label={sidebarOpen ? 'Users' : ''}
                active={pathname?.startsWith('/users')}
              />
            </li>
           
            <li>
              <NavItem
                href="/admin/analysis"
                icon={<Activity className="h-5 w-5" />}
                label={sidebarOpen ? 'Analystics' : ''}
                active={pathname?.startsWith('/admin/analysis')}
              />
            </li>
            <li>
              <NavItem
                href="/admin/ai-analysis"
                icon={<Brain className="h-5 w-5" />}
                label={sidebarOpen ? 'AI Analysis' : ''}
                active={pathname?.startsWith('/ai-analysis')}
              />
            </li>
            <li>
              <NavItem
                href="/admin/notifications"
                icon={<Bell className="h-5 w-5" />}
                label={sidebarOpen ? 'Notifications' : ''}
                active={pathname?.startsWith('/admin/notifications')}
              />
            </li>
            <li>
              <NavItem
                href="/admin/scoring"
                icon={<Calculator className="h-5 w-5" />}
                label={sidebarOpen ? 'Scoring' : ''}
                active={pathname?.startsWith('/admin/scoring')}
              />
            </li>
            <li>
              <NavItem
                href="/admin/google-forms"
                icon={<FileSpreadsheet className="h-5 w-5" />}
                label={sidebarOpen ? 'Google Forms' : ''}
                active={pathname?.startsWith('/google-forms')}
              />
            </li>
            <li>
              <NavItem
                href="/admin/settings"
                icon={<Settings className="h-5 w-5" />}
                label={sidebarOpen ? 'Settings' : ''}
                active={pathname?.startsWith('/settings')}
              />
            </li>
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 rounded-md text-gray-300 hover:bg-blue-800 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {pathname === '/'
                ? 'Dashboard'
                : pathname ? (
                    pathname.split('/').pop() ? (
                      pathname.split('/').pop()!.charAt(0).toUpperCase() +
                      pathname.split('/').pop()!.slice(1)
                    ) : ''
                  ) : ''}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.name || 'User'}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
