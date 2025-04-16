'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">MindTrack</h3>
            <p className="text-gray-400 mb-4">
              Empowering mental health professionals with innovative tools for assessment and analysis.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} />
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} />
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/features" text="Features" />
              <FooterLink href="/pricing" text="Pricing" />
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/blog" text="Blog" />
              <FooterLink href="/contact" text="Contact" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="/help" text="Help Center" />
              <FooterLink href="/documentation" text="Documentation" />
              <FooterLink href="/api" text="API Reference" />
              <FooterLink href="/privacy" text="Privacy Policy" />
              <FooterLink href="/terms" text="Terms of Service" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-blue-400 mt-0.5" />
                <span className="text-gray-400">support@mindtrack.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-blue-400 mt-0.5" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-400 mt-0.5" />
                <span className="text-gray-400">
                  123 Mental Health Ave<br />
                  San Francisco, CA 94103
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} MindTrack. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-blue-400 text-sm">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-blue-400 text-sm">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-500 hover:text-blue-400 text-sm">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  text: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, text }) => {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-blue-400 transition-colors">
        {text}
      </Link>
    </li>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-blue-600 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  );
};

export default Footer;
