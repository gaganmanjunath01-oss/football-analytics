export type MatchStatus = 'LIVE' | 'HT' | 'FT';

export type PageRoute = 'home' | 'matches' | 'analytics' | 'about';

export type DataViewState = 'ready' | 'loading' | 'empty' | 'error';

export type FormResult = 'W' | 'D' | 'L';

export interface RecentMatchEntry {
  result: FormResult;
  opponent: string;
  score: string;
  competition: string;
}

export interface TeamCrestStyle {
  primary: string;
  secondary: string;
  accent: string;
  pattern: 'split' | 'stripes' | 'band' | 'chevron' | 'halves' | 'sash';
}

export interface TeamPerformance {
  recentForm: RecentMatchEntry[];
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  matchesPlayed: number;
  leaguePosition: number;
  expectedGoalsPerMatch: number;
}

export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  code: string;
  crest: TeamCrestStyle;
  performance: TeamPerformance;
}

export interface MatchStatComparison {
  possession: [number, number];
  totalShots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  expectedGoals: [number, number];
}

export interface ProbabilityPoint {
  minute: number;
  label: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  event?: {
    type: 'goal' | 'card' | 'kickoff' | 'halftime' | 'fulltime';
    team?: 'home' | 'away';
    description: string;
  };
}

export interface HeadToHeadMeeting {
  date: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  winner: 'home' | 'away' | 'draw';
}

export interface HeadToHeadRecord {
  totalMeetings: number;
  homeTeamWins: number;
  draws: number;
  awayTeamWins: number;
  recentMeetings: HeadToHeadMeeting[];
}

export interface WinProbabilities {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export interface MatchData {
  id: string;
  league: string;
  leagueCountry: string;
  venue: string;
  matchDate: string;
  kickoffTime: string;
  status: MatchStatus;
  minute: number;
  displayTime: string;
  homeScore: number;
  awayScore: number;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  probabilities: WinProbabilities;
  stats: MatchStatComparison;
  probabilityTrend: ProbabilityPoint[];
  headToHead: HeadToHeadRecord;
  keyInsight: string;
}
