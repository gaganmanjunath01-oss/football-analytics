import React from 'react';
import { TeamInfo } from '../types/match';

interface TeamCrestProps {
  team: TeamInfo;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 72,
};

export const TeamCrest: React.FC<TeamCrestProps> = ({ team, size = 'md' }) => {
  const px = SIZE_MAP[size];
  const { primary, secondary, accent, pattern } = team.crest;
  const clipId = `crest-${team.id}-${size}`;

  // Choose readable monogram text color
  const isLightPrimary =
    primary.toUpperCase() === '#F8FAFC' ||
    primary.toUpperCase() === '#FACC15' ||
    primary.toUpperCase() === '#38BDF8';

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${team.name} crest`}
      className="shrink-0 select-none drop-shadow-sm"
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M12 10C12 8.89543 12.8954 8 14 8H50C51.1046 8 52 8.89543 52 10V31C52 44.5 32 56 32 56C32 56 12 44.5 12 31V10Z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Base Fill */}
        <rect x="10" y="6" width="44" height="52" fill={primary} />

        {/* Pattern Variations */}
        {pattern === 'split' && (
          <rect x="32" y="6" width="22" height="52" fill={secondary} />
        )}
        {pattern === 'stripes' && (
          <>
            <rect x="16" y="6" width="8" height="52" fill={secondary} />
            <rect x="32" y="6" width="8" height="52" fill={secondary} />
            <rect x="48" y="6" width="8" height="52" fill={secondary} />
          </>
        )}
        {pattern === 'band' && (
          <rect x="10" y="25" width="44" height="14" fill={secondary} />
        )}
        {pattern === 'chevron' && (
          <path d="M10 38L32 23L54 38V58H10V38Z" fill={secondary} fillOpacity="0.22" />
        )}
        {pattern === 'halves' && (
          <rect x="10" y="34" width="44" height="24" fill={secondary} />
        )}
        {pattern === 'sash' && (
          <path d="M8 46L46 6H56L18 56H8V46Z" fill={secondary} fillOpacity="0.28" />
        )}

        {/* Top Accent Trim */}
        <rect x="10" y="8" width="44" height="4" fill={accent} />

        {/* Subtle Dark Band for Monogram Readability */}
        <rect x="12" y="24" width="40" height="17" fill="#090E17" fillOpacity="0.72" />
      </g>

      {/* Outer Shield Stroke */}
      <path
        d="M12 10C12 8.89543 12.8954 8 14 8H50C51.1046 8 52 8.89543 52 10V31C52 44.5 32 56 32 56C32 56 12 44.5 12 31V10Z"
        stroke={isLightPrimary ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.28)'}
        strokeWidth="2.2"
      />

      {/* Team Code */}
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fill="#F8FAFC"
        fontSize="11.5"
        fontWeight="700"
        fontFamily="JetBrains Mono, monospace"
        letterSpacing="0.06em"
      >
        {team.code}
      </text>
    </svg>
  );
};
