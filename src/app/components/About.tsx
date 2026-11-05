import { useState } from 'react';
import { ArrowUpRight, Code2, Layers3, MapPin, MonitorSmartphone, QrCode, RotateCcw } from 'lucide-react';

const highlights = [
  { value: '4 Years', label: 'Freelance Experience', icon: Code2 },
  { value: 'Web & Mobile', label: 'App Development', icon: MonitorSmartphone },
  { value: 'Full-Stack', label: 'Web Development', icon: Layers3 },
  { value: '20+', label: 'Production Systems', icon: ArrowUpRight },
];

export function AboutSection() {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="about-layout">
      <div className="min-w-0">
        <h2 className="portfolio-heading">About<span className="section-heading-dot" aria-hidden="true" /></h2>
        <div className="about-copy">
          <p>I'm Reyca De Alba, a full-stack developer with <strong>4 years of freelance experience</strong> building practical web and mobile applications. My work is focused on software that is usable, reliable, and built around real workflows.</p>
          <p>Most of my experience comes from academic research, legal data workflows, and freelance IT projects. These projects usually involve multi-role processes, real-time data, structured operations, and interfaces that need to stay clear and easy to use.</p>
          <p>My main strengths are full-stack web development using the MERN stack, cross-platform app development with Flutter, and machine learning. I focus on building software that helps clients manage work better, reduce manual effort, and make day-to-day operations more efficient.</p>
        </div>
        <div className="highlight-grid">
          {highlights.map(({ value, label, icon: Icon }) => (
            <div className="highlight-card" key={label}>
              <div className="highlight-card__top"><p>{value}</p><Icon size={16} aria-hidden="true" /></div>
              <p className="highlight-card__label">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <button type="button" className={`profile-card ${isFlipped ? 'profile-card--flipped' : ''}`} aria-label={isFlipped ? 'Back to profile' : 'Show contact QR code'} aria-pressed={isFlipped} onClick={() => setIsFlipped(previous => !previous)}>
        <span className="profile-card__inner">
          <span className="profile-card__front" aria-hidden={isFlipped}>
            <span className="profile-card__top"><img src="/brand/reyca-mark.svg" alt="" width={34} height={34} /><span className="profile-card__since">SINCE 2022</span></span>
            <span className="profile-card__identity"><span className="profile-card__eyebrow">Software Developer</span><span className="profile-card__name">Reyca<br />De Alba<span className="profile-card__period">.</span></span><span className="profile-card__role">AI & Full-Stack Developer</span></span>
            <span className="profile-card__details"><span><span className="profile-card__eyebrow">Building for</span><span className="profile-card__detail">Web, mobile & real workflows</span></span><span><span className="profile-card__eyebrow">Focus</span><span className="profile-card__detail">Academic, legal & business systems</span></span><span className="profile-card__location"><MapPin size={12} />Sampaloc, Manila</span></span>
            <span className="profile-card__flip"><span><QrCode size={14} />Flip to connect</span><ArrowUpRight size={15} /></span>
          </span>
          <span className="profile-card__back" aria-hidden={!isFlipped}>
            <span className="profile-card__eyebrow">Let's connect</span>
            <span className="profile-card__qr"><img src="/QR/0a644bdb-6044-4850-901e-a386b0b4a41c.jpg" alt="Reyca De Alba contact QR code" width={172} height={172} loading="lazy" /></span>
            <span className="profile-card__scan">Scan the code to find me online.</span>
            <span className="profile-card__flip"><span><RotateCcw size={13} />Back to profile</span><ArrowUpRight size={15} /></span>
          </span>
        </span>
      </button>
    </div>
  );
}
