import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Loader2, User, Bot } from 'lucide-react';

// Base knowledge from resume and system
const REYCA_KB = `
Name: Reyca Dela Cruz De Alba
Roles: Data Analyst, AI Engineer, Full-Stack Developer
Location: Sampaloc, Manila, Philippines

Education:
- BS Information Technology, National University (2022 - Present)
- Senior High School, Cristo Rey High School (Graduated With High Honors)

Key Achievements:
- Consistent Dean's Lister (1st Year to 4th Year)
- Academic Full Scholar

Experience:
- Data Analyst & AI Engineer [Intern] at SPMadrid Law and Associates (2026)
- Lead Developer & Project Manager for InCloud Thesis Project (2025)
- Academic Freelancer & IT Support (2022)

Top Projects:
- Gabay Alalay: VAWC Management System
- Lawbot AI: AI-Powered Legal Assistant
- IntelliAccess: AI Vehicle Control System
- 903rd Battalion IS: Record Management System
- InCloud Thesis: Integrated Cloud-Based Inventory System
- SmartCash: Financial Literacy LMS

Certifications:
- ReCCIT 2025 Certificate of Presentation
- Fortinet: Fundamentals in Cybersecurity (NSE 1 & 2), Threat Landscape
- Microsoft: Cybersecurity Essentials, M365, Power BI & Azure Fundamentals

Socials:
- Facebook: https://www.facebook.com/DealbaReyca072303/
- LinkedIn: www.linkedin.com/in/reyca-de-alba-522a51372
- GitHub: https://github.com/reycadealba07192303-ai
- Messenger: https://m.me/DealbaReyca072303
`;

const SYSTEM_PROMPT = `
You are Reyca's AI Assistant. Your job is to represent Reyca Dela Cruz De Alba and answer inquiries about her professional background, skills, and projects.

STRICT LIMITATIONS:
1. Base your answers ONLY on the provided knowledge about Reyca:
${REYCA_KB}
2. If a user asks a question NOT related to Reyca (e.g., math like 1+1, general knowledge, history, other people), you MUST politely refuse and state: "I can only answer questions related to Reyca's professional background, skills, and portfolio."
3. Speak professionally and helpfully, as if you are Reyca's personal representative.
4. Keep answers concise and direct.
`;

export function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm Reyca's AI assistant. Ask me anything about her work, education, or projects!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage,
          conversationId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to backend');
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[110] w-[350px] sm:w-[400px] h-[500px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-foreground text-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <div>
            <p className="text-sm font-bold tracking-tight">Reyca AI Bot</p>
            <p className="text-[10px] opacity-70">Always Online</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-foreground text-background rounded-tr-none' 
                : 'bg-muted border border-border text-foreground rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted border border-border text-foreground p-3 rounded-2xl rounded-tl-none">
              <Loader2 size={16} className="animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about my projects..."
            className="w-full bg-muted border border-border rounded-xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-foreground hover:bg-foreground/10 rounded-lg transition-colors disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}
