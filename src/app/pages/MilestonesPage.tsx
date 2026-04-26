import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { PortfolioFooter } from '../components/PortfolioFooter';

const certifications = [
  {
    name: 'Certificate of Presentation – ReCCIT 2025',
    issuer: 'National University',
    description: 'InCloud: An Integrated Cloud-Based Mobile And Web Inventory Management System With Data Analytics',
    image: '/2e372194-a1f9-49b5-9045-da1071277088.jpg',
    link: null,
    date: 'December 10, 2025',
  },
  {
    name: 'Certified Fundamentals in Cybersecurity',
    issuer: 'Fortinet',
    description: 'NSE 1 & NSE 2 Network Security Associate',
    image: null,
    link: '/cert-fortinet.pdf',
    date: '2024',
  },
  {
    name: 'Cybersecurity Essentials & M365',
    issuer: 'Microsoft Learn',
    description: 'Microsoft Security, Compliance, and Identity Fundamentals',
    image: null,
    link: 'https://nationalueduph-my.sharepoint.com/:f:/g/personal/dealbard_students_national-u_edu_ph/IgDfb6LvXqJ4T6L1UZtMft9aARhn-K4d4LX0UQQ3FUs61_E?e=wjM3YP',
    date: '2024',
  },
  {
    name: 'Power BI & Azure Fundamentals',
    issuer: 'Microsoft Learn',
    description: 'Data Analytics and Cloud Computing',
    image: null,
    link: 'https://nationalueduph-my.sharepoint.com/:f:/g/personal/dealbard_students_national-u_edu_ph/IgDfb6LvXqJ4T6L1UZtMft9aARhn-K4d4LX0UQQ3FUs61_E?e=wjM3YP',
    date: '2024',
  },
  {
    name: 'Intro to the Threat Landscape 3.0',
    issuer: 'Fortinet',
    description: 'Cybersecurity Threat Intelligence',
    image: null,
    link: '/cert-cybersecurity.pdf',
    date: '2024',
  },
  {
    name: 'With High Honors – Senior High School Graduation',
    issuer: 'Cristo Rey High School',
    description: 'Academic Excellence Award for Senior High School Graduation',
    image: '/476349055_1681330532739157_696913399381373498_n.jpg',
    link: null,
    date: '2022',
  },
];

const issuerColors: Record<string, string> = {
  'National University': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Fortinet': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Microsoft Learn': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  'Cristo Rey High School': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

export function MilestonesPage() {
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const closePreview = () => {
    setPreviewImages(null);
    setActiveImgIndex(0);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewImages) return;
    setActiveImgIndex((prev) => (prev + 1) % previewImages.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewImages) return;
    setActiveImgIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Image Preview Modal */}
      {previewImages && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closePreview}
        >
          <div className="relative max-w-2xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closePreview}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50"
            >
              <X size={24} />
            </button>

            {previewImages.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-[-50px] text-white hover:text-gray-300 transition-colors hidden md:block"
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-[-50px] text-white hover:text-gray-300 transition-colors hidden md:block"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            <div className="relative w-full">
              <img
                src={previewImages[activeImgIndex]}
                alt="Preview"
                className="w-full rounded-lg shadow-2xl object-contain max-h-[85vh] mx-auto"
              />
              {previewImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-xs font-medium">
                  {activeImgIndex + 1} / {previewImages.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          Milestones & Certifications
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Certifications, awards, and academic achievements earned throughout my journey as a developer.
        </p>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className={`group border border-border/50 rounded-xl p-5 transition-all hover:border-border ${
              cert.image || cert.link ? 'cursor-pointer hover:bg-muted/30' : ''
            }`}
            onClick={() => {
              if (cert.image) setPreviewImages([cert.image]);
              else if (cert.link) window.open(cert.link, '_blank');
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${issuerColors[cert.issuer] ?? 'bg-muted text-muted-foreground border-border'}`}>
                    {cert.issuer}
                  </span>
                  {cert.date && (
                    <span className="text-[10px] text-muted-foreground/60 font-medium">{cert.date}</span>
                  )}
                </div>
                <p className="text-foreground font-bold text-base leading-snug mb-1">
                  {cert.name}
                </p>
                {cert.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {cert.description}
                  </p>
                )}
              </div>
              {(cert.image || cert.link) && (
                <span className="text-blue-500 flex-shrink-0 mt-1">
                  <ExternalLink size={16} />
                </span>
              )}
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
