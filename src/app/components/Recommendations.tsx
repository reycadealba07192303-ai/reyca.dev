import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const recommendations = [
  {
    name: 'Analyn Entico',
    role: 'Client',
    text: "Superrrr galinggg, nagawa ang pinapagawa ko 100/10, clean ang pagkakagawa, thankyouuu so muchhh po🥰",
    avatar: 'AE',
  },
  {
    name: 'Nicole Fumera',
    role: 'Client',
    text: "SUPER GALING, SA UULITIN!",
    avatar: 'NF',
  },
  {
    name: 'Jham Sulit',
    role: 'Client',
    text: "Ate, kabog kaa, sabi nung prof and panels namin, maganda daw yung system and paper, may mga papa enhance pa po kami pero so far, super galing mo po hihi, highly recommended si atecoo!!",
    avatar: 'JS',
  },
  {
    name: 'Jom Briones',
    role: 'Client',
    text: "Ate thank u po talaga, bilis nyo po gumawa nang system tapos maganda pa, highly recommended poo!",
    avatar: 'JB',
  },
  {
    name: 'Jazmine Isabelled Guban',
    role: 'Client',
    text: "Excellent pooo and complete deliverables + minor revision kami pooo. salamat pooo!",
    avatar: 'JG',
  },
];

const avatarColors = [
  'bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600', 'bg-pink-600',
];


export function Recommendations() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? recommendations.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === recommendations.length - 1 ? 0 : c + 1));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c === recommendations.length - 1 ? 0 : c + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const rec = recommendations[current];

  return (
    <div className="pt-2">
      <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">
        Recommendations
      </h2>

      <div className="relative">
        <div className="flex flex-col gap-3">
          {/* Quote */}
          <p className="text-foreground/80 italic text-sm leading-relaxed border-l-2 border-border pl-4 py-0.5">
            "{rec.text}"
          </p>
          {/* Author */}
          <div className="flex items-center gap-3 mt-2">
            <div className={`w-8 h-8 rounded-full ${avatarColors[current % avatarColors.length]} flex items-center justify-center text-white flex-shrink-0 text-xs font-bold tracking-wider`}>
              {rec.avatar}
            </div>
            <div>
              <p className="text-foreground text-sm font-bold">{rec.name}</p>
              <p className="text-muted-foreground text-xs font-medium">{rec.role}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <button
            onClick={prev}
            className="w-7 h-7 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {recommendations.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: i === current ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                  opacity: i === current ? 1 : 0.4
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-7 h-7 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

