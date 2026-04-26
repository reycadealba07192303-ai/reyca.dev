import { useState } from 'react';
import { Maximize, Sparkles, Cpu, MapPin } from 'lucide-react';

export function AboutSection() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex gap-8 flex-col md:flex-row mt-4">
      {/* About Text */}
      <div className="flex-1">
        <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">
          About
        </h2>
        <div className="space-y-4 text-foreground text-sm leading-relaxed">
          <p>
            I'm Reyca De Alba, a full-stack developer who builds practical web, mobile, and AI-supported applications. My work is focused on software that is usable, reliable, and built around real workflows.
          </p>
          <p>
            Most of my experience comes from academic research, legal data workflows, and freelance IT projects. These projects usually involve multi-role processes, real-time data, structured operations, and interfaces that need to stay clear and easy to use.
          </p>
          <p>
            My main strengths are full-stack web development using the MERN stack, cross-platform app development with Flutter, and applying AI where it has a clear purpose. I focus on building software that helps clients manage work better, reduce manual effort, and make day-to-day operations more efficient.
          </p>
        </div>

        {/* Highlights / Stats Section */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 mt-10 pt-8 border-t border-border/50">
          <div>
            <p className="text-foreground text-2xl font-bold tracking-tight">3+ Years</p>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-1">Dev Experience</p>
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold tracking-tight">100%</p>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-1">Consistent Dean's Lister</p>
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold tracking-tight">Academic</p>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-1">Full Scholar</p>
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold tracking-tight">7+</p>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-1">Production Systems</p>
          </div>
        </div>
      </div>

      {/* Side Profile Card (Animated 3D Flip) */}
      <div
        className="flex-shrink-0 w-full md:w-64 [perspective:1000px] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        >

          {/* Front Face */}
          <div className="[backface-visibility:hidden] rounded-[1.25rem] bg-[#1a1a1a] border border-[#333333] p-6 flex flex-col gap-8 shadow-sm">
            {/* Header Icons & Badge */}
            <div className="flex justify-between items-start">
              <Maximize size={18} className="text-white/60 mt-1" />
              <div className="flex items-center gap-1.5 border border-white/20 rounded-md px-2.5 py-1 text-white/70">
                <Sparkles size={10} />
                <span className="text-[10px] font-bold tracking-widest">SINCE 2022</span>
              </div>
            </div>

            {/* Name & Title */}
            <div>
              <p className="text-white/50 text-[10px] font-bold tracking-[0.15em] uppercase mb-2">Software Developer</p>
              <h3 className="text-white text-3xl font-bold leading-[1.1] tracking-tight mb-3">
                Reyca<br />De Alba
              </h3>
              <p className="text-white/80 text-sm font-medium">AI & Full-Stack Developer</p>
            </div>

            {/* Details List */}
            <div className="space-y-5">
              <div>
                <p className="text-white/50 text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5">Profile Card</p>
                <p className="text-white text-sm font-bold">Multi-platform Systems</p>
              </div>

              <div>
                <p className="text-white/50 text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5">Focus</p>
                <p className="text-white text-sm font-bold leading-snug">Academic, legal,<br />and business</p>
              </div>

              <div>
                <p className="text-white/50 text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5">Base</p>
                <p className="text-white text-sm font-bold">Sampaloc, Manila, Philippines</p>
              </div>
            </div>

            {/* Bottom Badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 border border-[#333] bg-[#222] rounded-md px-3 py-2 w-max">
                <Cpu size={13} className="text-white/70" />
                <span className="text-white/90 text-[13px] font-medium">Production systems</span>
              </div>
              <div className="flex items-center gap-2 border border-[#333] bg-[#222] rounded-md px-3 py-2 w-max">
                <MapPin size={13} className="text-white/70" />
                <span className="text-white/90 text-[13px] font-medium">Philippines</span>
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[1.25rem] bg-[#1a1a1a] border border-[#333333] p-6 flex flex-col items-center justify-center gap-6 shadow-sm">
            <p className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase text-center leading-relaxed">
              Connect<br />with me
            </p>

            {/* Real QR Image - Maximized inside smaller card */}
            <div className="w-44 h-44 bg-white rounded-xl p-2.5 border border-white/20 overflow-hidden flex items-center justify-center shadow-2xl">
              <img 
                src="/QR/0a644bdb-6044-4850-901e-a386b0b4a41c.jpg" 
                alt="QR Code" 
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-white text-sm font-bold tracking-[0.15em] uppercase">
              SCAN CARD
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

