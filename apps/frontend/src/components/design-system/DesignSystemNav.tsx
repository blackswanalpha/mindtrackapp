'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Palette, 
  Type, 
  Grid, 
  Box, 
  Layers, 
  Zap, 
  Sliders, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
};

const navItems: NavItem[] = [
  {
    name: 'Overview',
    href: '/design-system',
    icon: <Grid className="h-5 w-5" />,
    description: 'Design system overview and principles',
  },
  {
    name: 'Colors',
    href: '/design-system#colors',
    icon: <Palette className="h-5 w-5" />,
    description: 'Color palette and usage guidelines',
  },
  {
    name: 'Typography',
    href: '/design-system#typography',
    icon: <Type className="h-5 w-5" />,
    description: 'Font families, sizes, and styles',
  },
  {
    name: 'Spacing',
    href: '/design-system#spacing',
    icon: <Layers className="h-5 w-5" />,
    description: 'Spacing system and layout guidelines',
  },
  {
    name: 'Animations',
    href: '/design-system#animations',
    icon: <Zap className="h-5 w-5" />,
    description: 'Animation principles and guidelines',
  },
  {
    name: 'Components',
    href: '/ui-showcase',
    icon: <Box className="h-5 w-5" />,
    description: 'UI component showcase and examples',
  },
];

const DesignSystemNav: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (href: string) => {
    if (href === '/design-system' && pathname === '/design-system') {
      return true;
    }
    if (href.includes('#') && pathname === '/design-system') {
      return true;
    }
    return pathname === href;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          type="button"
          className="p-2 rounded-md bg-white dark:bg-neutral-800 shadow-md text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-white dark:bg-neutral-900 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-16 pb-6 px-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
            Design System
          </h2>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`mr-3 ${isActive(item.href) ? 'text-primary-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ChevronRight className="h-5 w-5 mr-3 text-neutral-500 dark:text-neutral-400" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
            Design System
          </h2>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                <span className={`mr-3 ${isActive(item.href) ? 'text-primary-500' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <Link
              href="/"
              className="group flex items-center px-3 py-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5 mr-3 text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignSystemNav;
