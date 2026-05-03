import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const galleryItems = [
  {
    title: 'Gabay Alalay',
    description: 'VAWC Management System',
    thumbnail: '/gabay alalay/15883bf2-e61e-4c5b-a838-eb4abc2d460c.jpg',
    album: [
      '/gabay alalay/15883bf2-e61e-4c5b-a838-eb4abc2d460c.jpg',
      '/gabay alalay/1fdbf35a-89cc-4fd1-ad08-fe655e99b93a.jpg',
      '/gabay alalay/41c6a46b-d481-4caa-955b-c3960c14c18d.jpg',
      '/gabay alalay/4b74927b-33bc-41e1-8855-b47b2cd906d5.jpg',
      '/gabay alalay/a142fc6f-9edd-400d-bef2-5d1a817708dc.jpg',
      '/gabay alalay/b02453f1-4a02-4a89-ad24-b9a9a119cffb.jpg',
      '/gabay alalay/f5928681-c34e-455a-a065-e419a27de964.jpg'
    ]
  },
  {
    title: 'Lawbot AI',
    description: 'AI-Powered Legal Assistant',
    thumbnail: '/Lawbot/Screenshot 2026-04-26 010822.png',
    album: [
      '/Lawbot/Screenshot 2026-04-26 010822.png',
      '/Lawbot/Screenshot 2026-04-26 010835.png',
      '/Lawbot/Screenshot 2026-04-26 010850.png',
      '/Lawbot/Screenshot 2026-04-26 010904.png'
    ]
  },
  {
    title: 'IntelliAccess',
    description: 'AI Vehicle Control System',
    thumbnail: '/Intelliaccess/38975307-95b8-4a00-8329-5801731ca410.jpg',
    album: [
      '/Intelliaccess/38975307-95b8-4a00-8329-5801731ca410.jpg',
      '/Intelliaccess/4f76d535-470b-422a-81d5-a952c65501df.jpg',
      '/Intelliaccess/a633a7f9-9421-4af7-aa06-ffe1ac56f20a.jpg'
    ]
  },
  {
    title: '903rd Battalion IS',
    description: 'Record Management System',
    thumbnail: '/903rd/Screenshot 2026-04-26 011847.png',
    video: '/903rd/Screen Recording 2026-04-08 194728.mp4',
    album: []
  },
  {
    title: 'InCloud Thesis',
    description: 'Inventory Management System',
    thumbnail: '/InCloud/Screenshot2026-03-01000438.webp',
    album: [
      '/InCloud/Screenshot2026-03-01000438.webp',
      '/InCloud/Screenshot2026-03-01000450.webp',
      '/InCloud/Screenshot2026-03-01000505.webp',
      '/InCloud/Screenshot2026-03-01000521.webp',
      '/InCloud/Screenshot2026-03-01000535.webp'
    ]
  },
  {
    title: 'SmartCash',
    description: 'Financial Literacy LMS',
    thumbnail: '/smartcash/Screenshot 2026-04-26 011116.png',
    album: [
      '/smartcash/Screenshot 2026-04-26 011116.png',
      '/smartcash/Screenshot 2026-04-26 011129.png',
      '/smartcash/Screenshot 2026-04-26 011140.png',
      '/smartcash/Screenshot 2026-04-26 011151.png',
      '/smartcash/Screenshot 2026-04-26 011204.png',
      '/smartcash/Screenshot 2026-04-26 011216.png',
      '/smartcash/Screenshot 2026-04-26 011240.png'
    ]
  },
  {
    title: 'Autodemy',
    description: 'Smart Academic Management System',
    thumbnail: '/autodemy/login_screen.png',
    album: [
      '/autodemy/login_screen.png'
    ],
    downloadUrl: 'https://drive.google.com/file/d/1rDC5jv4bWWb6Bi9bAUnzUfEf7VEhd4ww/view?usp=sharing'
  }
];

export function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
    }
  };

  const closePreview = () => {
    setActiveItem(null);
    setActiveImgIndex(0);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeItem?.album) return;
    setActiveImgIndex((prev) => (prev + 1) % activeItem.album.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeItem?.album) return;
    setActiveImgIndex((prev) => (prev - 1 + activeItem.album.length) % activeItem.album.length);
  };

  return (
    <div className="pt-2">
      {/* Preview Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={closePreview}
        >
          <div className="relative max-w-5xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closePreview}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50"
            >
              <X size={24} />
            </button>

            {activeItem.video ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
                <video
                  src={activeItem.video}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
            ) : (
              <>
                {activeItem.album.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-0 md:left-[-60px] text-white hover:text-gray-300 transition-colors z-50 bg-black/20 p-2 rounded-full"
                    >
                      <ChevronLeft size={36} />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-0 md:right-[-60px] text-white hover:text-gray-300 transition-colors z-50 bg-black/20 p-2 rounded-full"
                    >
                      <ChevronRight size={36} />
                    </button>
                  </>
                )}

                <div className="relative w-full">
                  {activeItem.downloadUrl && (
                    <div className="absolute top-4 right-4 z-50">
                      <a
                        href={activeItem.downloadUrl}
                        download
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20 transition-all flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Download APK
                      </a>
                    </div>
                  )}
                  <img
                    src={activeItem.album[activeImgIndex]}
                    alt="Project Preview"
                    className="w-full rounded-lg shadow-2xl object-contain max-h-[80vh] mx-auto transition-all duration-300"
                  />
                  {activeItem.album.length > 1 && (
                    <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center gap-2">
                      {activeItem.album.map((_: any, i: number) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImgIndex ? 'bg-white w-4' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Project Gallery
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {galleryItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group snap-center border border-border bg-muted/20 hover:border-foreground/30 transition-all duration-300"
            style={{ width: '280px' }}
            onClick={() => setActiveItem(item)}
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
              {item.album.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  {item.album.length} PHOTOS
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-foreground text-sm font-bold truncate">{item.title}</p>
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
