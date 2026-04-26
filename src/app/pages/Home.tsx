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
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <ProfileHeader />
      <AboutSection />
      <TechStack />
      <RecentProjects />
      <CertificationsExperience />
      <Recommendations />
      <FooterLinks />
      <Gallery />
      <PortfolioFooter />
    </div>
  );
}
