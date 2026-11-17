import React from 'react';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { MatchData } from '../types/match';
import { TeamCrest } from './TeamCrest';
import { WinProbabilitySection } from './WinProbabilitySection';
import { MatchStatsComparison } from './MatchStatsComparison';
import { ProbabilityTrendChart } from './ProbabilityTrendChart';
import { TeamPerformanceSection } from './TeamPerformanceSection';

interface MatchDetailsPageProps {
  match: MatchData;
  allMatches: MatchData[];
  onSelectMatch: (matchId: string) => void;
  onBackToMatches: () => void;
}

export const MatchDetailsPage: React.FC<MatchDetailsPageProps> = ({
  match,
  allMatches,
  onSelectMatch,
  onBackToMatches,
}) => {
  const { homeTeam, awayTeam, status, displayTime } = match;

  const statusTextColor =
    status === 'LIVE'
      ? 'text-emerald-400'
      : status === 'HT'
        ? 'text-amber-400'
        : 'text-slate-400';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Match Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToMatches}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-[#11192A] px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors duration-150 hover:border-slate-700 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Live Matches</span>
        </button>

        <div className="flex items-center gap-2.5">
          <label htmlFor="match-switcher" className="text-xs font-medium text-slate-400">
            Switch Match
          </label>
          <select
            id="match-switcher"
            value={match.id}
            onChange={(e) => onSelectMatch(e.target.value)}
            className="rounded-lg border border-slate-800 bg-[#11192A] px-3 py-2 text-sm font-medium text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {allMatches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.homeTeam.shortName} {m.homeScore}-{m.awayScore} {m.awayTeam.shortName} ({m.displayTime})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Match Scoreboard */}
      <section
        aria-label="Match scoreboard"
        className="rounded-xl border border-slate-800 bg-[#11192A] p-6 sm:p-8"
      >
        {/* League, Date, Venue Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-200">{match.league}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              {match.matchDate} · {match.kickoffTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              {match.venue}
            </span>
          </div>

          <div className={`font-mono text-xs font-bold tabular-nums ${statusTextColor}`}>
            {status === 'LIVE' ? `LIVE · ${displayTime}` : status}
          </div>
        </div>

        {/* Teams & Scoreline */}
        <div className="mt-7 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          {/* Home Team */}
          <div className="flex items-center gap-4 md:justify-end md:text-right">
            <div className="order-2 md:order-1">
              <div className="text-xs text-slate-400">Home · #{homeTeam.performance.leaguePosition}</div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
                {homeTeam.name}
              </h1>
            </div>
            <div className="order-1 md:order-2">
              <TeamCrest team={homeTeam} size="lg" />
            </div>
          </div>

          {/* Center Score & Clock */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-4 font-mono text-5xl font-bold tracking-tight tabular-nums text-slate-50 sm:text-6xl">
              <span>{match.homeScore}</span>
              <span className="text-slate-600">-</span>
              <span>{match.awayScore}</span>
            </div>
            <div className="mt-2 font-mono text-sm font-semibold tabular-nums text-emerald-400">
              {status === 'LIVE'
                ? `Match Time: ${displayTime}`
                : status === 'HT'
                  ? 'Half-Time (45\')'
                  : 'Full-Time (90\')'}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-4 md:justify-start md:text-left">
            <TeamCrest team={awayTeam} size="lg" />
            <div>
              <div className="text-xs text-slate-400">Away · #{awayTeam.performance.leaguePosition}</div>
              <div className="font-display text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
                {awayTeam.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Win Probability Section (Primary Focal Anchor) */}
      <WinProbabilitySection match={match} />

      {/* 3 & 4. Probability Trend Chart + Match Statistics */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ProbabilityTrendChart match={match} />
        </div>
        <div className="xl:col-span-5">
          <MatchStatsComparison match={match} />
        </div>
      </div>

      {/* 5. Historical Team Performance & Head-to-Head */}
      <TeamPerformanceSection match={match} />
    </div>
  );
};
