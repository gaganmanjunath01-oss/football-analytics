import React from 'react';
import { AlertTriangle, RefreshCw, CalendarX2 } from 'lucide-react';

export const MatchesLoadingSkeleton: React.FC = () => {
  return (
    <div
      aria-label="Loading live matches"
      role="status"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-slate-800/80 bg-[#11192A] p-5"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-28 animate-pulse rounded bg-slate-800" />
            <div className="h-3.5 w-14 animate-pulse rounded bg-slate-800" />
          </div>

          <div className="mt-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-800" />
                <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
              </div>
              <div className="h-6 w-6 animate-pulse rounded bg-slate-800" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-800" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
              </div>
              <div className="h-6 w-6 animate-pulse rounded bg-slate-800" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between mb-2">
              <div className="h-3 w-12 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-12 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-12 animate-pulse rounded bg-slate-800" />
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-slate-800" />
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/70">
            <div className="h-9 w-full animate-pulse rounded-lg bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface EmptyMatchesStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyMatchesState: React.FC<EmptyMatchesStateProps> = ({
  title = 'No live matches available',
  message = 'There are no active fixtures matching your current filter selection. Clear filters or reload the matchday feed.',
  actionLabel = 'Reset Match Filters',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#11192A] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/60 text-slate-300">
        <CalendarX2 className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-slate-100">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-400">
        {message}
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors duration-150 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

interface ErrorMatchesStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export const ErrorMatchesState: React.FC<ErrorMatchesStateProps> = ({
  title = 'Unable to load match telemetry',
  message = 'The live statistics stream did not respond in time. Retry fetching current scores and win probability models.',
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-red-500/30 bg-[#151521] px-6 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-slate-100">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-400">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors duration-150 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        <span>Retry Connection</span>
      </button>
    </div>
  );
};
