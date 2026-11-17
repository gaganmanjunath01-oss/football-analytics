import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { MatchData, PageRoute } from '../types/match';
import { TeamCrest } from './TeamCrest';
import { MatchCard } from './MatchCard';

interface HomePageProps {
  matches: MatchData[];
  featuredMatch: MatchData;
  onSelectMatch: (matchId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  matches,
  featuredMatch,
  onSelectMatch,
  onNavigate,
}) => {
  const liveCount = matches.filter((m) => m.status === 'LIVE' || m.status === 'HT').length;
  const totalGoals = matches.reduce((acc, m) => acc + m.homeScore + m.awayScore, 0);
  const avgHomeWin = Math.round(
    matches.reduce((acc, m) => acc + m.probabilities.homeWin, 0) / Math.max(matches.length, 1)
  );

  return (
    <div className="space-y-10">
      {/* Hero Spotlight */}
      <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#11192A] p-7 sm:p-9 lg:col-span-7">
          <div>
            <div className="text-xs font-medium text-emerald-400">
              Real-Time Football Probability Engine
            </div>
            <h1 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl [text-wrap:balance]">
              Live win probabilities driven by match momentum and telemetry
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              Track minute-by-minute outcome shifts, expected goals, shot danger, and historical head-to-head trends across active fixtures.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectMatch(featuredMatch.id)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 whitespace-nowrap transition-colors duration-150 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>Inspect Featured Match</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('matches')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-100 whitespace-nowrap transition-colors duration-150 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>Browse All Live Matches</span>
            </button>
          </div>
        </div>

        {/* Featured Match Spotlight Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#11192A] p-6 sm:p-7 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-400">
                Featured · {featuredMatch.league}
              </span>
              <span className="font-mono font-semibold tabular-nums text-emerald-400">
                {featuredMatch.status} · {featuredMatch.displayTime}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex flex-col items-center text-center flex-1">
                <TeamCrest team={featuredMatch.homeTeam} size="lg" />
                <span className="mt-2.5 font-display text-sm font-bold text-slate-100">
                  {featuredMatch.homeTeam.shortName}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="font-mono text-4xl font-bold tabular-nums text-slate-50">
                  {featuredMatch.homeScore} - {featuredMatch.awayScore}
                </div>
                <span className="mt-1 font-mono text-xs text-slate-400 tabular-nums">
                  {featuredMatch.stats.expectedGoals[0].toFixed(2)} - {featuredMatch.stats.expectedGoals[1].toFixed(2)} xG
                </span>
              </div>

              <div className="flex flex-col items-center text-center flex-1">
                <TeamCrest team={featuredMatch.awayTeam} size="lg" />
                <span className="mt-2.5 font-display text-sm font-bold text-slate-100">
                  {featuredMatch.awayTeam.shortName}
                </span>
              </div>
            </div>

            {/* Featured Probabilities */}
            <div className="mt-6 rounded-lg border border-slate-800/80 bg-[#0C1220] p-4">
              <div className="mb-2.5 flex items-center justify-between text-xs font-medium text-slate-400">
                <span>Win Probability Snapshot</span>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono tabular-nums">
                <div>
                  <div className="text-xl font-bold text-emerald-400">
                    {featuredMatch.probabilities.homeWin}%
                  </div>
                  <div className="text-[11px] text-slate-400">Home Win</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-amber-400">
                    {featuredMatch.probabilities.draw}%
                  </div>
                  <div className="text-[11px] text-slate-400">Draw</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-400">
                    {featuredMatch.probabilities.awayWin}%
                  </div>
                  <div className="text-[11px] text-slate-400">Away Win</div>
                </div>
              </div>

              <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-900">
                <div
                  style={{ width: `${featuredMatch.probabilities.homeWin}%` }}
                  className="bg-emerald-500"
                />
                <div
                  style={{ width: `${featuredMatch.probabilities.draw}%` }}
                  className="bg-amber-400"
                />
                <div
                  style={{ width: `${featuredMatch.probabilities.awayWin}%` }}
                  className="bg-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectMatch(featuredMatch.id)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span>View Full Match Analysis</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Matchday KPI Strip */}
      <section aria-label="Matchday summary">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-[#11192A] p-5">
            <div className="text-xs font-medium text-slate-400">Active Fixtures</div>
            <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-emerald-400">
              {liveCount}
            </div>
            <div className="mt-1 text-xs text-slate-400">Live or Half-Time</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#11192A] p-5">
            <div className="text-xs font-medium text-slate-400">Tracked Competitions</div>
            <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-slate-50">
              5
            </div>
            <div className="mt-1 text-xs text-slate-400">Top European Leagues</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#11192A] p-5">
            <div className="text-xs font-medium text-slate-400">Goals Today</div>
            <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-slate-50">
              {totalGoals}
            </div>
            <div className="mt-1 text-xs text-slate-400">Across {matches.length} matches</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#11192A] p-5">
            <div className="text-xs font-medium text-slate-400">Avg Home Win Prob</div>
            <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-blue-400">
              {avgHomeWin}%
            </div>
            <div className="mt-1 text-xs text-slate-400">Live weighted estimate</div>
          </div>
        </div>
      </section>

      {/* Top Live Matches Preview Grid */}
      <section aria-labelledby="home-live-preview">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2
              id="home-live-preview"
              className="font-display text-xl font-bold text-slate-50"
            >
              Active Matchday Board
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">
              Select any fixture to inspect live win probabilities, trends, and team statistics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('matches')}
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap transition-colors"
          >
            View all ({matches.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {matches.slice(0, 3).map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelectMatch={onSelectMatch}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
