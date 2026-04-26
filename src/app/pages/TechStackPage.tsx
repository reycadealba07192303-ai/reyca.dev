import { ChevronLeft, Share2, Target, Cloud, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { PortfolioFooter } from '../components/PortfolioFooter';

const techStack = [
  {
    category: 'Frontend',
    items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Flutter', 'Dart', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Python', 'Java', 'Express.js', 'Fast API', 'MongoDB', 'Firebase', 'Supabase', 'REST APIs'],
  },
  {
    category: 'AI & Tools',
    items: ['Gemini', 'OpenAI', 'MediaPipe', 'PyTorch', 'YOLOv8n', 'Jupyter', 'GitHub', 'Vite'],
  },
  {
    category: 'Deployment',
    items: ['Vercel', 'Render', 'Cloudflare'],
  },
  {
    category: 'Hardware & IoT',
    items: ['Raspberry Pi', 'IoT Systems', 'RFID Integration'],
  },
];

const getLogo = (name: string) => {
  const logos: Record<string, string> = {
    'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    'Flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
    'Dart': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg',
    'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    'Express.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
    'Fast API': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
    'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
    'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg',
    'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
    'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg',
    'Jupyter': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg',
    'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    'OpenAI': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg',
    'Gemini': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlegemini.svg',
    'Raspberry Pi': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/raspberrypi.svg',
    'Vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
    'Vercel': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vercel.svg',
    'Render': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/render.svg',
    'Cloudflare': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg',
  };
  return logos[name] || null;
};

const FallbackIcon = ({ name }: { name: string }) => {
  if (name === 'MediaPipe') return <Share2 size={16} />;
  if (name === 'YOLOv8n') return <Target size={16} />;
  if (name === 'IoT Systems') return <Cloud size={16} />;
  if (name === 'RFID Integration') return <Wifi size={16} />;
  if (name === 'REST APIs') return <Share2 size={16} />;
  return null;
};

export function TechStackPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ChevronLeft size={18} />
          Back to Home
        </Link>
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Complete Tech Stack
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Here is a comprehensive list of all the technologies, frameworks, and tools I use to build scalable, modern applications.
        </p>
      </div>

      <div className="space-y-10">
        {techStack.map((group) => (
          <div key={group.category} className="group">
            <h2 className="text-foreground font-bold mb-5 text-xl">
              {group.category}
            </h2>
            <div className="flex flex-wrap gap-3">
              {group.items.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-2 bg-transparent border border-border/50 text-foreground transition-colors cursor-default text-sm font-medium px-5 py-2 rounded-full"
                >
                  {getLogo(tech) ? (
                    <img 
                      src={getLogo(tech)!} 
                      alt={tech} 
                      className={`w-4 h-4 object-contain ${['Next.js', 'Express.js', 'GitHub', 'OpenAI', 'Gemini', 'Raspberry Pi', 'Vercel', 'Render'].includes(tech) ? 'dark:invert' : ''}`} 
                    />
                  ) : (
                    <FallbackIcon name={tech} />
                  )}
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <PortfolioFooter />
      </div>
    </div>
  );
}
