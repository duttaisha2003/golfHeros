import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { charityAPI, drawAPI } from '../utils/api';

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-900/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-green-900/40 border border-green-800 text-green-400 text-sm font-medium mb-6 animate-fade-in">
          🌍 Play with purpose
        </span>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
          Golf that<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            changes lives
          </span>
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed">
          Enter your Stableford scores, win monthly prize pools, and support charities you love — all in one platform.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in">
          <Link to="/register" className="btn-primary text-base px-8 py-3 shadow-lg shadow-green-900/40">
            Start Playing Free
          </Link>
          <Link to="/draws" className="btn-secondary text-base px-8 py-3">
            See Monthly Draws
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: '📝', title: 'Subscribe', desc: 'Choose a monthly or yearly plan. A portion supports your chosen charity.' },
    { icon: '⛳', title: 'Enter Scores', desc: 'Log your last 5 Stableford scores. Keep them fresh and accurate.' },
    { icon: '🎰', title: 'Monthly Draw', desc: 'Five numbers drawn each month. Match 3, 4, or 5 to win prize tiers.' },
    { icon: '💚', title: 'Give Back', desc: 'At least 10% of your subscription goes straight to your chosen charity.' },
  ];
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Simple. Fair. Impactful. Four steps to play, win, and give.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="card text-center group hover:border-green-800 transition-colors">
              <div className="w-14 h-14 bg-green-900/40 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrizeSection() {
  const tiers = [
    { match: '5-Number Match', share: '40%', note: 'Jackpot — rolls over if unclaimed', highlight: true },
    { match: '4-Number Match', share: '35%', note: 'Split equally among winners', highlight: false },
    { match: '3-Number Match', share: '25%', note: 'Split equally among winners', highlight: false },
  ];
  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Prize Pool Breakdown</h2>
          <p className="text-gray-500">Every active subscriber contributes to the monthly pool. Winners split prizes within their tier.</p>
        </div>
        <div className="space-y-4">
          {tiers.map((t, i) => (
            <div key={i} className={`flex items-center gap-6 p-5 rounded-2xl border transition-colors ${t.highlight ? 'bg-green-900/30 border-green-700' : 'card'}`}>
              <div className={`text-3xl font-display font-black w-16 text-center ${t.highlight ? 'text-green-400' : 'text-gray-400'}`}>{t.share}</div>
              <div>
                <p className={`font-semibold ${t.highlight ? 'text-green-300' : 'text-white'}`}>{t.match}</p>
                <p className="text-gray-500 text-sm">{t.note}</p>
              </div>
              {t.highlight && <span className="ml-auto badge-active">Jackpot</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CharitySpotlight({ charity }) {
  if (!charity) return null;
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-green-400 text-sm font-medium uppercase tracking-wider">Featured Charity</span>
          <h2 className="font-display text-3xl font-bold text-white mt-2">Spotlight</h2>
        </div>
        <div className="card border-green-800 bg-green-950/20">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 bg-green-800 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">💚</div>
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-2">{charity.name}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{charity.description}</p>
              <Link to="/charities" className="inline-block mt-4 text-green-400 text-sm font-medium hover:text-green-300 transition-colors">
                View all charities →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="card border-green-800 bg-gradient-to-b from-green-950/40 to-gray-900">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Ready to play with purpose?</h2>
          <p className="text-gray-400 mb-8">Join thousands of golfers making every Stableford point count for charity.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-3 shadow-xl shadow-green-900/40">
            Join GolfHeroes Today
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [featuredCharity, setFeaturedCharity] = useState(null);

  useEffect(() => {
    charityAPI.getFeatured().then(({ data }) => setFeaturedCharity(data.charity)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <PrizeSection />
        <CharitySpotlight charity={featuredCharity} />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}