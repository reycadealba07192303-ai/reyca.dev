'use client';

import { useEffect, useRef } from 'react';

export function PortfolioCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const capability = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const root = document.documentElement;
    let frame = 0;
    const hide = () => {
      cancelAnimationFrame(frame);
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      delete root.dataset.portfolioCursor;
    };
    const move = (event: PointerEvent) => {
      if (!capability.matches || event.pointerType === 'touch') { hide(); return; }
      const target = event.target instanceof Element ? event.target : null;
      // Keep the familiar native text cursor for inputs and text selection.
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) { hide(); return; }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.style.opacity = '1';
        cursor.dataset.interactive = target?.closest('a, button, [role="button"], .cursor-pointer') ? 'true' : 'false';
        root.dataset.portfolioCursor = 'true';
      });
    };
    const press = (event: PointerEvent) => {
      if (event.pointerType === 'touch') { hide(); return; }
      if (cursorRef.current) cursorRef.current.dataset.pressed = 'true';
    };
    const release = () => { if (cursorRef.current) cursorRef.current.dataset.pressed = 'false'; };
    const key = (event: KeyboardEvent) => { if (event.key === 'Tab') hide(); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('blur', hide);
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('keydown', key);
    capability.addEventListener('change', hide);
    return () => {
      cancelAnimationFrame(frame);
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('blur', hide);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('keydown', key);
      capability.removeEventListener('change', hide);
    };
  }, []);

  return <div ref={cursorRef} className="portfolio-cursor" aria-hidden="true"><span className="portfolio-cursor__ring" /><span className="portfolio-cursor__dot" /></div>;
}
