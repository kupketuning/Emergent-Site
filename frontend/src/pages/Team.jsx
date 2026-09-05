import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Heart, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { teams, socialEngagement } from '../mock';
import Seo from '../components/Seo';

const TeamCard = ({ t }) => (
  <div
    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#E63946]/60 hover:shadow-lg transition-all"
    data-testid={`team-card-${t.name.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <div className="flex items-center gap-3 mb-4">
      <span className="w-11 h-11 rounded-full bg-[#E63946] flex items-center justify-center shrink-0">
        <Trophy className="w-5 h-5 text-white" />
      </span>
      <div>
        <p className="font-logo font-bold text-lg leading-none text-[#17191d]">{t.name}</p>
        <p className="text-xs text-gray-500 mt-1">{t.ort}</p>
      </div>
    </div>
    <p className="text-[#E63946] text-xs font-bold uppercase tracking-wide mb-1">{t.rennserie || t.disziplin}</p>
    <p className="font-semibold text-sm text-[#17191d] mb-2">{t.fahrzeug}</p>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">{t.text}</p>
    {(t.instagram || t.youtube) && (
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        {t.instagram && (
          <a href={t.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E63946] transition-colors" data-testid={`team-instagram-${t.name}`}>
            <Instagram className="w-5 h-5" />
          </a>
        )}
        {t.youtube && (
          <a href={t.youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E63946] transition-colors" data-testid={`team-youtube-${t.name}`}>
            <Youtube className="w-5 h-5" />
          </a>
        )}
      </div>
    )}
  </div>
);

const Team = () => (
  <div data-testid="team-page">
    <Seo
      title="Teams, die wir unterstützen"
      description="Die Motorsport-Teams hinter Kupke Tuning: von Trabant-Rallye bis Bergrennen im Audi S3."
      path="/team"
    />
    <section className="bg-[#17191d] text-white">
      <div className="max-w-[1300px] mx-auto px-4 py-16 text-center">
        <span className="inline-flex items-center gap-2 text-[#E63946] text-sm font-bold uppercase tracking-widest mb-3">
          <Trophy className="w-4 h-4" /> Kupke-Tuning Motorsport
        </span>
        <h1 className="font-logo text-3xl md:text-5xl font-bold uppercase mb-4" data-testid="team-page-title">Teams, die wir unterstützen</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Wir fördern junge und erfahrene Fahrer:innen mit unseren eigenentwickelten Tuningteilen – vom Rallye-Trabant bis zum Bergrennen-Audi.
        </p>
      </div>
    </section>

    <section className="max-w-[1300px] mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="team-grid">
        {teams.map((t) => <TeamCard key={t.name} t={t} />)}
      </div>
    </section>

    <section className="bg-[#f4f5f7] border-y border-gray-200">
      <div className="max-w-[1300px] mx-auto px-4 py-14">
        <div className="bg-white border border-[#2EC4B6]/40 rounded-xl p-8 flex flex-col md:flex-row items-center gap-6" data-testid="social-engagement-card">
          <span className="w-16 h-16 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center shrink-0">
            <Heart className="w-8 h-8 text-[#2EC4B6]" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[#2EC4B6] text-xs font-bold uppercase tracking-wide mb-1">Soziales Engagement</p>
            <h2 className="font-logo text-2xl font-bold text-[#17191d] uppercase mb-2">{socialEngagement?.name}</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">{socialEngagement?.text}</p>
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-[1300px] mx-auto px-4 py-14 text-center">
      <h2 className="font-logo text-2xl font-bold text-[#17191d] uppercase mb-3">Du willst dein Team vorstellen?</h2>
      <p className="text-gray-600 mb-6 max-w-xl mx-auto">Fährst du mit Kupke-Tuning-Teilen im Motorsport? Wir freuen uns von dir zu hören.</p>
      <Link
        to="/kontakt"
        className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-8 py-3.5 rounded-md transition-colors uppercase tracking-wide"
        data-testid="team-contact-cta"
      >
        Kontakt aufnehmen <ArrowRight className="w-5 h-5" />
      </Link>
    </section>
  </div>
);

export default Team;
