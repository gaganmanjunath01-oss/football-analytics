import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MatchData } from '../types/match';
import { TeamCrest } from './TeamCrest';

interface MatchCardProps {
  match: MatchData;
  onSelectMatch: (matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onSelectMatch }) => {
  const { homeTeam, awayTeam, probabilities, status, displayTime } = match;

  const statusTextColor =
    status === 'LIVE'
      ? 'text-emerald-400'
      : status === 'HT'
        ? 'text-amber-400'
        : 'text-slate-400';

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#11192A] p-5 transition-colors duration-150 hover:border-slate-700 hover:bg-[#141E33]">
      <div>
        {/* Kicker metadata row — clean unboxed typography */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="truncate font-medium text-slate-400">{match.league}</span>
          <span className={`shrink-0 font-mono font-semibold tabular-nums ${statusTextColor}`}>
            {status === 'LIVE' ? `LIVE · ${displayTime}` : status}
          </span>
        </div>

        {/* Teams & Scorelines */}
        <div className="mt-5 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <TeamCrest team={homeTeam} size="sm" />
              <span className="truncate text-base font-semibold text-slate-100">
                {homeTeam.name}
              </span>
            </div>
            <span className="font-mono text-xl font-bold tabular-nums text-slate-50">
              {match.homeScore}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <TeamCrest team={awayTeam} size="sm" />
              <span className="truncate text-base font-semibold text-slate-100">
                {awayTeam.name}
              </span>
            </div>
            <span className="font-mono text-xl font-bold tabular-nums text-slate-50">
              {match.awayScore}
            </span>
          </div>
        </div>

        {/* Compact Live Probability Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="mb-2 flex items-center justify-between text-xs font-mono tabular-nums">
            <span className="text-emerald-400 font-semibold">
              {homeTeam.code} {probabilities.homeWin}%
            </span>
            <span className="text-amber-400 font-medium">
              Draw {probabilities.draw}%
            </span>
            <span className="text-blue-400 font-semibold">
              {awayTeam.code} {probabilities.awayWin}%
            </span>
          </div>
          <div
            className="flex h-2 w-full overflow-hidden rounded-full bg-slate-900"
            aria-label={`Win probability: ${homeTeam.name} ${probabilities.homeWin}%, Draw ${probabilities.draw}%, ${awayTeam.name} ${probabilities.awayWin}%`}
          >
            <div
              style={{ width: `${probabilities.homeWin}%` }}
              className="bg-emerald-500 transition-[width] duration-300"
            />
            <div
              style={{ width: `${probabilities.draw}%` }}
              className="bg-amber-400 transition-[width] duration-300"
            />
            <div
              style={{ width: `${probabilities.awayWin}%` }}
              className="bg-blue-500 transition-[width] duration-300"
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => onSelectMatch(match.id)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700/90 bg-slate-800/70 px-4 py-2.5 text-sm font-semibold text-slate-100 whitespace-nowrap transition-colors duration-150 hover:border-emerald-500/60 hover:bg-emerald-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <span>View Analysis</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
      </button>
    </article>
  );
};
