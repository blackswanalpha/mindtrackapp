'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">MindTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu.Root className="hidden md:block">
            <NavigationMenu.List className="flex space-x-8">
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="group flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  Features
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full mt-2 w-[200px] rounded-md bg-white p-2 shadow-lg">
                  <ul className="grid gap-2">
                    <FeatureLink href="/features/questionnaires" title="Questionnaires" />
                    <FeatureLink href="/features/analytics" title="Analytics" />
                    <FeatureLink href="/features/ai-insights" title="AI Insights" />
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item>
                <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </NavigationMenu.Item>

              <NavigationMenu.Item>
                <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </NavigationMenu.Item>

              <NavigationMenu.Item>
                <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <motion.button
                className="text-gray-700 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log in
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                className="text-gray-700 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign up
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dashboard
                <LogIn className="ml-2 h-4 w-4" />
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden mt-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-4 py-4">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                    Features
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="mt-2 w-full rounded-md bg-white p-2 shadow-lg">
                    <DropdownMenu.Item className="rounded px-2 py-1 text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none">
                      <Link href="/features/questionnaires" className="block">
                        Questionnaires
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="rounded px-2 py-1 text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none">
                      <Link href="/features/analytics" className="block">
                        Analytics
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="rounded px-2 py-1 text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none">
                      <Link href="/features/ai-insights" className="block">
                        AI Insights
                      </Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>

                <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>

                <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  About
                </Link>

                <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Contact
                </Link>

                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Log in
                  </Link>
                  <Link href="/register" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Sign up
                  </Link>
                  <Link href="/dashboard">
                    <button className="w-full flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Dashboard
                      <LogIn className="ml-2 h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

interface FeatureLinkProps {
  href: string;
  title: string;
}

const FeatureLink: React.FC<FeatureLinkProps> = ({ href, title }) => {
  return (
    <li>
      <NavigationMenu.Link asChild>
        <Link
          href={href}
          className="block rounded px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none"
        >
          {title}
        </Link>
      </NavigationMenu.Link>
    </li>
  );
};

export default Header;
