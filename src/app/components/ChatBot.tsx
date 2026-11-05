import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Loader2, User, Bot } from 'lucide-react';

// The bot appends a ```BOOKING_DATA``` block for the server; visitors shouldn't see it (even half-streamed)
const visibleText = (text: string) => text
  .replace(/```BOOKING_DATA[\s\S]*?(```|$)/, '')
  .replace(/\*/g, '')
  .replace(/^\s{0,3}#{1,6}\s+/gm, '')
  .trim();

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

    // Add empty bot message for streaming
    setMessages(prev => [...prev, { role: 'bot', text: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage, conversationId })
      });

      if (!response.ok) throw new Error('Failed to connect to AI server');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Keep the trailing partial line for the next read
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              let data;
              try {
                data = JSON.parse(line.slice(6));
              } catch (e) {
                continue; // malformed line, skip
              }

              if (data.error) throw new Error(data.error);

              if (data.chunk) {
                  fullText += data.chunk;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'bot', text: fullText };
                    return newMessages;
                  });
                }

              if (data.conversationId) {
                setConversationId(data.conversationId);
              }
            }
          }
        }
      }

      if (!fullText) throw new Error('No reply received');
    } catch (error: any) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'bot',
          text: "Sorry, I can't reply right now. Please try again in a moment, or message Reyca on Messenger: m.me/DealbaReyca072303"
        };
        return newMessages;
      });
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
        {messages.filter((msg) => visibleText(msg.text)).map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap break-words ${
              msg.role === 'user' 
                ? 'bg-foreground text-background rounded-tr-none' 
                : 'bg-muted border border-border text-foreground rounded-tl-none'
            }`}>
              {visibleText(msg.text)}
            </div>
          </div>
        ))}
        {isLoading && !visibleText(messages[messages.length - 1]?.text ?? '') && (
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
          Powered by AI
        </p>
      </div>
    </div>
  );
}
