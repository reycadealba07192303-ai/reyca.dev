'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight, ArrowLeft, ArrowRight, ArrowUpRight, FileText, Lock, Wrench } from 'lucide-react';
import Link from 'next/link';

export const systemProjects = [
  {
    name: 'GeoFlora',
    description: 'AI Invasive Plant Identification & Mapping',
    url: 'geoflora-ph.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'ACLC SSG Voting System',
    description: 'Student Government Election Platform (Mobile & Web)',
    url: 'voting-system-aclc.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'SineSarili',
    description: 'Filipino Film Streaming & Showcase Platform',
    url: 'sine-sarili.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'SafetyQuest',
    description: 'Safety & Disaster Preparedness Learning (Mobile & Web)',
    url: 'safetyquest.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'AgriFair',
    description: 'Agricultural Fair Marketplace & Admin System (Mobile & Web)',
    url: 'agri-fair-phi.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'ACLC Scheduler',
    description: 'Class Scheduling & QR Attendance (Mobile & Web)',
    url: 'aclc-scheduler.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Story Race Game',
    description: 'Gamified Reading Comprehension Platform',
    url: 'story-race-game.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'GeoApp',
    description: 'Crowd Forecasts for Nearby Places',
    url: '/apk/geoapp.apk',
    urlLabel: 'Download APK',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Whack-a-Bug',
    description: 'Debugging Arcade Game for Android',
    url: 'https://github.com/reycadealba07192303-ai/whack-a-bug/raw/main/dist/Whack-a-Bug-client.apk',
    urlLabel: 'Download APK',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Autodemy',
    description: 'Smart Academic Management System',
    url: 'https://drive.google.com/file/d/1rDC5jv4bWWb6Bi9bAUnzUfEf7VEhd4ww/view?usp=sharing',
    urlLabel: 'Download APK',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'SciMathix',
    description: 'Interactive Science & Math Learning App',
    url: 'https://drive.google.com/file/d/1bvdDvw-XBT9eycbvW0ReyJe0QSyLXkTv/view?usp=sharing',
    urlLabel: 'Download APK',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Admovprog',
    description: 'Advanced Mobile & Visual Programming App',
    url: 'https://drive.google.com/file/d/1cvLjRFk2dLKrDWu8DoLY34ASC288T6tc/view?usp=sharing',
    urlLabel: 'Download APK',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Crowd Level Tap',
    description: 'Real-Time Crowd Density Monitoring App',
    url: 'https://drive.google.com/file/d/1_3yLsMB-wRhKnuClXFl7OW4AWq-TSvxm/view?usp=sharing',
    urlLabel: 'Download APK',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'InCloud',
    description: 'Cloud-Based Mobile Application',
    url: '/apk/incloud.apk',
    urlLabel: 'Download APK',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Lawbot',
    description: 'AI-Powered Legal Assistant',
    url: 'lawbot-web.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'SmartCash',
    description: 'Financial Literacy LMS',
    url: 'smartcash-abm.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'IntelliAccess',
    description: 'AI-Powered Vehicle Access Control',
    url: 'intelli-accessv1.vercel.app',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Automation Tagging',
    description: 'Report Tagging Automation System',
    url: 'automation-report-tagging.vercel.app',
    status: 'Private',
    hideLink: true,
  },
  {
    name: '903rd Battalion IS',
    description: 'Record Management System',
    url: '903rd-battalion.com',
    status: 'In Development',
    hideLink: true,
  },
];

export const mobileProjects = [];


