'use client';

import { useCallback, useEffect, useState } from 'react';

export function OpeningIntro() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) { setVisible(false); return; }
    let cancelled = false;
    const timers = new Set<number>();
    const delay = (ms: number) => new Promise<void>(resolve => {
      const timer = window.setTimeout(() => { timers.delete(timer); resolve(); }, ms);
      timers.add(timer);
    });
    document.documentElement.dataset.portfolioOpening = 'true';
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Tab') dismiss();
    };
    let pageLoaded = () => {};
    const pageReady = new Promise<void>(resolve => {
      pageLoaded = resolve;
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', pageLoaded, { once: true });
    });
    const portrait = new Image();
    const portraitReady = new Promise<void>(resolve => {
      portrait.onload = () => { portrait.decode().catch(() => {}).then(resolve); };
      portrait.onerror = () => resolve();
      portrait.src = '/portraits/reyca-directions.png';
    });
    const fontsReady = document.fonts.ready.catch(() => {});
    // Wait for real page/font/portrait readiness and give the opening room to breathe.
    // The deadline prevents a slow third-party asset from trapping visitors.
    Promise.all([
      delay(2600),
      Promise.race([Promise.all([pageReady, portraitReady, fontsReady]), delay(8000)]),
    ]).then(async () => {
      if (cancelled) return;
      setLeaving(true);
      await delay(450);
      if (!cancelled) dismiss();
    });
    window.addEventListener('keydown', onKey);
    reducedMotion.addEventListener('change', dismiss);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener('load', pageLoaded);
      portrait.onload = null;
      portrait.onerror = null;
      document.documentElement.style.overflow = previousOverflow;
      delete document.documentElement.dataset.portfolioOpening;
      window.removeEventListener('keydown', onKey);
      reducedMotion.removeEventListener('change', dismiss);
    };
  }, [visible, dismiss]);

  useEffect(() => {
    if (!visible) delete document.documentElement.dataset.portfolioOpening;
  }, [visible]);

  if (!visible) return null;
  return (
    <div className={`portfolio-intro ${leaving ? 'portfolio-intro--leaving' : ''}`} data-testid="portfolio-intro">
      <div className="portfolio-intro__identity" role="status" aria-label="Opening Reyca-dev portfolio">
        <svg className="portfolio-intro__wordmark" viewBox="0 0 800 180" aria-hidden="true" focusable="false">
          <defs><linearGradient id="portfolio-intro-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#eef2ff" /><stop offset="52%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#b69cff" /></linearGradient></defs>
          <text className="portfolio-intro__outline" x="50%" y="53%" textAnchor="middle" dominantBaseline="middle">Reyca-dev</text>
          <text className="portfolio-intro__fill" x="50%" y="53%" textAnchor="middle" dominantBaseline="middle">Reyca-dev</text>
        </svg>
      </div>
      <button type="button" className="portfolio-intro__skip" onClick={dismiss}>Skip intro <span aria-hidden="true">↗</span></button>
    </div>
  );
}
