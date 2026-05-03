import { ChevronRight, ExternalLink, Lock, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export const systemProjects = [
  {
    name: 'Autodemy',
    description: 'Smart Academic Management System',
    url: '/autodemy/app-release.apk',
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

export const ProjectCard = ({ project }: { project: any }) => (
  <div className="group relative overflow-hidden rounded-lg border border-border bg-transparent p-5 hover:border-foreground/30 hover:shadow-sm transition-all duration-300 cursor-pointer">
    <div className="relative z-10 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-foreground text-sm font-bold">
          {project.name}
        </h3>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          {project.description}
        </p>
      </div>
      <div className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0">
        {!project.hideLink ? <ExternalLink size={14} /> : project.status === 'In Development' ? <Wrench size={14} /> : <Lock size={14} />}
      </div>
    </div>
    {project.hideLink ? (
      <span className="text-muted-foreground/70 mt-4 inline-flex items-center gap-1.5 text-xs font-semibold relative z-10 bg-muted/50 px-2 py-1 rounded-sm">
        {project.status === 'In Development' ? '🚧 In Development' : '🔒 Private Project'}
      </span>
    ) : (
      <a
        href={project.url.startsWith('http') || project.url.startsWith('/') ? project.url : `https://${project.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-4 inline-block text-xs font-semibold relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {project.urlLabel || project.url}
      </a>
    )}
  </div>
);

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


export function RecentProjects() {
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Recent Projects & Academic Papers
        </h2>
        <Link to="/projects" className="flex items-center gap-1 text-foreground hover:text-muted-foreground transition-colors text-sm font-semibold">
          View All <ChevronRight size={16} />
        </Link>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        
        {/* Column 1: System Projects */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
            System Projects
          </h2>
          <div className="flex flex-col gap-4">
            {systemProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>

        {/* Column 2: Academic Projects */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
            Academic & Thesis
          </h2>
          <div className="flex flex-col gap-4">
            {academicProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
