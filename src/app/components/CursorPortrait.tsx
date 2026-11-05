'use client';

import { useEffect, useRef, useState } from 'react';

const ATLAS = '/portraits/reyca-directions.png';

export function CursorPortrait() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const [tile, setTile] = useState(4);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setReady(true);
    image.src = ATLAS;
    return () => { image.onload = null; };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    let frame = 0;
    let scrollTimer = 0;
    let previousY = window.scrollY;
    let touchScrolling = coarsePointer.matches;
    const reset = () => setTile(4);
    const follow = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || motion.matches) return;
      touchScrolling = false;
      clearTimeout(scrollTimer);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = portraitRef.current?.getBoundingClientRect();
        if (!rect) return;
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < rect.width * 0.6) { reset(); return; }
        // Quantize the cursor angle into eight head directions around the neutral pose.
        const sector = Math.round(Math.atan2(dy, dx) / (Math.PI / 4));
        const tiles = [5, 8, 7, 6, 3, 0, 1, 2];
        setTile(tiles[(sector + 8) % 8]);
      });
    };
    const onTouch = (event: PointerEvent) => { if (event.pointerType === 'touch') touchScrolling = true; };
    const onScroll = () => {
      const delta = window.scrollY - previousY;
      previousY = window.scrollY;
      if (motion.matches || (!coarsePointer.matches && !touchScrolling) || Math.abs(delta) < 1) return;
      cancelAnimationFrame(frame);
      clearTimeout(scrollTimer);
      frame = requestAnimationFrame(() => setTile(delta > 0 ? 7 : 1));
      scrollTimer = window.setTimeout(reset, 650);
    };
    const onLeave = (event: PointerEvent) => { if (event.pointerType !== 'touch') reset(); };
    const onMotionChange = () => { clearTimeout(scrollTimer); reset(); };
    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('pointerdown', onTouch, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', reset);
    motion.addEventListener('change', onMotionChange);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(scrollTimer);
      window.removeEventListener('pointermove', follow);
      window.removeEventListener('pointerdown', onTouch);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', reset);
      motion.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <div
      ref={portraitRef}
      role="img"
      aria-label="Portrait of Reyca De Alba"
      className="w-36 h-36 rounded-sm overflow-hidden bg-muted"
      style={ready ? {
        backgroundImage: `url(${ATLAS})`,
        backgroundSize: '300% 300%',
        backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`,
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
      {!ready && <img src="/profile-1.png" alt="" className="w-full h-full object-cover" style={{ objectPosition: '50% 20%' }} />}
    </div>
  );
}
