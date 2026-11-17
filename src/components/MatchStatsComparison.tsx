import React from 'react';
import { MatchData } from '../types/match';
import { TooltipInfo } from './TooltipInfo';

interface MatchStatsComparisonProps {
  match: MatchData;
}

interface StatRowConfig {
  key: string;
  label: string;
  homeValue: number;
  awayValue: number;
  suffix?: string;
  tooltip: string;
}

export const MatchStatsComparison: React.FC<MatchStatsComparisonProps> = ({
  match,
}) => {
  const { homeTeam, awayTeam, stats } = match;

  const rows: StatRowConfig[] = [
    {
      key: 'possession',
      label: 'Possession',
      homeValue: stats.possession[0],
      awayValue: stats.possession[1],
      suffix: '%',
      tooltip: 'Percentage of total ball control time by each team during active play.',
    },
    {
      key: 'totalShots',
      label: 'Total Shots',
      homeValue: stats.totalShots[0],
      awayValue: stats.totalShots[1],
      tooltip: 'All goal attempts including shots on target, off target, and blocked efforts.',
    },
    {
      key: 'shotsOnTarget',
      label: 'Shots on Target',
      homeValue: stats.shotsOnTarget[0],
      awayValue: stats.shotsOnTarget[1],
      tooltip: 'Attempts directed within the goal frame. High correlation with live win probability shifts.',
    },
    {
      key: 'corners',
      label: 'Corners',
      homeValue: stats.corners[0],
      awayValue: stats.corners[1],
      tooltip: 'Corner kicks earned, indicating sustained attacking third territory.',
    },
    {
      key: 'fouls',
      label: 'Fouls',
      homeValue: stats.fouls[0],
      awayValue: stats.fouls[1],
      tooltip: 'Total free kicks conceded by each side.',
    },
    {
      key: 'yellowCards',
      label: 'Yellow Cards',
      homeValue: stats.yellowCards[0],
      awayValue: stats.yellowCards[1],
      tooltip: 'Cautions issued by the referee. Elevated card counts increase late-match red-card risk.',
    },
  ];

  return (
    <section
      aria-labelledby="match-stats-heading"
      className="rounded-xl border border-slate-800 bg-[#11192A] p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <h2
            id="match-stats-heading"
            className="font-display text-lg font-bold text-slate-50"
          >
            Match Statistics
          </h2>
          <TooltipInfo
            title="Live Team Telemetry"
            description="Head-to-head statistical breakdown tracked in real time. Expected Goals (xG) is shown alongside core match metrics."
          />
        </div>

        <div className="flex items-center gap-5 text-xs font-semibold">
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden="true" />
            {homeTeam.shortName}
          </span>
          <span className="flex items-center gap-2 text-blue-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" aria-hidden="true" />
            {awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Expected Goals Summary Row */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900/70 px-4 py-2.5 text-xs">
        <span className="font-mono font-semibold text-emerald-400 tabular-nums">
          {stats.expectedGoals[0].toFixed(2)} xG
        </span>
        <span className="font-medium text-slate-400">Expected Goals (xG)</span>
        <span className="font-mono font-semibold text-blue-400 tabular-nums">
          {stats.expectedGoals[1].toFixed(2)} xG
        </span>
      </div>

      {/* Stat Comparison Bars */}
      <div className="mt-5 space-y-5">
        {rows.map((row) => {
          const total = row.homeValue + row.awayValue;
          const homePct = total === 0 ? 50 : Math.round((row.homeValue / total) * 100);
          const awayPct = total === 0 ? 50 : 100 - homePct;

          return (
            <div key={row.key}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="w-16 font-mono font-semibold tabular-nums text-slate-100">
                  {row.homeValue}
                  {row.suffix ?? ''}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <span>{row.label}</span>
                  <TooltipInfo title={row.label} description={row.tooltip} />
                </div>
                <span className="w-16 text-right font-mono font-semibold tabular-nums text-slate-100">
                  {row.awayValue}
                  {row.suffix ?? ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {/* Home bar grows right-to-left from center */}
                <div className="flex h-2 w-full justify-end overflow-hidden rounded-l-full bg-slate-900">
                  <div
                    style={{ width: `${homePct}%` }}
                    className="h-full rounded-l-full bg-emerald-500 transition-[width] duration-300"
                  />
                </div>
                {/* Away bar grows left-to-right from center */}
                <div className="flex h-2 w-full justify-start overflow-hidden rounded-r-full bg-slate-900">
                  <div
                    style={{ width: `${awayPct}%` }}
                    className="h-full rounded-r-full bg-blue-500 transition-[width] duration-300"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
