import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatBot } from './ChatBot';

export function FloatingChat() {
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 150;
      setIsVisible(scrollPosition < threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 group ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
        }`}
      >
        <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-bold tracking-tight">Chat with Reyca</span>
      </button>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
