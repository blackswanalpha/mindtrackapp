'use client';

import React from 'react';
import Link from 'next/link';
import DesignSystemNav from '@/components/design-system/DesignSystemNav';
import {
  ArrowRight,
  Palette,
  Type,
  Grid,
  Box,
  Layers,
  Zap,
  Sliders,
  Sparkles
} from 'lucide-react';

// Import redesigned components
import ButtonRedesigned from '@/components/common/ButtonRedesigned';
import CardRedesigned from '@/components/common/CardRedesigned';

export default function DesignSystemPage() {
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
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Design System Overview</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              This design system provides a comprehensive set of guidelines, components, and patterns to create consistent,
              accessible, and visually appealing user interfaces. It focuses on modern design principles with enhanced
              typography, spacing, interactivity, and visual appeal.
            </p>
            <div className="flex flex-wrap gap-2">
              <ButtonRedesigned
                variant="primary"
                icon={<ArrowRight />}
                iconPosition="right"
                href="/ui-showcase"
              >
                View Components
              </ButtonRedesigned>
            </div>
          </section>

          {/* Design Principles */}
          <section className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Design Principles</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardRedesigned
                title="Consistency"
                icon={<Grid className="h-5 w-5 text-primary-500" />}
                variant="bordered"
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  Maintain visual and functional consistency across the application to create a cohesive user experience.
                </p>
              </CardRedesigned>

              <CardRedesigned
                title="Accessibility"
                icon={<Sliders className="h-5 w-5 text-primary-500" />}
                variant="bordered"
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  Ensure all components are accessible to users with disabilities, following WCAG guidelines.
                </p>
              </CardRedesigned>

              <CardRedesigned
                title="Responsiveness"
                icon={<Layers className="h-5 w-5 text-primary-500" />}
                variant="bordered"
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  Design interfaces that work seamlessly across all device sizes and screen resolutions.
                </p>
              </CardRedesigned>

              <CardRedesigned
                title="Clarity"
                icon={<Box className="h-5 w-5 text-primary-500" />}
                variant="bordered"
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  Create clear, intuitive interfaces that help users accomplish their goals efficiently.
                </p>
              </CardRedesigned>

              <CardRedesigned
                title="Delight"
                icon={<Sparkles className="h-5 w-5 text-primary-500" />}
                variant="bordered"
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  Add thoughtful animations and interactions that create moments of delight without sacrificing usability.
                </p>
              </CardRedesigned>

              <CardRedesigned
                title="Performance"
                icon={<Zap className="h-5 w-5 text-primary-500" />}
                variant="bordered"
              >
                <p className="text-neutral-600 dark:text-neutral-300">
                  Optimize components for performance to ensure a smooth and responsive user experience.
                </p>
              </CardRedesigned>
            </div>
          </section>

          {/* Color System */}
          <section id="colors" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary-500" />
              Color System
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Primary Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={`primary-${shade}`} className="space-y-2">
                      <div
                        className={`h-16 rounded-md bg-primary-${shade} border border-neutral-200 dark:border-neutral-700`}
                      ></div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        <p className="font-medium">Primary {shade}</p>
                        <p className="text-xs opacity-70">bg-primary-{shade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Secondary Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={`secondary-${shade}`} className="space-y-2">
                      <div
                        className={`h-16 rounded-md bg-secondary-${shade} border border-neutral-200 dark:border-neutral-700`}
                      ></div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        <p className="font-medium">Secondary {shade}</p>
                        <p className="text-xs opacity-70">bg-secondary-{shade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Accent Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={`accent-${shade}`} className="space-y-2">
                      <div
                        className={`h-16 rounded-md bg-accent-${shade} border border-neutral-200 dark:border-neutral-700`}
                      ></div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        <p className="font-medium">Accent {shade}</p>
                        <p className="text-xs opacity-70">bg-accent-{shade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Neutral Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={`neutral-${shade}`} className="space-y-2">
                      <div
                        className={`h-16 rounded-md bg-neutral-${shade} border border-neutral-200 dark:border-neutral-700`}
                      ></div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        <p className="font-medium">Neutral {shade}</p>
                        <p className="text-xs opacity-70">bg-neutral-{shade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Semantic Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="h-16 rounded-md bg-green-600 border border-neutral-200 dark:border-neutral-700"></div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300">
                      <p className="font-medium">Success</p>
                      <p className="text-xs opacity-70">bg-green-600</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-16 rounded-md bg-amber-500 border border-neutral-200 dark:border-neutral-700"></div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300">
                      <p className="font-medium">Warning</p>
                      <p className="text-xs opacity-70">bg-amber-500</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-16 rounded-md bg-red-600 border border-neutral-200 dark:border-neutral-700"></div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300">
                      <p className="font-medium">Error</p>
                      <p className="text-xs opacity-70">bg-red-600</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-16 rounded-md bg-blue-600 border border-neutral-200 dark:border-neutral-700"></div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300">
                      <p className="font-medium">Info</p>
                      <p className="text-xs opacity-70">bg-blue-600</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section id="typography" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
              <Type className="h-5 w-5 mr-2 text-primary-500" />
              Typography
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Font Families</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md">
                      <p className="text-2xl font-display">Inter</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Primary Font</p>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Used for general UI text, body content, and most interface elements.
                    </p>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">font-sans</code>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md">
                      <p className="text-2xl font-display">Playfair Display</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Display Font</p>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Used for headings, titles, and other display text that needs emphasis.
                    </p>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">font-display</code>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md">
                      <p className="text-2xl font-body">DM Sans</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">UI Font</p>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      Used for buttons, interactive elements, and UI components.
                    </p>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">font-body</code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Type Scale</h3>
                <div className="space-y-6">
                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    <h1 className="text-5xl font-bold font-display text-neutral-900 dark:text-white">Heading 1</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">text-5xl font-bold font-display</code>
                    </p>
                  </div>

                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    <h2 className="text-4xl font-bold font-display text-neutral-900 dark:text-white">Heading 2</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">text-4xl font-bold font-display</code>
                    </p>
                  </div>

                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    <h3 className="text-3xl font-semibold font-display text-neutral-900 dark:text-white">Heading 3</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">text-3xl font-semibold font-display</code>
                    </p>
                  </div>

                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    <h4 className="text-2xl font-semibold font-display text-neutral-900 dark:text-white">Heading 4</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">text-2xl font-semibold font-display</code>
                    </p>
                  </div>

                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    <h5 className="text-xl font-medium text-neutral-900 dark:text-white">Heading 5</h5>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">text-xl font-medium</code>
                    </p>
                  </div>

                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    <h6 className="text-lg font-medium text-neutral-900 dark:text-white">Heading 6</h6>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">text-lg font-medium</code>
                    </p>
                  </div>

                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    <p className="text-base text-neutral-700 dark:text-neutral-300">
                      This is a paragraph with standard body text. It should be easy to read and have good contrast.
                      The line height should provide enough spacing for comfortable reading, especially for longer blocks of text.
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">text-base text-neutral-700 dark:text-neutral-300</code>
                    </p>
                  </div>

                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      This is smaller text often used for secondary information, captions, or helper text.
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">text-sm text-neutral-600 dark:text-neutral-400</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Spacing System */}
          <section id="spacing" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Spacing System</h2>

            <div className="space-y-6">
              <p className="text-neutral-600 dark:text-neutral-300">
                Our spacing system is based on a 4px grid, with spacing values increasing in increments of 4px.
                This creates a consistent rhythm throughout the interface and makes it easier to maintain visual harmony.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Spacing Scale</h3>
                  <div className="space-y-4">
                    {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64].map((space) => (
                      <div key={`space-${space}`} className="flex items-center">
                        <div className="w-16 text-sm text-neutral-600 dark:text-neutral-300">
                          {space}
                        </div>
                        <div className={`h-6 bg-primary-200 dark:bg-primary-800 rounded`} style={{ width: `${space * 4}px` }}></div>
                        <div className="ml-4 text-sm text-neutral-500 dark:text-neutral-400">
                          {space * 4}px - <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">p-{space}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Usage Guidelines</h3>
                  <div className="space-y-4 text-neutral-600 dark:text-neutral-300">
                    <p>
                      <strong>Micro spacing (0-2):</strong> Use for tight spacing within components, such as icon margins or very compact layouts.
                    </p>
                    <p>
                      <strong>Small spacing (3-4):</strong> Use for spacing between related elements within a component.
                    </p>
                    <p>
                      <strong>Medium spacing (5-8):</strong> Use for spacing between components or sections within a layout.
                    </p>
                    <p>
                      <strong>Large spacing (10-16):</strong> Use for significant separation between major sections or layout areas.
                    </p>
                    <p>
                      <strong>Extra large spacing (20-64):</strong> Use for page-level spacing, such as margins and major layout divisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Animation Guidelines */}
          <section id="animations" className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Animation Guidelines</h2>

            <div className="space-y-6">
              <p className="text-neutral-600 dark:text-neutral-300">
                Animations should enhance the user experience by providing feedback, guiding attention, and creating a sense of polish.
                They should be subtle, purposeful, and never interfere with usability.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Duration Guidelines</h3>
                  <div className="space-y-4 text-neutral-600 dark:text-neutral-300">
                    <p>
                      <strong>Ultra fast (50-100ms):</strong> Micro-interactions like button clicks.
                    </p>
                    <p>
                      <strong>Fast (150-200ms):</strong> Simple transitions like hover states.
                    </p>
                    <p>
                      <strong>Medium (250-300ms):</strong> Standard transitions like opening dropdowns.
                    </p>
                    <p>
                      <strong>Slow (350-500ms):</strong> Complex transitions like modal dialogs.
                    </p>
                    <p>
                      <strong>Very slow (500ms+):</strong> Reserved for special cases and entrance animations.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-4">Easing Functions</h3>
                  <div className="space-y-4 text-neutral-600 dark:text-neutral-300">
                    <p>
                      <strong>Standard:</strong> <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">cubic-bezier(0.4, 0, 0.2, 1)</code>
                      <br />
                      Use for most transitions.
                    </p>
                    <p>
                      <strong>Entrance:</strong> <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">cubic-bezier(0, 0, 0.2, 1)</code>
                      <br />
                      Use for elements entering the screen.
                    </p>
                    <p>
                      <strong>Exit:</strong> <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">cubic-bezier(0.4, 0, 1, 1)</code>
                      <br />
                      Use for elements exiting the screen.
                    </p>
                    <p>
                      <strong>Bounce:</strong> <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">cubic-bezier(0.175, 0.885, 0.32, 1.275)</code>
                      <br />
                      Use for playful, attention-grabbing animations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
