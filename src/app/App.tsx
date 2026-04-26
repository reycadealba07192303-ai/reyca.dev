import { ThemeProvider } from 'next-themes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { TechStackPage } from './pages/TechStackPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MilestonesPage } from './pages/MilestonesPage';
import { FloatingChat } from './components/FloatingChat';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tech-stack" element={<TechStackPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
          </Routes>
          <FloatingChat />
        </Router>
      </div>
    </ThemeProvider>
  );
}
