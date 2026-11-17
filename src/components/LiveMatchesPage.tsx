import React, { useMemo, useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { DataViewState, MatchData, MatchStatus } from '../types/match';
import { MatchCard } from './MatchCard';
import {
  EmptyMatchesState,
  ErrorMatchesState,
  MatchesLoadingSkeleton,
} from './MatchStates';

interface LiveMatchesPageProps {
  matches: MatchData[];
  onSelectMatch: (matchId: string) => void;
}

type StatusFilter = 'ALL' | MatchStatus;

export const LiveMatchesPage: React.FC<LiveMatchesPageProps> = ({
  matches,
  onSelectMatch,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [leagueFilter, setLeagueFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewState, setViewState] = useState<DataViewState>('ready');

  const leagues = useMemo(() => {
    const unique = Array.from(new Set(matches.map((m) => m.league)));
    return ['ALL', ...unique];
  }, [matches]);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      if (statusFilter !== 'ALL' && match.status !== statusFilter) return false;
      if (leagueFilter !== 'ALL' && match.league !== leagueFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${match.homeTeam.name} ${match.awayTeam.name} ${match.league}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [matches, statusFilter, leagueFilter, searchQuery]);

  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setLeagueFilter('ALL');
    setSearchQuery('');
    setViewState('ready');
  };

  const handleSimulateLoad = () => {
    setViewState('loading');
    window.setTimeout(() => {
      setViewState('ready');
    }, 650);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
            Live Matches & Probabilities
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time match scores, live telemetry, and pre-whistle outcome forecasts across top leagues.
          </p>
        </div>

        {/* UI State Preview Controls for Loading / Empty / Error */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#11192A] p-1">
          {(
            [
              { id: 'ready', label: 'Live' },
              { id: 'loading', label: 'Skeleton' },
              { id: 'empty', label: 'Empty' },
              { id: 'error', label: 'Error' },
            ] as { id: DataViewState; label: string }[]
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setViewState(mode.id)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                viewState === mode.id
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#11192A] p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search & League */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team or competition..."
              aria-label="Search matches by team or league"
              className="w-full rounded-lg border border-slate-800 bg-[#0B111E] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            />
          </div>

          <select
            value={leagueFilter}
            onChange={(e) => setLeagueFilter(e.target.value)}
            aria-label="Filter by competition"
            className="rounded-lg border border-slate-800 bg-[#0B111E] px-3 py-2 text-sm text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {leagues.map((lg) => (
              <option key={lg} value={lg}>
                {lg === 'ALL' ? 'All Competitions' : lg}
              </option>
            ))}
          </select>
        </div>

        {/* Status Segmented Tabs & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Filter by match status"
            className="flex items-center gap-1 rounded-lg bg-[#0B111E] p-1 border border-slate-800"
          >
            {(
              [
                { id: 'ALL', label: 'All' },
                { id: 'LIVE', label: 'Live' },
                { id: 'HT', label: 'HT' },
                { id: 'FT', label: 'FT' },
              ] as { id: StatusFilter; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSimulateLoad}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0B111E] px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Conditional States */}
      {viewState === 'loading' && <MatchesLoadingSkeleton />}

      {viewState === 'error' && (
        <ErrorMatchesState onRetry={handleSimulateLoad} />
      )}

      {viewState === 'empty' && (
        <EmptyMatchesState
          actionLabel="Restore Live Fixtures"
          onAction={handleResetFilters}
        />
      )}

      {viewState === 'ready' && filteredMatches.length === 0 && (
        <EmptyMatchesState onAction={handleResetFilters} />
      )}

      {viewState === 'ready' && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelectMatch={onSelectMatch}
            />
          ))}
        </div>
      )}
    </div>
  );
};
