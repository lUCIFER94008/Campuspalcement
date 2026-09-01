import React from 'react';
import { Navbar } from '@/components/navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { AmbientBackground } from '@/components/ambient-background';
import { Hero } from '@/components/landing/Hero';
import { CompaniesGrid } from '@/components/landing/CompaniesGrid';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { RoleBasedPreview } from '@/components/landing/RoleBasedPreview';
import { StatsSection } from '@/components/landing/StatsSection';
import { AIFeaturesSection } from '@/components/landing/AIFeaturesSection';
import { Testimonials } from '@/components/landing/Testimonials';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen selection:bg-yellow-bright selection:text-slate-900">
      <ScrollProgress />
      <AmbientBackground />
      <Navbar />
      <main>
        <Hero />
        <CompaniesGrid />
        <FeaturesSection />
        <HowItWorks />
        <RoleBasedPreview />
        <StatsSection />
        <AIFeaturesSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
