'use client';

import {
  Header,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  CtaSection,
  Footer
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Call to Action Section */}
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
