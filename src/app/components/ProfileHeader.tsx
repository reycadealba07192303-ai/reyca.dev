import { MapPin, BadgeCheck, ArrowUpRight, Mail, Download } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { CursorPortrait } from './CursorPortrait';

export function ProfileHeader() {
  return (
    <header className="profile-header">
      <div className="portrait-frame"><CursorPortrait /></div>
      <div className="profile-header__identity">
        <div className="profile-header__name-row">
          <h1>Reyca Dela Cruz De Alba<BadgeCheck size={19} className="profile-header__verified" aria-label="Verified profile" /></h1>
        </div>
        <p className="profile-header__location"><MapPin size={13} aria-hidden="true" /><span>Sampaloc, Manila, Philippines</span></p>
      </div>
      <div className="profile-header__theme"><ThemeToggle /></div>
      <div className="profile-header__roles" aria-label="Specializations">
        {['Data Analyst', 'AI Engineer', 'Full-Stack Developer'].map(role => <span key={role}>{role}</span>)}
      </div>
      <div className="profile-header__actions">
        <a href="/Resume/Reyca_De_Alba_Resume.docx" download className="portfolio-button portfolio-button--primary"><Download size={14} aria-hidden="true" />Download Resume</a>
        <a href="https://m.me/DealbaReyca072303" target="_blank" rel="noopener noreferrer" className="portfolio-button portfolio-button--secondary"><Mail size={14} aria-hidden="true" />Send Message<ArrowUpRight size={13} className="portfolio-button__arrow" aria-hidden="true" /></a>
      </div>
    </header>
  );
}
