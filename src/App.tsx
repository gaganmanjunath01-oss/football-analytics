import { useEffect, useMemo, useState } from 'react';
import { INITIAL_MATCHES } from './data/matches';
import { MatchData, PageRoute } from './types/match';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LiveMatchesPage } from './components/LiveMatchesPage';
import { MatchDetailsPage } from './components/MatchDetailsPage';
import { AboutPage } from './components/AboutPage';

export default function App() {
  const [matches, setMatches] = useState<MatchData[]>(INITIAL_MATCHES);
  const [activePage, setActivePage] = useState<PageRoute>('home');
  const [selectedMatchId, setSelectedMatchId] = useState<string>(INITIAL_MATCHES[0].id);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  const liveCount = useMemo(
    () => matches.filter((m) => m.status === 'LIVE' || m.status === 'HT').length,
    [matches]
  );

  const selectedMatch = useMemo(
    () => matches.find((m) => m.id === selectedMatchId) ?? matches[0],
    [matches, selectedMatchId]
  );

  // Subtle live clock & probability drift when live feed is active
  useEffect(() => {
    if (!isStreaming) return;

    const timer = window.setInterval(() => {
      setMatches((prev) =>
        prev.map((match) => {
          if (match.status !== 'LIVE') return match;
          if (match.minute >= 89) return match;

          const nextMinute = match.minute + 1;
          const delta = nextMinute % 2 === 0 ? 1 : -1;

          // Keep probabilities bounded and summing to 100
          let nextHome = Math.min(88, Math.max(6, match.probabilities.homeWin + delta));
          let nextAway = match.probabilities.awayWin;
          let nextDraw = 100 - nextHome - nextAway;

          if (nextDraw < 5) {
            nextDraw = 5;
            nextAway = Math.max(5, 100 - nextHome - nextDraw);
            nextHome = 100 - nextDraw - nextAway;
          }

          const updatedPoint = {
            minute: nextMinute,
            label: `${nextMinute}'`,
            homeWin: nextHome,
            draw: nextDraw,
            awayWin: nextAway,
          };

          return {
            ...match,
            minute: nextMinute,
            displayTime: `${nextMinute}'`,
            probabilities: {
              homeWin: nextHome,
              draw: nextDraw,
              awayWin: nextAway,
            },
            probabilityTrend: [...match.probabilityTrend, updatedPoint],
          };
        })
      );
    }, 12000);

    return () => window.clearInterval(timer);
  }, [isStreaming]);

  const handleNavigate = (page: PageRoute) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setActivePage('analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#090E17] text-slate-100">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        liveCount={liveCount}
        isStreaming={isStreaming}
        onToggleStream={() => setIsStreaming((prev) => !prev)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
        {activePage === 'home' && (
          <HomePage
            matches={matches}
            featuredMatch={matches[0]}
            onSelectMatch={handleSelectMatch}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'matches' && (
          <LiveMatchesPage
            matches={matches}
            onSelectMatch={handleSelectMatch}
          />
        )}

        {activePage === 'analytics' && (
          <MatchDetailsPage
            match={selectedMatch}
            allMatches={matches}
            onSelectMatch={(id) => setSelectedMatchId(id)}
            onBackToMatches={() => handleNavigate('matches')}
          />
        )}

        {activePage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-[#090E17]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-semibold text-slate-200">MatchPulse</span>
            <span aria-hidden="true">·</span>
            <span>Predictions are estimates based on available match data.</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="hover:text-slate-200 transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('matches')}
              className="hover:text-slate-200 transition-colors"
            >
              Live Matches
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('analytics')}
              className="hover:text-slate-200 transition-colors"
            >
              Match Analytics
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('about')}
              className="hover:text-slate-200 transition-colors"
            >
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
