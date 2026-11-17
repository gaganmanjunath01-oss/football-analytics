import React, { useState } from 'react';
import { MatchData, RecentMatchEntry, TeamInfo } from '../types/match';
import { TeamCrest } from './TeamCrest';

interface TeamPerformanceSectionProps {
  match: MatchData;
}

const FormChip: React.FC<{ entry: RecentMatchEntry }> = ({ entry }) => {
  const [showDetail, setShowDetail] = useState(false);

  const colorStyle =
    entry.result === 'W'
      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
      : entry.result === 'D'
        ? 'border-amber-400/40 bg-amber-400/15 text-amber-300'
        : 'border-red-500/40 bg-red-500/15 text-red-300';

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      <button
        type="button"
        onClick={() => setShowDetail((prev) => !prev)}
        onFocus={() => setShowDetail(true)}
        onBlur={() => setShowDetail(false)}
        aria-label={`${entry.result} vs ${entry.opponent} (${entry.score})`}
        className={`flex h-8 w-8 items-center justify-center rounded-md border font-mono text-xs font-bold transition-transform duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${colorStyle}`}
      >
        {entry.result}
      </button>

      {showDetail && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-700 bg-[#0F172A] px-2.5 py-1.5 text-xs shadow-xl"
        >
          <div className="font-semibold text-slate-100">
            vs {entry.opponent} · {entry.score}
          </div>
          <div className="text-[11px] text-slate-400">{entry.competition}</div>
        </div>
      )}
    </div>
  );
};

const TeamSeasonCard: React.FC<{ team: TeamInfo; roleLabel: string }> = ({
  team,
  roleLabel,
}) => {
  const { performance } = team;
  const goalDiff = performance.goalsScored - performance.goalsConceded;

  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#0D1423] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <TeamCrest team={team} size="sm" />
          <div>
            <div className="text-xs text-slate-400">{roleLabel}</div>
            <h3 className="font-display text-base font-bold text-slate-100">
              {team.name}
            </h3>
          </div>
        </div>

        <span className="font-mono text-xs font-medium text-slate-300 tabular-nums">
          Pos #{performance.leaguePosition}
        </span>
      </div>

      {/* Recent 5-match Form */}
      <div className="mt-5">
        <div className="mb-2 text-xs font-medium text-slate-400">
          Recent Five-Match Form
        </div>
        <div className="flex items-center gap-2">
          {performance.recentForm.map((entry, idx) => (
            <FormChip key={idx} entry={entry} />
          ))}
        </div>
      </div>

      {/* Season Metrics Grid */}
      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-4 text-center">
        <div>
          <dt className="text-xs text-slate-400">W - D - L</dt>
          <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-100">
            {performance.wins}-{performance.draws}-{performance.losses}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Goals Scored</dt>
          <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-emerald-400">
            {performance.goalsScored}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Goals Conceded</dt>
          <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-200">
            {performance.goalsConceded}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs text-slate-400">
        <span>Goal Difference</span>
        <span className="font-mono font-semibold tabular-nums text-slate-200">
          {goalDiff >= 0 ? `+${goalDiff}` : goalDiff}
        </span>
      </div>
    </div>
  );
};

export const TeamPerformanceSection: React.FC<TeamPerformanceSectionProps> = ({
  match,
}) => {
  const { homeTeam, awayTeam, headToHead } = match;

  const homePct = Math.round((headToHead.homeTeamWins / headToHead.totalMeetings) * 100);
  const drawPct = Math.round((headToHead.draws / headToHead.totalMeetings) * 100);
  const awayPct = Math.max(0, 100 - homePct - drawPct);

  return (
    <section
      aria-labelledby="team-performance-heading"
      className="rounded-xl border border-slate-800 bg-[#11192A] p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h2
            id="team-performance-heading"
            className="font-display text-lg font-bold text-slate-50"
          >
            Historical Team Performance & Head-to-Head
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Season scoring output, recent five-match form, and prior meetings
          </p>
        </div>
      </div>

      {/* Team Season Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TeamSeasonCard team={homeTeam} roleLabel="Home Side" />
        <TeamSeasonCard team={awayTeam} roleLabel="Away Side" />
      </div>

      {/* Head-to-Head Record */}
      <div className="mt-6 rounded-xl border border-slate-800/90 bg-[#0D1423] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-slate-100">
            Head-to-Head Record (Last {headToHead.totalMeetings} Meetings)
          </h3>
          <div className="flex items-center gap-4 font-mono text-xs tabular-nums">
            <span className="text-emerald-400 font-semibold">
              {homeTeam.shortName}: {headToHead.homeTeamWins}W
            </span>
            <span className="text-amber-400 font-medium">
              Draws: {headToHead.draws}
            </span>
            <span className="text-blue-400 font-semibold">
              {awayTeam.shortName}: {headToHead.awayTeamWins}W
            </span>
          </div>
        </div>

        <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-900">
          <div style={{ width: `${homePct}%` }} className="bg-emerald-500" />
          <div style={{ width: `${drawPct}%` }} className="bg-amber-400" />
          <div style={{ width: `${awayPct}%` }} className="bg-blue-500" />
        </div>

        {/* Recent Meetings Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Competition</th>
                <th className="pb-2 font-medium">Fixture</th>
                <th className="pb-2 text-right font-medium">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {headToHead.recentMeetings.map((meeting, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 pr-4 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                    {meeting.date}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-300 whitespace-nowrap">
                    {meeting.competition}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-100">
                    {meeting.homeTeam} vs {meeting.awayTeam}
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold tabular-nums text-slate-100 whitespace-nowrap">
                    {meeting.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
