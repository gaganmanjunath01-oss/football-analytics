import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types/match';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

const METHODOLOGY_STEPS = [
  {
    number: '01',
    title: 'Scoreline & Time-Decay State',
    description:
      'As the match clock approaches 90 minutes, the influence of the current goal margin increases non-linearly. A one-goal lead at 75\' carries substantially higher win certainty than the same lead at 15\'.',
  },
  {
    number: '02',
    title: 'Shot Quality & Expected Goals (xG)',
    description:
      'Shots on target, shot location, and cumulative xG measure attacking threat beyond raw scorelines, allowing the probability curve to anticipate equalizers or sustained pressure.',
  },
  {
    number: '03',
    title: 'Territorial Control & Discipline',
    description:
      'Possession share, corners won, fouls conceded, and yellow cards help capture momentum shifts and late-match fatigue or tactical low blocks.',
  },
  {
    number: '04',
    title: 'Historical Form & Head-to-Head Priors',
    description:
      'Pre-match priors incorporate recent five-match form, season goals scored/conceded, and head-to-head records before blending seamlessly into live telemetry after kick-off.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Why do probabilities still shift when no goal is scored?',
    a: 'Even when the scoreline remains unchanged, the remaining time decreases while shots on target, corners, and territorial possession evolve. A trailing team creating frequent chances can nudge draw probability upward before time decay pulls it back down.',
  },
  {
    q: 'What do the three probability colors represent?',
    a: 'Electric green represents Home Win probability, yellow represents Draw probability, and blue represents Away Win probability across all bars and timeline graphs.',
  },
  {
    q: 'Are MatchPulse predictions guaranteed outcomes?',
    a: 'No. Predictions are estimates based on available match data and historical statistical patterns. Football outcomes always remain subject to on-pitch variance.',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Intro */}
      <section className="rounded-xl border border-slate-800 bg-[#11192A] p-7 sm:p-8">
        <div className="text-xs font-medium text-emerald-400">
          About MatchPulse
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-50 [text-wrap:balance]">
          Transparent win probability modeling for live football
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-300">
          MatchPulse translates live match statistics, time-remaining dynamics, and historical team performance into clear, readable win, draw, and loss probabilities. Designed for fans and analysts, every match view pairs real-time percentages with the underlying stats driving each prediction.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('matches')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span>Explore Live Matches</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span>Open Match Analytics</span>
          </button>
        </div>
      </section>

      {/* Methodology Grid */}
      <section aria-labelledby="methodology-heading" className="space-y-4">
        <h2
          id="methodology-heading"
          className="font-display text-xl font-bold text-slate-50"
        >
          How Match Probabilities Are Estimated
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {METHODOLOGY_STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-slate-800 bg-[#11192A] p-6"
            >
              <div className="font-mono text-xs font-semibold text-emerald-400">
                {step.number}.
              </div>
              <h3 className="mt-1.5 font-display text-base font-bold text-slate-100">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section
        aria-labelledby="faq-heading"
        className="rounded-xl border border-slate-800 bg-[#11192A] p-6 sm:p-7"
      >
        <h2
          id="faq-heading"
          className="font-display text-xl font-bold text-slate-50"
        >
          Frequently Asked Questions
        </h2>

        <div className="mt-4 divide-y divide-slate-800">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5 first:pt-1 last:pb-1">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-1 text-left text-sm font-semibold text-slate-100 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 pr-6 text-sm leading-relaxed text-slate-400">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-400">
          Disclaimer: Predictions are estimates based on available match data.
        </p>
      </section>
    </div>
  );
};
