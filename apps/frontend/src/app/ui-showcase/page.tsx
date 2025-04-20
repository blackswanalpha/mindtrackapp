'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DesignSystemNav from '@/components/design-system/DesignSystemNav';
import {
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Download,
  Info,
  Mail,
  Plus,
  Search,
  Settings,
  Star,
  User,
  X
} from 'lucide-react';

// Import redesigned components
import ButtonRedesigned from '@/components/common/ButtonRedesigned';
import CardRedesigned from '@/components/common/CardRedesigned';
import InputRedesigned from '@/components/common/InputRedesigned';
import AlertRedesigned from '@/components/common/AlertRedesigned';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/TabsRedesigned';
import BadgeRedesigned from '@/components/common/BadgeRedesigned';
import ModalRedesigned from '@/components/common/ModalRedesigned';

export default function UIShowcasePage() {
  // State for form inputs
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<'center' | 'top' | 'right' | 'bottom' | 'left'>('center');

  // Function to open modal with specific variant
  const openModal = (variant: 'center' | 'top' | 'right' | 'bottom' | 'left') => {
    setModalVariant(variant);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Navigation */}
      <DesignSystemNav />

      {/* Main content */}
      <main className="md:pl-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Introduction */}
          <section className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Redesigned UI Components</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              This showcase demonstrates the redesigned UI components with improved typography, spacing, interactivity, and visual appeal.
              Each component has been enhanced with modern design principles and animations.
            </p>
            <div className="flex flex-wrap gap-2">
              <ButtonRedesigned
                variant="primary"
                icon={<ChevronRight />}
                iconPosition="right"
                onClick={() => document.getElementById('buttons')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Components
              </ButtonRedesigned>
              <ButtonRedesigned
                variant="outline"
                icon={<Download />}
                iconPosition="left"
              >
                Download Design System
              </ButtonRedesigned>
            </div>
          </section>

          {/* Buttons Section */}
          <section id="buttons" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Buttons</h2>

            <div className="space-y-8">
              {/* Button Variants */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <ButtonRedesigned variant="primary">Primary</ButtonRedesigned>
                  <ButtonRedesigned variant="secondary">Secondary</ButtonRedesigned>
                  <ButtonRedesigned variant="accent">Accent</ButtonRedesigned>
                  <ButtonRedesigned variant="outline">Outline</ButtonRedesigned>
                  <ButtonRedesigned variant="ghost">Ghost</ButtonRedesigned>
                  <ButtonRedesigned variant="link">Link</ButtonRedesigned>
                  <ButtonRedesigned variant="destructive">Destructive</ButtonRedesigned>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <ButtonRedesigned variant="primary" size="xs">Extra Small</ButtonRedesigned>
                  <ButtonRedesigned variant="primary" size="sm">Small</ButtonRedesigned>
                  <ButtonRedesigned variant="primary" size="md">Medium</ButtonRedesigned>
                  <ButtonRedesigned variant="primary" size="lg">Large</ButtonRedesigned>
                  <ButtonRedesigned variant="primary" size="xl">Extra Large</ButtonRedesigned>
                </div>
              </div>

              {/* Button States */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">States</h3>
                <div className="flex flex-wrap gap-4">
                  <ButtonRedesigned variant="primary">Normal</ButtonRedesigned>
                  <ButtonRedesigned variant="primary" disabled>Disabled</ButtonRedesigned>
                  <ButtonRedesigned variant="primary" loading>Loading</ButtonRedesigned>
                </div>
              </div>

              {/* Button with Icons */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <ButtonRedesigned variant="primary" icon={<Plus />} iconPosition="left">
                    Add Item
                  </ButtonRedesigned>
                  <ButtonRedesigned variant="secondary" icon={<Download />} iconPosition="left">
                    Download
                  </ButtonRedesigned>
                  <ButtonRedesigned variant="outline" icon={<Settings />} iconPosition="right">
                    Settings
                  </ButtonRedesigned>
                  <ButtonRedesigned variant="ghost" icon={<Search />}>
                    Search
                  </ButtonRedesigned>
                </div>
              </div>

              {/* Button Shapes */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Shapes</h3>
                <div className="flex flex-wrap gap-4">
                  <ButtonRedesigned variant="primary" rounded={false}>Default</ButtonRedesigned>
                  <ButtonRedesigned variant="primary" rounded={true}>Rounded</ButtonRedesigned>
                </div>
              </div>
            </div>
          </section>

          {/* Cards Section */}
          <section id="cards" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Cards</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Default Card */}
              <CardRedesigned
                title="Default Card"
                headerAction={
                  <ButtonRedesigned variant="ghost" size="sm" icon={<X />} iconPosition="right">
                    Close
                  </ButtonRedesigned>
                }
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  This is a default card with a header and content.
                </p>
              </CardRedesigned>

              {/* Bordered Card */}
              <CardRedesigned
                title="Bordered Card"
                variant="bordered"
                icon={<Info className="h-5 w-5 text-primary-500" />}
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  This is a bordered card with an icon in the header.
                </p>
              </CardRedesigned>

              {/* Elevated Card */}
              <CardRedesigned
                title="Elevated Card"
                variant="elevated"
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  This card has elevated shadow for more prominence.
                </p>
              </CardRedesigned>

              {/* Card with Footer */}
              <CardRedesigned
                title="Card with Footer"
                footer={
                  <div className="flex justify-end space-x-2">
                    <ButtonRedesigned variant="outline" size="sm">Cancel</ButtonRedesigned>
                    <ButtonRedesigned variant="primary" size="sm">Save</ButtonRedesigned>
                  </div>
                }
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  This card includes a footer with action buttons.
                </p>
              </CardRedesigned>

              {/* Interactive Card */}
              <CardRedesigned
                title="Interactive Card"
                interactive={true}
                onClick={() => alert('Card clicked!')}
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  This card is interactive. Click me!
                </p>
                <div className="mt-4 flex">
                  <BadgeRedesigned color="primary" variant="subtle">Interactive</BadgeRedesigned>
                </div>
              </CardRedesigned>

              {/* Glass Card */}
              <CardRedesigned
                title="Glass Card"
                variant="glass"
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  This card has a glassmorphism effect with backdrop blur.
                </p>
              </CardRedesigned>
            </div>
          </section>

          {/* Inputs Section */}
          <section id="inputs" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Inputs</h2>

            <div className="space-y-8">
              {/* Input Variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Default Input</h3>
                  <InputRedesigned
                    label="Username"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your username"
                    helpText="Your username will be visible to others"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Filled Input</h3>
                  <InputRedesigned
                    label="Email"
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    placeholder="Enter your email"
                    variant="filled"
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Outlined Input</h3>
                  <InputRedesigned
                    label="Password"
                    type="password"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    placeholder="Enter your password"
                    variant="outlined"
                    required
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Underlined Input</h3>
                  <InputRedesigned
                    label="Search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search..."
                    variant="underlined"
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Input States */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Input States</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputRedesigned
                    label="Disabled Input"
                    value="Disabled value"
                    onChange={() => {}}
                    disabled
                  />

                  <InputRedesigned
                    label="Error Input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    error="This field is required"
                  />

                  <InputRedesigned
                    label="Success Input"
                    value="john.doe@example.com"
                    onChange={() => {}}
                    isSuccess={true}
                    successMessage="Email is valid"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Alerts Section */}
          <section id="alerts" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Alerts</h2>

            <div className="space-y-4">
              <AlertRedesigned
                type="success"
                title="Success Alert"
                message="Your changes have been saved successfully."
                onClose={() => {}}
              />

              <AlertRedesigned
                type="error"
                title="Error Alert"
                message="There was an error processing your request. Please try again."
                onClose={() => {}}
              />

              <AlertRedesigned
                type="warning"
                title="Warning Alert"
                message="Your account is about to expire. Please renew your subscription."
                onClose={() => {}}
                variant="outlined"
              />

              <AlertRedesigned
                type="info"
                title="Information Alert"
                message="A new version of the application is available. Please update to access new features."
                onClose={() => {}}
                variant="filled"
                action={
                  <ButtonRedesigned variant="outline" size="sm">
                    Update Now
                  </ButtonRedesigned>
                }
              />
            </div>
          </section>

          {/* Tabs Section */}
          <section id="tabs" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Tabs</h2>

            <div className="space-y-8">
              {/* Default Tabs */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Default Tabs</h3>
                <Tabs defaultValue="tab1">
                  <TabsList>
                    <TabsTrigger value="tab1">Account</TabsTrigger>
                    <TabsTrigger value="tab2">Notifications</TabsTrigger>
                    <TabsTrigger value="tab3">Security</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Manage your account settings and preferences.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab2">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Configure how you receive notifications and alerts.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab3">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Update your security settings and password.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Pills Tabs */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Pills Tabs</h3>
                <Tabs defaultValue="pill1">
                  <TabsList variant="pills">
                    <TabsTrigger value="pill1" variant="pills">Daily</TabsTrigger>
                    <TabsTrigger value="pill2" variant="pills">Weekly</TabsTrigger>
                    <TabsTrigger value="pill3" variant="pills">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pill1">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Daily statistics and metrics.
                    </p>
                  </TabsContent>
                  <TabsContent value="pill2">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Weekly statistics and metrics.
                    </p>
                  </TabsContent>
                  <TabsContent value="pill3">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Monthly statistics and metrics.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Tabs with Icons */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Tabs with Icons</h3>
                <Tabs defaultValue="icon1">
                  <TabsList variant="underline">
                    <TabsTrigger
                      value="icon1"
                      variant="underline"
                      icon={<User className="h-4 w-4" />}
                      iconPosition="left"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="icon2"
                      variant="underline"
                      icon={<Settings className="h-4 w-4" />}
                      iconPosition="left"
                    >
                      Settings
                    </TabsTrigger>
                    <TabsTrigger
                      value="icon3"
                      variant="underline"
                      icon={<Bell className="h-4 w-4" />}
                      iconPosition="left"
                    >
                      Notifications
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="icon1">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      View and edit your profile information.
                    </p>
                  </TabsContent>
                  <TabsContent value="icon2">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Manage your application settings.
                    </p>
                  </TabsContent>
                  <TabsContent value="icon3">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Configure your notification preferences.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>

          {/* Badges Section */}
          <section id="badges" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Badges</h2>

            <div className="space-y-8">
              {/* Badge Variants */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <BadgeRedesigned variant="default" color="primary">Default</BadgeRedesigned>
                  <BadgeRedesigned variant="outline" color="primary">Outline</BadgeRedesigned>
                  <BadgeRedesigned variant="subtle" color="primary">Subtle</BadgeRedesigned>
                  <BadgeRedesigned variant="dot" color="primary">With Dot</BadgeRedesigned>
                </div>
              </div>

              {/* Badge Colors */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Colors</h3>
                <div className="flex flex-wrap gap-4">
                  <BadgeRedesigned color="primary">Primary</BadgeRedesigned>
                  <BadgeRedesigned color="secondary">Secondary</BadgeRedesigned>
                  <BadgeRedesigned color="accent">Accent</BadgeRedesigned>
                  <BadgeRedesigned color="success">Success</BadgeRedesigned>
                  <BadgeRedesigned color="warning">Warning</BadgeRedesigned>
                  <BadgeRedesigned color="error">Error</BadgeRedesigned>
                  <BadgeRedesigned color="info">Info</BadgeRedesigned>
                  <BadgeRedesigned color="neutral">Neutral</BadgeRedesigned>
                </div>
              </div>

              {/* Badge Sizes */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <BadgeRedesigned size="xs" color="primary">Extra Small</BadgeRedesigned>
                  <BadgeRedesigned size="sm" color="primary">Small</BadgeRedesigned>
                  <BadgeRedesigned size="md" color="primary">Medium</BadgeRedesigned>
                  <BadgeRedesigned size="lg" color="primary">Large</BadgeRedesigned>
                </div>
              </div>

              {/* Badge with Icons */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <BadgeRedesigned
                    color="success"
                    icon={<Check className="h-3 w-3" />}
                    iconPosition="left"
                  >
                    Completed
                  </BadgeRedesigned>
                  <BadgeRedesigned
                    color="warning"
                    icon={<AlertCircle className="h-3 w-3" />}
                    iconPosition="left"
                  >
                    Pending
                  </BadgeRedesigned>
                  <BadgeRedesigned
                    color="error"
                    icon={<X className="h-3 w-3" />}
                    iconPosition="left"
                  >
                    Failed
                  </BadgeRedesigned>
                </div>
              </div>

              {/* Interactive Badges */}
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Interactive Badges</h3>
                <div className="flex flex-wrap gap-4">
                  <BadgeRedesigned
                    color="primary"
                    onClick={() => alert('Badge clicked!')}
                    animated
                  >
                    Clickable
                  </BadgeRedesigned>
                  <BadgeRedesigned
                    color="secondary"
                    removable
                    onRemove={() => alert('Badge removed!')}
                  >
                    Removable
                  </BadgeRedesigned>
                  <BadgeRedesigned
                    color="info"
                    count={5}
                  >
                    Info
                  </BadgeRedesigned>
                  <BadgeRedesigned
                    color="error"
                    count={99}
                    maxCount={99}
                  >
                    Error
                  </BadgeRedesigned>
                </div>
              </div>
            </div>
          </section>

          {/* Modals Section */}
          <section id="modals" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Modals</h2>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <ButtonRedesigned
                  variant="primary"
                  onClick={() => openModal('center')}
                >
                  Center Modal
                </ButtonRedesigned>
                <ButtonRedesigned
                  variant="outline"
                  onClick={() => openModal('top')}
                >
                  Top Modal
                </ButtonRedesigned>
                <ButtonRedesigned
                  variant="outline"
                  onClick={() => openModal('right')}
                >
                  Right Modal
                </ButtonRedesigned>
                <ButtonRedesigned
                  variant="outline"
                  onClick={() => openModal('bottom')}
                >
                  Bottom Modal
                </ButtonRedesigned>
                <ButtonRedesigned
                  variant="outline"
                  onClick={() => openModal('left')}
                >
                  Left Modal
                </ButtonRedesigned>
              </div>

              {/* Modal Component */}
              <ModalRedesigned
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${modalVariant.charAt(0).toUpperCase() + modalVariant.slice(1)} Modal`}
                position={modalVariant}
                footer={
                  <div className="flex justify-end space-x-2">
                    <ButtonRedesigned
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </ButtonRedesigned>
                    <ButtonRedesigned
                      variant="primary"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Confirm
                    </ButtonRedesigned>
                  </div>
                }
              >
                <div className="space-y-4">
                  <p className="text-neutral-600 dark:text-neutral-300">
                    This is a {modalVariant} positioned modal with customizable content and actions.
                  </p>
                  <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-md">
                    <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">Modal Features</h4>
                    <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1">
                      <li>Customizable positions</li>
                      <li>Animated transitions</li>
                      <li>Backdrop click to close</li>
                      <li>ESC key to close</li>
                      <li>Focus trap for accessibility</li>
                    </ul>
                  </div>
                </div>
              </ModalRedesigned>
            </div>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
