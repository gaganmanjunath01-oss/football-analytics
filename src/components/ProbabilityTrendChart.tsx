import React, { useState } from 'react';
import { MatchData, ProbabilityPoint } from '../types/match';
import { TooltipInfo } from './TooltipInfo';

interface ProbabilityTrendChartProps {
  match: MatchData;
}

export const ProbabilityTrendChart: React.FC<ProbabilityTrendChartProps> = ({
  match,
}) => {
  const { probabilityTrend, homeTeam, awayTeam, minute, status } = match;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [visibleLines, setVisibleLines] = useState({
    home: true,
    draw: true,
    away: true,
  });

  const width = 760;
  const height = 300;
  const padLeft = 44;
  const padRight = 24;
  const padTop = 22;
  const padBottom = 38;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxMinute = 90;
  const getX = (min: number) => padLeft + (Math.min(min, maxMinute) / maxMinute) * plotW;
  const getY = (pct: number) => padTop + ((100 - pct) / 100) * plotH;

  const buildPolyline = (selector: (pt: ProbabilityPoint) => number) =>
    probabilityTrend
      .map((pt) => `${getX(pt.minute).toFixed(1)},${getY(selector(pt)).toFixed(1)}`)
      .join(' ');

  const currentPoint = probabilityTrend[probabilityTrend.length - 1];
  const activeIdx = hoveredIdx !== null ? hoveredIdx : probabilityTrend.length - 1;
  const activePoint = probabilityTrend[activeIdx];

  const xTicks = [
    { min: 0, label: "0'" },
    { min: 15, label: "15'" },
    { min: 30, label: "30'" },
    { min: 45, label: 'HT' },
    { min: 60, label: "60'" },
    { min: 75, label: "75'" },
    { min: 90, label: "90'" },
  ];

  const yTicks = [0, 25, 50, 75, 100];

  const toggleSeries = (key: 'home' | 'draw' | 'away') => {
    setVisibleLines((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.home && !next.draw && !next.away) return prev;
      return next;
    });
  };

  return (
    <section
      aria-labelledby="probability-trend-heading"
      className="rounded-xl border border-slate-800 bg-[#11192A] p-6"
    >
      {/* Header & Interactive Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2
            id="probability-trend-heading"
            className="font-display text-lg font-bold text-slate-50"
          >
            Win Probability Timeline
          </h2>
          <TooltipInfo
            title="Probability Trend Graph"
            description="Tracks minute-by-minute shifts in Home Win, Draw, and Away Win probabilities as goals, cards, and territorial dominance unfold."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSeries('home')}
            className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-opacity ${
              visibleLines.home
                ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900 text-slate-500 opacity-60'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>{homeTeam.shortName}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries('draw')}
            className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-opacity ${
              visibleLines.draw
                ? 'border-amber-400/35 bg-amber-400/10 text-amber-300'
                : 'border-slate-800 bg-slate-900 text-slate-500 opacity-60'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
            <span>Draw</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries('away')}
            className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-opacity ${
              visibleLines.away
                ? 'border-blue-500/35 bg-blue-500/10 text-blue-300'
                : 'border-slate-800 bg-slate-900 text-slate-500 opacity-60'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
            <span>{awayTeam.shortName}</span>
          </button>
        </div>
      </div>

      {/* Interactive Tooltip Readout Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800/80 bg-[#0C1220] px-4 py-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
          <span className="font-semibold text-slate-200">
            Minute: {activePoint.label}
          </span>
          <span className="text-emerald-400">
            Home: {activePoint.homeWin}%
          </span>
          <span className="text-amber-400">
            Draw: {activePoint.draw}%
          </span>
          <span className="text-blue-400">
            Away: {activePoint.awayWin}%
          </span>
        </div>

        <div className="text-slate-300">
          {activePoint.event ? (
            <span className="font-medium text-slate-100">
              {activePoint.event.description}
            </span>
          ) : (
            <span className="text-slate-400">
              {hoveredIdx === null
                ? `Current match minute (${status === 'FT' ? '90\'' : match.displayTime}) highlighted`
                : 'Hover timeline points to inspect shifts'}
            </span>
          )}
        </div>
      </div>

      {/* Responsive SVG Line Chart */}
      <div className="mt-4 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full min-w-[540px] select-none"
          role="img"
          aria-label="Line chart of Home Win, Draw, and Away Win probabilities over match time"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Horizontal Y-Axis Gridlines */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.14)"
                  strokeDasharray={tick === 0 || tick === 100 ? undefined : '4 4'}
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Vertical X-Axis Reference Ticks */}
          {xTicks.map((tick) => {
            const x = getX(tick.min);
            return (
              <g key={tick.min}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={height - padBottom}
                  stroke="rgba(148, 163, 184, 0.08)"
                />
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Current Match Minute Vertical Highlight */}
          <line
            x1={getX(minute)}
            y1={padTop}
            x2={getX(minute)}
            y2={height - padBottom}
            stroke="rgba(16, 185, 129, 0.5)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <rect
            x={getX(minute) - 22}
            y={2}
            width="44"
            height="17"
            rx="4"
            fill="#10B981"
          />
          <text
            x={getX(minute)}
            y={14}
            textAnchor="middle"
            fill="#022C22"
            fontSize="10"
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {status === 'FT' ? 'FT' : match.displayTime}
          </text>

          {/* Probability Lines */}
          {visibleLines.home && (
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="2.75"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={buildPolyline((pt) => pt.homeWin)}
            />
          )}

          {visibleLines.draw && (
            <polyline
              fill="none"
              stroke="#EAB308"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={buildPolyline((pt) => pt.draw)}
            />
          )}

          {visibleLines.away && (
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.75"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={buildPolyline((pt) => pt.awayWin)}
            />
          )}

          {/* Active / Hovered Crosshair Line */}
          <line
            x1={getX(activePoint.minute)}
            y1={padTop}
            x2={getX(activePoint.minute)}
            y2={height - padBottom}
            stroke="rgba(226, 232, 240, 0.3)"
            strokeWidth="1"
          />

          {/* Event Markers (Goals) & Interactive Hit Targets */}
          {probabilityTrend.map((pt, idx) => {
            const x = getX(pt.minute);
            const isSelected = idx === activeIdx;
            const isCurrent = idx === probabilityTrend.length - 1;

            return (
              <g key={`${pt.minute}-${idx}`}>
                {/* Goal marker diamond on timeline axis */}
                {pt.event?.type === 'goal' && (
                  <g>
                    <circle
                      cx={x}
                      cy={height - padBottom}
                      r="5"
                      fill={pt.event.team === 'home' ? '#10B981' : '#3B82F6'}
                      stroke="#090E17"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Point rings for active/current point */}
                {(isSelected || isCurrent) && (
                  <>
                    {visibleLines.home && (
                      <circle
                        cx={x}
                        cy={getY(pt.homeWin)}
                        r={isSelected ? 5 : 4}
                        fill="#10B981"
                        stroke="#090E17"
                        strokeWidth="2"
                      />
                    )}
                    {visibleLines.draw && (
                      <circle
                        cx={x}
                        cy={getY(pt.draw)}
                        r={isSelected ? 5 : 4}
                        fill="#EAB308"
                        stroke="#090E17"
                        strokeWidth="2"
                      />
                    )}
                    {visibleLines.away && (
                      <circle
                        cx={x}
                        cy={getY(pt.awayWin)}
                        r={isSelected ? 5 : 4}
                        fill="#3B82F6"
                        stroke="#090E17"
                        strokeWidth="2"
                      />
                    )}
                  </>
                )}

                {/* Invisible generous hover target */}
                <rect
                  x={x - 16}
                  y={padTop}
                  width="32"
                  height={plotH}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => setHoveredIdx(idx)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Match Key Events Timeline Summary */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-800/80 pt-3.5 text-xs text-slate-400">
        {probabilityTrend
          .filter((pt) => pt.event && pt.event.type === 'goal')
          .map((pt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const targetIdx = probabilityTrend.findIndex((p) => p.minute === pt.minute);
                if (targetIdx >= 0) setHoveredIdx(targetIdx);
              }}
              className="inline-flex items-center gap-1.5 text-left hover:text-slate-100 transition-colors"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  pt.event?.team === 'home' ? 'bg-emerald-400' : 'bg-blue-400'
                }`}
                aria-hidden="true"
              />
              <span>{pt.event?.description}</span>
            </button>
          ))}
        {probabilityTrend.filter((pt) => pt.event?.type === 'goal').length === 0 && (
          <span>Current snapshot at {currentPoint.label}: No goals scored yet.</span>
        )}
      </div>
    </section>
  );
};
