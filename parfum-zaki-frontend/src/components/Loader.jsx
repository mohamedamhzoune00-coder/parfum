import React from 'react';

export default function Loader({ text = 'Chargement en cours...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-[#E7DAC7]"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-[#C5A880] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-3 rounded-full border border-[#C5A880]/30 animate-pulse"></div>
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-[#555555] font-medium font-sans">
        {text}
      </p>
    </div>
  );
}
