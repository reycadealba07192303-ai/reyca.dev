import { MapPin, CheckCircle2, ChevronRight, Mail, Download, BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function ProfileHeader() {
  return (
    <div className="pt-4 pb-2">
      <div className="flex items-start gap-5">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          <img
            src="/profile-1.png"
            alt="Reyca De Alba"
            className="w-32 h-32 object-cover rounded-sm"
            style={{ objectPosition: '50% 20%' }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Reyca Dela Cruz De Alba
              </h1>
              <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0" fill="currentColor" color="var(--color-background)" />
            </div>
            {/* Top-right toggle */}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground mt-1 text-sm font-medium">
            <MapPin size={14} />
            <span>Sampaloc, Manila, Philippines</span>
          </div>

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <p className="text-foreground text-sm font-medium">
              Data Analyst &nbsp;\&nbsp; AI Engineer &nbsp;\&nbsp; Full-Stack Developer
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <a 
              href="/Resume/Reyca_De_Alba_Resume.docx"
              download
              className="flex items-center gap-2 bg-foreground text-background rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Download size={14} />
              Download Resume
            </a>
            <a
              href="https://m.me/DealbaReyca072303"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-transparent text-foreground border border-border rounded-md px-4 py-2 text-sm font-semibold hover:bg-muted/50 transition-colors"
            >
              <Mail size={14} />
              Send Message
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
