import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Flag, Wrench, Award, Car, ChevronLeft, ChevronRight, ArrowRight, Trophy, CalendarCheck, BadgeCheck, Cog, Disc } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { features, teams, IMG } from '../mock';
import { useProducts } from '../context/ProductsContext';
import VehicleTiles from '../components/VehicleTiles';
import Seo from '../components/Seo';

const iconMap = { Flag, Wrench, Award, Car };

const Home = () => {
  const scroller = useRef(null);
  const { products } = useProducts();

  const scroll = (dir) => {
    if (!scroller.current) return;
    scroller.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div>
      <Seo path="/" />
      {/* Hero */}
      <section className="relative bg-[#17191d] text-white" data-testid="hero">
        <div className="absolute inset-0">
          <img src={IMG.hero_race} alt="Trabant im Motorsport auf der Rennstrecke" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} />
        </div>
        <div className="relative max-w-[1100px] mx-auto px-4 py-16 md:py-28 text-center flex flex-col items-center">
          <h1 className="font-logo text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.05] mb-4 text-white drop-shadow" data-testid="hero-title">
            Vom Motorsport auf die Straße
          </h1>
          <p className="text-white/90 text-base md:text-lg font-normal mb-3 max-w-2xl">
            Ersatzteile und Tuningteile für Trabant, Wartburg, Barkas, VW und Opel
          </p>
          <p className="text-[#2EC4B6] text-lg md:text-2xl font-bold mb-8 max-w-2xl" data-testid="hero-proof">
            Über 2.000 km Nordschleife-Erfahrung mit unserem Fahrzeug.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link to="/katalog/trabant" className="inline-flex items-center justify-center gap-2 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-8 py-3.5 rounded-md transition-colors uppercase tracking-wide" data-testid="hero-cta-eigenfertigung">
              Unsere Eigenfertigung <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#beliebte-tuningteile" className="inline-flex items-center justify-center gap-2 border-2 border-white/70 hover:bg-white hover:text-[#17191d] text-white font-semibold px-8 py-3.5 rounded-md transition-colors uppercase tracking-wide" data-testid="hero-cta-highlights">
              Highlights des Monats
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#f4f5f7] border-b border-gray-200" data-testid="trust-bar">
        <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-center">
          <div className="flex flex-col items-center px-4">
            <CalendarCheck className="w-9 h-9 text-[#E63946] mb-3" strokeWidth={1.7} />
            <p className="font-logo text-xl font-bold text-[#333333] uppercase">Seit 1995</p>
            <p className="text-sm text-gray-600 mt-1 max-w-[260px]">Über drei Jahrzehnte Erfahrung im Trabant-Motorsport</p>
          </div>
          <div className="flex flex-col items-center px-4 md:border-x border-gray-200">
            <BadgeCheck className="w-9 h-9 text-[#2EC4B6] mb-3" strokeWidth={1.7} />
            <p className="font-logo text-xl font-bold text-[#333333] uppercase">DEKRA-Gutachten</p>
            <p className="text-sm text-gray-600 mt-1 max-w-[260px]">Für unsere Bauteile liegen Prüfgutachten der DEKRA vor</p>
          </div>
          <div className="flex flex-col items-center px-4">
            <Cog className="w-9 h-9 text-[#E63946] mb-3" strokeWidth={1.7} />
            <p className="font-logo text-xl font-bold text-[#333333] uppercase">Eigene Fertigung</p>
            <p className="text-sm text-gray-600 mt-1 max-w-[260px]">Sonderanfertigungen und Motorenbau aus eigener Werkstatt</p>
          </div>
        </div>
      </section>

      {/* Race video */}
      <section className="bg-white border-b border-gray-200" data-testid="home-video">
        <div className="max-w-[1300px] mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/54tBzBAtygM"
              title="Kupke Tuning Motorsport Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              data-testid="home-youtube-embed"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-[#E63946] text-sm font-bold uppercase tracking-widest mb-3"><Flag className="w-4 h-4" /> Aus dem Rennalltag</span>
            <h2 className="font-logo text-3xl md:text-4xl font-bold text-[#17191d] uppercase mb-4">Erlebe uns im Motorsport</h2>
            <p className="text-gray-600 mb-6 max-w-md">Ein Blick hinter die Kulissen: unsere Teams, unsere Technik und unsere Leidenschaft für den Trabant-Motorsport – hautnah erlebt.</p>
            <Link to="/team" className="inline-flex items-center gap-2 text-[#E63946] font-semibold hover:underline" data-testid="home-video-team-link">
              Alle Teams entdecken <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vehicle tiles */}
      <VehicleTiles />

      {/* Brake spotlight */}
      <section className="bg-[#E63946]" data-testid="brake-spotlight">
        <div className="max-w-[1300px] mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <span className="inline-flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest mb-2"><Disc className="w-4 h-4" /> Eigenentwicklung</span>
            <h2 className="font-logo text-2xl md:text-3xl font-bold uppercase mb-2">Bremsen von Kupke Tuning</h2>
            <p className="text-white/90 max-w-xl">Mehr Verzögerung, mehr Sicherheit: unsere Scheibenbremsen-Umrüstungen sind eine unserer stärksten Eigenentwicklungen – erprobt im Motorsport.</p>
          </div>
          <Link
            to="/katalog/trabant/tuning/bremse"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-[#E63946] font-bold px-6 py-3 rounded-md uppercase tracking-wide hover:bg-[#17191d] hover:text-white transition-colors"
            data-testid="brake-spotlight-cta"
          >
            Bremsen entdecken <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>


      {/* Product carousel */}
      <section id="beliebte-tuningteile" className="max-w-[1300px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-logo text-2xl md:text-3xl font-bold text-[#17191d] uppercase">Beliebte Tuningteile</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="zurück" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#E63946] hover:text-white hover:border-[#E63946] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => scroll(1)} aria-label="weiter" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#E63946] hover:text-white hover:border-[#E63946] transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div ref={scroller} className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x" style={{ scrollbarWidth: 'thin' }} data-testid="home-product-carousel">
          {products.slice(0, 14).map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f4f5f7] border-y border-gray-200 mt-6">
        <div className="max-w-[1300px] mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((f, i) => {
              const Icon = iconMap[f.icon];
              return (
                <div key={i} className="text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#E63946]/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-[#E63946]" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-logo text-xl font-bold text-[#17191d] mb-3 uppercase">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-[260px]">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Race teams */}
      <section className="bg-[#17191d] text-white">
        <div className="max-w-[1300px] mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[#E63946] text-sm font-bold uppercase tracking-widest mb-3"><Flag className="w-4 h-4" /> Kupke-Tuning Motorsport</span>
            <h2 className="font-logo text-3xl md:text-4xl font-bold uppercase">Diese Teams fahren mit uns</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Wir unterstützen junge Teams in ihrer Entwicklung – mit unseren speziell entwickelten Tuningteilen für den Trabant.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {teams.slice(0, 4).map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-[#E63946]/60 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-9 h-9 rounded-full bg-[#E63946] flex items-center justify-center"><Trophy className="w-5 h-5" /></span>
                  <div>
                    <p className="font-logo font-bold text-lg leading-none">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.ort}</p>
                  </div>
                </div>
                <p className="text-[#E63946] text-xs font-bold uppercase tracking-wide mb-1">{t.rennserie || t.disziplin}</p>
                <p className="font-semibold text-sm mb-2">{t.fahrzeug}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/team"
              className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-[#E63946] hover:text-[#E63946] text-white font-semibold px-8 py-3 rounded-md uppercase tracking-wide transition-colors"
              data-testid="home-teams-cta"
            >
              Alle Teams ansehen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New products */}
      <section className="max-w-[1300px] mx-auto px-4 py-14">
        <h2 className="font-logo text-2xl md:text-3xl font-bold text-[#17191d] mb-6 text-center uppercase">Neu im Sortiment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.filter((p) => p.badge === 'Rennsport' || p.badge === 'Set').concat(products).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