export const academicProjects = [
  {
    name: 'Creatify Project',
    description: 'Academic Paper & Documentation',
    url: 'https://docs.google.com/document/d/103rfgem28dcUYyDWGK95_EsjRohcTlKAyRVMd1KTVMo/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'EcoVentris',
    description: 'Academic Paper & Documentation',
    url: 'https://docs.google.com/document/d/13hUJL4yFH4h3wp75uWO29H1P4K4q689ep3bIbTiAO5k/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'The Hormuz Chokepoint Analysis',
    description: 'Academic Analysis Paper',
    url: 'https://docs.google.com/document/d/1basbk7lOiQMwNfXEQ-PNiiOD5_AXA3lbt07POFEmh-c/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Financial Literacy',
    description: 'Research Documentation',
    url: 'https://docs.google.com/document/d/1Z29DpVHQraZLOTP6oqoTZ_HVYhezNhNm6FrjnVF8zdE/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'A Reflection Paper',
    description: 'Academic Reflection',
    url: 'https://docs.google.com/document/d/1ArE5SF2Lcj9R6HZYZxOaXV8R_bSlakt6caDIsrMWkqo/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Comprehensive Development',
    description: 'Project Documentation',
    url: 'https://docs.google.com/document/d/1zq3j5iG_FsOWDBtqMue0GN39DOZxZaYSFWWQ5W1eGI8/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'InCloud Thesis',
    description: 'Thesis Paper Documentation',
    url: 'https://docs.google.com/document/d/16cNbp3BwmQ_Vg4Wz1w5NOayJJf3lSrNQ9Sk1U64fTBU/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'AI-Based Vehicle Security System',
    description: 'Integrating UHF RFID & Camera Monitoring',
    url: 'https://hidden-sky-82.linkyhost.com',
    urlLabel: 'hidden-sky-82.linkyhost.com',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Hospitality Research',
    description: 'Academic Research Paper',
    url: 'https://docs.google.com/document/d/1QncN7gopRFnXANz-_AGjvdZWG9YakdOX/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Chapter 4-5 Research',
    description: 'Research Chapters Documentation',
    url: 'https://docs.google.com/document/d/1p3ZFbM0M8z0vdx0xRo1GE1Uxl45QT4Wt/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
  {
    name: 'Academic Thesis Collaboration',
    description: 'Julliene\'s Thesis Reference',
    url: 'https://docs.google.com/document/d/1VpiEBmZEtFbOWQ9S27HVPK25SruCLuH6/edit?usp=sharing',
    urlLabel: 'View Google Doc',
    status: 'Live',
    hideLink: false,
  },
];

type Project = { name: string; description: string; url: string; status: string; hideLink: boolean; urlLabel?: string };

export function ProjectCard({ project }: { project: Project }) {
  const document = project.url.includes('docs.google.com');
  const contents = <>
    <div className="project-card__body">
      <div className="project-card__heading">{document && <FileText size={17} aria-hidden="true" />}<h3>{project.name}</h3><span className="project-card__open" aria-hidden="true">{project.hideLink ? project.status === 'In Development' ? <Wrench size={15} /> : <Lock size={15} /> : <ArrowUpRight size={16} />}</span></div>
      <p className="project-card__description">{project.description}</p>
      <div className="project-card__footer">{project.hideLink ? <span className="project-card__private">{project.status === 'In Development' ? 'In development' : 'Private project'}</span> : <span className="project-card__action">{project.urlLabel || (document ? 'Read document' : 'View project')}<ArrowUpRight size={12} aria-hidden="true" /></span>}</div>
    </div>
  </>;
  return project.hideLink
    ? <article className="project-card">{contents}</article>
    : <a className="project-card" href={project.url.startsWith('http') || project.url.startsWith('/') ? project.url : `https://${project.url}`} target="_blank" rel="noopener noreferrer" aria-label={`${project.urlLabel?.includes('Download') ? 'Download' : 'View'} ${project.name}`}>{contents}</a>;
}

export const MobileProjectCard = ({ project }: { project: any }) => (
  <div className="group relative bg-transparent rounded-2xl border border-border hover:border-foreground/30 transition-all duration-500 overflow-hidden flex flex-col md:flex-row gap-6 p-6">
    {/* Phone Mockup */}
    <div className="relative mx-auto md:mx-0 w-[240px] h-[480px] flex-shrink-0">
      {/* Phone Case */}
      <div className="absolute inset-0 bg-neutral-900 rounded-[3rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden">
        {/* Screen Content */}
        <div className="absolute inset-0 bg-white">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-2xl z-20"></div>
        {/* Home Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-neutral-800/20 rounded-full z-20"></div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-yellow-500/10 to-blue-500/10 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>

    {/* Project Info */}
    <div className="flex flex-col justify-center flex-1">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full mb-3 inline-block">
          Mobile Application
        </span>
        <h3 className="text-2xl font-bold text-foreground mb-2 italic">
          {project.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tech.map((t: string) => (
          <span key={t} className="text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md border border-border/50">
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="px-6 py-2.5 bg-foreground text-background rounded-full text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 group/btn">
          View Case Study
          <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          {project.status}
        </span>
      </div>
    </div>
  </div>
);


const shortDescriptions: Record<string, string> = {
  GeoFlora: 'Identify invasive plants from a photo and map verified sightings across the Philippines.',
  'ACLC SSG Voting System': 'A mobile and web platform for student government elections.',
  SineSarili: 'A platform for streaming and showcasing Filipino films.',
  SafetyQuest: 'A safety and disaster preparedness learning platform for mobile and web.',
  AgriFair: 'An agricultural marketplace with mobile apps and a web admin portal.',
  'ACLC Scheduler': 'Class scheduling and QR attendance for ACLC College of Manila.',
  'Story Race Game': 'A gamified reading comprehension platform for Grade 8 students.',
  'Creatify Project': 'Academic paper and documentation for the Creatify project.',
  EcoVentris: 'Academic paper and project documentation for EcoVentris.',
  'The Hormuz Chokepoint Analysis': 'An academic analysis of the Hormuz chokepoint.',
  'InCloud Thesis': 'Thesis documentation for a cloud-based inventory management system.',
};

// Reuse the actual portfolio screenshots. Projects without a screenshot get a
// neutral illustration, so a different project's image is never misrepresented.
const projectArtwork: Record<string, string> = {
  GeoFlora: '/geoflora/web-01.jpg',
  'ACLC SSG Voting System': '/voting-system/web-01.jpg',
  SineSarili: '/sine-sarili/web-01.jpg',
  SafetyQuest: '/safetyquest/web-01.jpg',
  AgriFair: '/agrifair/web-01.jpg',
  'ACLC Scheduler': '/aclc-scheduler/web-01.jpg',
  'Story Race Game': '/story-race/web-01.jpg',
  GeoApp: '/geoapp/cover.jpg',
  'Whack-a-Bug': '/whack-a-bug/cover.jpg',
  Autodemy: '/autodemy/login_screen.png',
  InCloud: '/InCloud/Screenshot2026-03-01000438.webp',
  'InCloud Thesis': '/InCloud/Screenshot2026-03-01000438.webp',
  Lawbot: '/Lawbot/Screenshot 2026-04-26 010822.png',
  SmartCash: '/smartcash/Screenshot 2026-04-26 011116.png',
  IntelliAccess: '/Intelliaccess/38975307-95b8-4a00-8329-5801731ca410.jpg',
};

function ProjectSlide({ project, index, total, academic }: { project: Project; index: number; total: number; academic: boolean }) {
  const artwork = (!project.hideLink && projectArtwork[project.name]) || `/project-art/${academic ? 'research' : 'system'}.svg`;
  const content = <>
    <img className="project-slide__art" src={artwork} alt="" aria-hidden="true" loading="lazy" decoding="async" />
    <div className="project-slide__top"><span>{academic ? 'RESEARCH' : 'SYSTEM PROJECT'} <i aria-hidden="true">/</i> {String(index + 1).padStart(2, '0')}<span className="project-slide__total"> / {String(total).padStart(2, '0')}</span></span><span className="project-slide__icon" aria-hidden="true">{project.hideLink ? project.status === 'In Development' ? <Wrench size={15} /> : <Lock size={15} /> : <ArrowUpRight size={16} />}</span></div>
    <div className="project-slide__content"><h3>{project.name}</h3><p>{shortDescriptions[project.name] || project.description}</p></div>
    <div className="project-slide__bottom"><span>{project.hideLink ? project.status === 'In Development' ? 'In development' : 'Private project' : project.urlLabel || (academic ? 'View document' : 'View project')}</span>{!project.hideLink && <ArrowUpRight size={13} aria-hidden="true" />}</div>
  </>;
  const href = project.url.startsWith('http') || project.url.startsWith('/') ? project.url : `https://${project.url}`;
  return project.hideLink
    ? <article className="project-slide" data-project-slide>{content}</article>
    : <a className="project-slide" data-project-slide href={href} target="_blank" rel="noopener noreferrer" aria-label={`${project.urlLabel?.includes('Download') ? 'Download' : 'View'} ${project.name}`}>{content}</a>;
}

export function RecentProjects() {
  const [category, setCategory] = useState<'systems' | 'academic'>('systems');
  const [position, setPosition] = useState({ index: 1, progress: 0, canBack: false, canNext: true });
  const trackRef = useRef<HTMLDivElement>(null);
  const projects: Project[] = category === 'systems' ? systemProjects : academicProjects;

  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    const first = track.querySelector<HTMLElement>('[data-project-slide]');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = (first?.offsetWidth || track.clientWidth) + gap;
    setPosition({ index: Math.min(projects.length, Math.max(1, Math.round(track.scrollLeft / step) + 1)), progress: maximum ? Math.min(100, Math.max(0, ((track.scrollLeft + track.clientWidth) / track.scrollWidth) * 100)) : 100, canBack: track.scrollLeft > 2, canNext: track.scrollLeft < maximum - 2 });
  }, [projects.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: 0, behavior: 'auto' });
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(track);
    return () => observer.disconnect();
  }, [category, updatePosition]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector<HTMLElement>('[data-project-slide]');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * ((first?.offsetWidth || track.clientWidth) + gap), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div className="project-explorer">
      <div className="project-explorer__header"><div><h2>Projects<span className="section-heading-dot" aria-hidden="true" /></h2><p>A closer look at the work I've built and explored.</p></div><Link href="/projects" className="project-explorer__all">View All <ChevronRight size={15} /></Link></div>
      <div className="project-explorer__toolbar"><div className="project-explorer__categories" role="group" aria-label="Project categories"><button type="button" aria-pressed={category === 'systems'} onClick={() => setCategory('systems')}>Systems <span>{systemProjects.length}</span></button><button type="button" aria-label="Academic and thesis projects" aria-pressed={category === 'academic'} onClick={() => setCategory('academic')}>Academic <span>{academicProjects.length}</span></button></div><div className="project-explorer__controls"><button type="button" aria-label="Previous projects" disabled={!position.canBack} onClick={() => move(-1)}><ArrowLeft size={16} /></button><button type="button" aria-label="Next projects" disabled={!position.canNext} onClick={() => move(1)}><ArrowRight size={16} /></button></div></div>
      <div ref={trackRef} className="project-explorer__track" role="region" aria-label={`${category === 'systems' ? 'System projects' : 'Academic and thesis projects'}, scroll horizontally`} tabIndex={0} onScroll={updatePosition} onKeyDown={event => { if (event.target === event.currentTarget && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }}>
        {projects.map((project, index) => <ProjectSlide key={project.name} project={project} index={index} total={projects.length} academic={category === 'academic'} />)}
      </div>
      <div className="project-explorer__under"><span>Scroll to explore <ArrowRight size={12} aria-hidden="true" /></span><span className="project-explorer__progress" aria-hidden="true"><i style={{ width: `${position.progress}%` }} /></span><span className="project-explorer__count">{String(position.index).padStart(2, '0')} <i>/</i> {String(projects.length).padStart(2, '0')}</span></div>
    </div>
  );
}
