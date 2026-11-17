import React from 'react';
import { MatchData } from '../types/match';
import { TooltipInfo } from './TooltipInfo';

interface WinProbabilitySectionProps {
  match: MatchData;
}

export const WinProbabilitySection: React.FC<WinProbabilitySectionProps> = ({
  match,
}) => {
  const { homeTeam, awayTeam, probabilities, status } = match;

  const outcomes = [
    {
      id: 'home',
      label: 'Home Win',
      teamLabel: homeTeam.name,
      value: probabilities.homeWin,
      textColor: 'text-emerald-400',
      barColor: 'bg-emerald-500',
      trackHighlight: 'border-emerald-500/25 bg-emerald-500/[0.05]',
    },
    {
      id: 'draw',
      label: 'Draw',
      teamLabel: 'Level after 90\'',
      value: probabilities.draw,
      textColor: 'text-amber-400',
      barColor: 'bg-amber-400',
      trackHighlight: 'border-amber-400/25 bg-amber-400/[0.05]',
    },
    {
      id: 'away',
      label: 'Away Win',
      teamLabel: awayTeam.name,
      value: probabilities.awayWin,
      textColor: 'text-blue-400',
      barColor: 'bg-blue-500',
      trackHighlight: 'border-blue-500/25 bg-blue-500/[0.05]',
    },
  ];

  return (
    <section
      aria-labelledby="win-probability-heading"
      className="rounded-xl border border-slate-800 bg-[#11192A] p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="win-probability-heading"
              className="font-display text-xl font-bold tracking-tight text-slate-50"
            >
              Live Win Probability
            </h2>
            <TooltipInfo
              title="Win Probability Model"
              description="Calculated in real time using current goal differential, minutes remaining, expected goals (xG), shots on target, territorial possession, and pre-match team strength priors."
            />
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {match.keyInsight}
          </p>
        </div>

        <span className="font-mono text-xs font-medium text-slate-400 tabular-nums">
          {status === 'FT' ? 'Settled at Full-Time' : `Updated at ${match.displayTime}`}
        </span>
      </div>

      {/* Combined Proportional Split Bar */}
      <div className="mt-6">
        <div
          className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-slate-800"
          role="img"
          aria-label={`Win probabilities: Home Win ${probabilities.homeWin}%, Draw ${probabilities.draw}%, Away Win ${probabilities.awayWin}%`}
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

      {/* Three Prominent Outcome Indicators + Individual Horizontal Bars */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {outcomes.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl border p-4 sm:p-5 ${item.trackHighlight}`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-slate-100">
                  {item.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">
                  {item.teamLabel}
                </div>
              </div>
              <div
                className={`font-mono text-4xl font-bold tracking-tight tabular-nums ${item.textColor}`}
              >
                {item.value}%
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-900/90">
              <div
                style={{ width: `${item.value}%` }}
                className={`h-full rounded-full transition-[width] duration-300 ${item.barColor}`}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-slate-400">
        Predictions are estimates based on available match data.
      </p>
    </section>
  );
};
