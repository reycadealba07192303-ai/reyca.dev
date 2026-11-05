'use client';

import { ProfileHeader } from '../components/ProfileHeader';
import { AboutSection } from '../components/About';
import { TechStack } from '../components/TechStack';
import { RecentProjects } from '../components/Projects';
import { CertificationsExperience } from '../components/CertificationsExperience';
import { Recommendations } from '../components/Recommendations';
import { FooterLinks } from '../components/FooterLinks';
import { Gallery } from '../components/Gallery';
import { PortfolioFooter } from '../components/PortfolioFooter';

export function Home() {
  return (
    <main className="portfolio-home max-w-3xl mx-auto px-4 py-10 space-y-10">
      <ProfileHeader />
      <section id="about" className="portfolio-section"><AboutSection /></section>
      <section id="tech-stack" className="portfolio-section"><TechStack /></section>
      <section id="projects" className="portfolio-section"><RecentProjects /></section>
      <section id="experience" className="portfolio-section"><CertificationsExperience /></section>
      <section className="portfolio-section"><Recommendations /></section>
      <section className="portfolio-section"><FooterLinks /></section>
      <section className="portfolio-section"><Gallery /></section>
      <PortfolioFooter />
    </main>
  );
}
