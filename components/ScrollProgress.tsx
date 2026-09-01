'use client';

import React, { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollPercentage(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none bg-slate-200/40 dark:bg-slate-800/40">
      <div
        className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-yellow-bright transition-all duration-150 ease-out shadow-[0_0_10px_rgba(250,204,21,0.6)]"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  );
}
