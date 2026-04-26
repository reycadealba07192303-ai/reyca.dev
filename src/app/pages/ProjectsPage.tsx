import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { PortfolioFooter } from '../components/PortfolioFooter';
import { systemProjects, academicProjects, ProjectCard } from '../components/Projects';

export function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
          All Projects & Academic Papers
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Here is a comprehensive list of all the systems and academic papers I have worked on, including live applications and private research documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
        {/* Column 1: System Projects */}
        <div>
          <h2 className="text-foreground font-bold mb-6 text-xl border-b border-border/50 pb-2">
            System Projects
          </h2>
          <div className="flex flex-col gap-5">
            {systemProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>

        {/* Column 2: Academic Projects */}
        <div>
          <h2 className="text-foreground font-bold mb-6 text-xl border-b border-border/50 pb-2">
            Academic & Thesis
          </h2>
          <div className="flex flex-col gap-5">
            {academicProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <PortfolioFooter />
      </div>
    </div>
  );
}
