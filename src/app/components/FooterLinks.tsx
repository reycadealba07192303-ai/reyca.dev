import { Mail, Phone, Link as LinkIcon, Compass, Facebook, Instagram, MessageCircle } from 'lucide-react';

export function FooterLinks() {
  return (
    <div className="pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {/* Core Memberships */}
        <div>
          <p className="text-foreground mb-6 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
            <Compass size={14} className="text-muted-foreground" /> Memberships
          </p>
          <div className="space-y-4">
            <a
              href="https://www.facebook.com/NULIBRO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 group cursor-pointer hover:no-underline"
            >
              <span className="text-muted-foreground mt-0.5 flex-shrink-0 text-[10px]">◉</span>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors text-sm font-medium leading-relaxed">
                NU LIBRO Organization
              </p>
            </a>
            <a
              href="https://www.facebook.com/spmadrid.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 group cursor-pointer hover:no-underline"
            >
              <span className="text-muted-foreground mt-0.5 flex-shrink-0 text-[10px]">◉</span>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors text-sm font-medium leading-relaxed">
                SPMadrid Law and Associates
              </p>
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <p className="text-foreground mb-6 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
            <LinkIcon size={14} className="text-muted-foreground" /> Social Links
          </p>
          <div className="space-y-3.5">
            <a
              href="https://www.facebook.com/DealbaReyca072303/posts/pfbid02jn8qMdHtdXXchiMnJTwuF2jYBYkCEJWBQ1eiQNzbUCXYwnsJcNxLd2d3uQDfzJxdl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-muted-foreground hover:text-blue-500 transition-colors group hover:no-underline"
            >
              <div className="w-7 h-7 rounded bg-transparent border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                <Facebook size={14} className="text-muted-foreground group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-semibold text-foreground">Facebook</span>
            </a>
            <a
              href="https://www.linkedin.com/in/reyca-de-alba-522a51372"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-muted-foreground hover:text-blue-500 transition-colors group hover:no-underline"
            >
              <div className="w-7 h-7 rounded bg-transparent border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700 group-hover:border-blue-700 transition-colors">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-muted-foreground group-hover:fill-white transition-colors">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">LinkedIn</span>
            </a>
            <a
              href="https://github.com/reycadealba07192303-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group hover:no-underline"
            >
              <div className="w-7 h-7 rounded bg-transparent border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-foreground group-hover:border-foreground transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-muted-foreground group-hover:fill-background transition-colors">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">GitHub</span>
            </a>
            <a
              href="https://www.threads.com/@rycdlb_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group hover:no-underline"
            >
              <div className="w-7 h-7 rounded bg-transparent border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-foreground group-hover:border-foreground transition-colors">
                <MessageCircle size={14} className="text-muted-foreground group-hover:text-background transition-colors" />
              </div>
              <span className="text-sm font-semibold text-foreground">Threads</span>
            </a>
            <a
              href="https://www.instagram.com/rycdlb_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-muted-foreground hover:text-pink-500 transition-colors group hover:no-underline"
            >
              <div className="w-7 h-7 rounded bg-transparent border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-pink-600 group-hover:border-pink-600 transition-colors">
                <Instagram size={14} className="text-muted-foreground group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-semibold text-foreground">Instagram</span>
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-foreground mb-6 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
            <Mail size={14} className="text-muted-foreground" /> Contact
          </p>
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-2">Email</p>
              <a href="mailto:reycadealba07192303@gmail.com" className="text-blue-500 hover:underline text-sm font-medium">
                reycadealba07192303@gmail.com
              </a>
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-2">Phone</p>
              <div className="flex items-center gap-2 text-foreground">
                <Phone size={14} className="text-muted-foreground" />
                <span className="text-sm font-semibold">
                  +63 9948097112
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
