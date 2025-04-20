'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FileQuestion,
  Users,
  BarChart4,
  Settings,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Search,
  Building,
  Mail,
  Brain
} from 'lucide-react';

interface ModernLayoutProps {
  children: ReactNode;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    {
      name: 'Questionnaires',
      href: '/admin/questionnaires',
      icon: FileQuestion,
      subItems: [
        { name: 'All Questionnaires', href: '/admin/questionnaires' },
        { name: 'Create New', href: '/admin/questionnaires/create' },
        { name: 'Templates', href: '/admin/questionnaires/templates' }
      ]
    },
    {
      name: 'Responses',
      href: '/admin/responses',
      icon: BarChart4,
      subItems: [
        { name: 'All Responses', href: '/admin/responses' },
        { name: 'Scoring', href: '/admin/scoring/responses' },
        { name: 'Analytics', href: '/admin/responses/analytics' }
      ]
    },
    {
      name: 'Organizations',
      href: '/admin/organizations',
      icon: Building,
      subItems: [
        { name: 'All Organizations', href: '/admin/organizations' },
        { name: 'Create New', href: '/admin/organizations/create' }
      ]
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      subItems: [
        { name: 'All Users', href: '/admin/users' },
        { name: 'Roles & Permissions', href: '/admin/users/roles' }
      ]
    },
    {
      name: 'AI Analysis',
      href: '/admin/ai-analysis',
      icon: Brain,
      subItems: [
        { name: 'Response Analysis', href: '/admin/ai-analysis' },
        { name: 'Insights', href: '/admin/ai-analysis/insights' }
      ]
    },
    {
      name: 'Notifications',
      href: '/admin/notifications',
      icon: Mail,
      subItems: [
        { name: 'Email Templates', href: '/admin/notifications/templates' },
        { name: 'Sent Emails', href: '/admin/notifications/sent' }
      ]
    },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') {
      return true;
    }
    return pathname.startsWith(href) && href !== '/admin';
  };

  // Toggle sidebar on mobile
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Toggle sidebar on desktop
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sidebar variants for animation
  const sidebarVariants = {
    open: { width: '280px', transition: { duration: 0.3 } },
    closed: { width: '80px', transition: { duration: 0.3 } }
  };

  // Mobile sidebar variants for animation
  const mobileSidebarVariants = {
    open: { x: 0, transition: { duration: 0.3 } },
    closed: { x: '-100%', transition: { duration: 0.3 } }
  };

  return (
    <div className="flex h-screen bg-neutral-50 font-body">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:block bg-white border-r border-neutral-200 h-screen overflow-y-auto"
        variants={sidebarVariants}
        animate={isSidebarOpen ? 'open' : 'closed'}
        initial="open"
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <Link href="/admin" className="text-2xl font-display font-bold text-gradient-primary">
              QuestFlow
            </Link>
          ) : (
            <Link href="/admin" className="text-2xl font-display font-bold text-gradient-primary">
              Q
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavItem
                  item={item}
                  isActive={isActive(item.href)}
                  isSidebarOpen={isSidebarOpen}
                />
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileSidebar}
            />
            <motion.aside
              className="fixed top-0 left-0 h-screen w-64 bg-white z-50 overflow-y-auto"
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-4 flex items-center justify-between">
                <Link href="/admin" className="text-2xl font-display font-bold text-gradient-primary">
                  QuestFlow
                </Link>
                <button
                  onClick={toggleMobileSidebar}
                  className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-6 px-3">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <NavItem
                        item={item}
                        isActive={isActive(item.href)}
                        isSidebarOpen={true}
                        onClick={toggleMobileSidebar}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-2 rounded-md text-neutral-500 hover:bg-neutral-100 mr-2"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-primary-500 rounded-full"></span>
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-neutral-200">
                    <div className="px-4 py-2 border-b border-neutral-200">
                      <h3 className="text-sm font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-neutral-50 border-l-4 border-primary-500">
                        <p className="text-sm font-medium">New response received</p>
                        <p className="text-xs text-neutral-500">PHQ-9 Assessment - 5 minutes ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-neutral-50">
                        <p className="text-sm font-medium">Response flagged for review</p>
                        <p className="text-xs text-neutral-500">Anxiety Assessment - 2 hours ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-neutral-50">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-neutral-500">john.doe@example.com - 1 day ago</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-neutral-200">
                      <a href="#" className="text-xs text-primary-600 hover:text-primary-800">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium hidden md:block">Admin User</span>
                  <ChevronDown className="h-4 w-4 text-neutral-500 hidden md:block" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-neutral-200">
                    <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      Settings
                    </a>
                    <div className="border-t border-neutral-200 my-1"></div>
                    <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
interface NavItemProps {
  item: {
    name: string;
    href: string;
    icon: React.ElementType;
    subItems?: { name: string; href: string }[];
  };
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, isSidebarOpen, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;

  const hasSubItems = item.subItems && item.subItems.length > 0;

  const toggleSubMenu = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <Link
        href={hasSubItems ? '#' : item.href}
        onClick={(e) => {
          if (hasSubItems) {
            toggleSubMenu(e);
          } else if (onClick) {
            onClick();
          }
        }}
        className={`flex items-center p-3 rounded-md transition-colors ${
          isActive && !hasSubItems
            ? 'bg-primary-50 text-primary-700'
            : 'text-neutral-700 hover:bg-neutral-100'
        }`}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {isSidebarOpen && (
          <>
            <span className="ml-3 flex-1">{item.name}</span>
            {hasSubItems && (
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            )}
          </>
        )}
      </Link>

      {hasSubItems && isOpen && isSidebarOpen && item.subItems && (
        <ul className="ml-6 mt-1 space-y-1">
          {item.subItems.map((subItem) => (
            <li key={subItem.name}>
              <Link
                href={subItem.href}
                onClick={onClick}
                className={`block p-2 rounded-md text-sm text-neutral-600 hover:bg-neutral-100`}
              >
                {subItem.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ModernLayout;
