import { MessageCircle } from 'lucide-react';

export function PortfolioFooter() {
  return (
    <div className="mt-6 px-3 py-6 flex flex-col sm:flex-row items-center justify-between max-w-3xl mx-auto gap-4 border-t border-border/30">
      <p className="text-muted-foreground text-xs font-medium tracking-wide">
        © 2026 Reyca De Alba. All rights reserved.
      </p>
      <button className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 hover:bg-primary/90 transition-colors shadow-md text-sm font-semibold hover:scale-105 active:scale-95 duration-300">
        <MessageCircle size={16} />
        Chat with Reyca
      </button>
    </div>
  );
}
