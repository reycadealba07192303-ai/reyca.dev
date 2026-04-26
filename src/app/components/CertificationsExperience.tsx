import { ChevronRight, ChevronLeft, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const certifications = [
  {
    name: 'Certificate of Presentation – ReCCIT 2025',
    issuer: 'National University',
    description: 'InCloud: An Integrated Cloud-Based Mobile And Web Inventory Management System With Data Analytics',
    image: '/2e372194-a1f9-49b5-9045-da1071277088.jpg',
    link: null,
  },
  {
    name: 'Certified Fundamentals in Cybersecurity',
    issuer: 'Fortinet',
    description: 'NSE 1 & NSE 2 Network Security Associate',
    image: null,
    link: '/cert-fortinet.pdf',
  },
  {
    name: 'Cybersecurity Essentials & M365',
    issuer: 'Microsoft Learn',
    description: 'Microsoft Security, Compliance, and Identity Fundamentals',
    image: null,
    link: 'https://nationalueduph-my.sharepoint.com/:f:/g/personal/dealbard_students_national-u_edu_ph/IgDfb6LvXqJ4T6L1UZtMft9aARhn-K4d4LX0UQQ3FUs61_E?e=wjM3YP',
  },
  {
    name: 'Power BI & Azure Fundamentals',
    issuer: 'Microsoft Learn',
    description: 'Data Analytics and Cloud Computing',
    image: null,
    link: 'https://nationalueduph-my.sharepoint.com/:f:/g/personal/dealbard_students_national-u_edu_ph/IgDfb6LvXqJ4T6L1UZtMft9aARhn-K4d4LX0UQQ3FUs61_E?e=wjM3YP',
  },
  {
    name: 'Intro to the Threat Landscape 3.0',
    issuer: 'Fortinet',
    description: 'Cybersecurity Threat Intelligence',
    image: null,
    link: '/cert-cybersecurity.pdf',
  },
  {
    name: 'With High Honors – Senior High School Graduation',
    issuer: 'Cristo Rey High School',
    description: 'Academic Excellence Award for Senior High School Graduation',
    image: '/476349055_1681330532739157_696913399381373498_n.jpg',
    link: null,
  },
];


const experience = [
  {
    role: 'Data Analyst & AI Engineer [Intern]',
    company: 'SPMadrid Law and Associates',
    year: '2026',
    images: [
      '/c678e0ac-d757-42f8-a698-4c81d2dd8e81.jpg',
      '/b3fe39de-c3cf-4f22-90ce-aa3a894b469a.jpg',
      '/5eb37691-42d1-4a68-bf40-aeefa4fb6b81.jpg'
    ]
  },
  {
    role: 'Lead Developer & Project Manager',
    company: 'InCloud Thesis Project',
    year: '2025',
    images: ['/42e000d5-aa74-4410-96c6-a3acfd7e49a0.jpg']
  },
  {
    role: 'Academic Freelancer & IT Support',
    company: 'Remote Services',
    year: '2022',
    images: ['/647735147_1989301878608686_7666294767600511260_n.jpg'],
    link: 'https://www.facebook.com/share/p/1bjfxm5KJx/'
  },
  {
    role: 'BS Information Technology Student',
    company: 'National University',
    year: '2022',
    images: ['/476806278_1681388009400076_7588570382732319237_n.jpg']
  },
];

export function CertificationsExperience() {
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const visibleCerts = certifications.slice(0, 2);

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
    <>
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
                {/* Mobile controls */}
                <div className="absolute bottom-[-40px] left-0 right-0 flex justify-center gap-4 md:hidden">
                  <button onClick={prevImg} className="text-white bg-white/10 p-2 rounded-full"><ChevronLeft size={20} /></button>
                  <button onClick={nextImg} className="text-white bg-white/10 p-2 rounded-full"><ChevronRight size={20} /></button>
                </div>
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

      <div className="flex gap-8 flex-col sm:flex-row pt-2">
        {/* Certifications */}
        <div className="flex-shrink-0 sm:w-64">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Milestones
            </h2>
            <Link
              to="/milestones"
              className="flex items-center gap-1 text-foreground hover:text-muted-foreground transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {visibleCerts.map((cert) => (
              <div
                key={cert.name}
                className={`border-b border-border/50 pb-4 last:border-0 last:pb-0 group ${cert.image || cert.link ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => {
                  if (cert.image) setPreviewImages([cert.image]);
                  else if (cert.link) window.open(cert.link, '_blank');
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-foreground text-sm font-bold group-hover:text-muted-foreground transition-colors">
                      {cert.name}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs font-medium uppercase tracking-wide">
                      {cert.issuer}
                    </p>
                    {cert.description && (
                      <p className="text-muted-foreground/70 mt-1 text-xs leading-relaxed">
                        {cert.description}
                      </p>
                    )}
                  </div>
                  {(cert.image || cert.link) && (
                    <span className="text-xs text-blue-500 flex-shrink-0 mt-0.5">
                      <ExternalLink size={12} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight mb-6 text-foreground">
            Experience
          </h2>
          <div className="relative ml-2">
            {/* Vertical line */}
            <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-border rounded-full" />
            <div className="space-y-6">
              {experience.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-5 relative group ${item.images || item.link ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => {
                    if (item.images) setPreviewImages(item.images);
                    else if (item.link) window.open(item.link, '_blank');
                  }}
                >
                  {/* Bullet */}
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-4 border-background z-10 mt-0.5 transition-colors duration-300 ${index < 2 ? 'bg-foreground' : 'bg-muted-foreground/30'
                      }`}
                  />
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-foreground text-sm font-bold group-hover:text-muted-foreground transition-colors">
                        {item.role}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {item.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.images && (
                        <span className="text-xs text-blue-500 group-hover:scale-110 transition-transform">
                          <ExternalLink size={12} />
                        </span>
                      )}
                      <span className="text-muted-foreground/80 flex-shrink-0 text-xs font-bold bg-muted px-2 py-1 rounded-md">
                        {item.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

