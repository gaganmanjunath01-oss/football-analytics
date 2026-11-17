import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipInfoProps {
  title: string;
  description: string;
  align?: 'left' | 'center' | 'right';
}

export const TooltipInfo: React.FC<TooltipInfoProps> = ({
  title,
  description,
  align = 'center',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const positionClass =
    align === 'left'
      ? 'left-0'
      : align === 'right'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={`Explain ${title}`}
        aria-expanded={open}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-slate-800 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="tooltip"
          className={`absolute bottom-full z-40 mb-2 w-64 rounded-lg border border-slate-700/90 bg-[#0F172A] p-3 text-left shadow-xl ${positionClass}`}
        >
          <div className="text-xs font-semibold text-slate-100">{title}</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{description}</p>
        </div>
      )}
    </div>
  );
};
