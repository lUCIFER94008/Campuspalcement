'use client';

import React from 'react';

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft Blue Blob Top-Left */}
      <div className="absolute -top-32 -left-20 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-600/10 rounded-full blur-[140px]" />
      
      {/* Soft Yellow Blob Right */}
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-yellow-bright/15 dark:bg-yellow-bright/5 rounded-full blur-[130px]" />

      {/* Soft Blue Blob Center-Bottom */}
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] bg-brand-600/5 dark:bg-brand-600/10 rounded-full blur-[150px]" />
    </div>
  );
}
