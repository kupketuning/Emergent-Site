import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Flag, Wrench, Award, Car, ChevronLeft, ChevronRight, ArrowRight, Trophy } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, features, teams, categories, IMG } from '../mock';

const iconMap = { Flag, Wrench, Award, Car };

const Home = () => {
  const scroller = useRef(null);

  const scroll = (dir) => {
    if (!scroller.current) return;
    scroller.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#17191d] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.hero_race} alt="Motorsport" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17191d] via-[#17191d]/85 to-[#17191d]/40" />
        </div>
        <div className="relative max-w-[1300px] mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-[#e11d1d] text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
              <Trophy className="w-4 h-4" /> Rennsport-erprobt
            </span>
            <h1 className="font-logo text-4xl md:text-6xl font-bold uppercase leading-[1.05] mb-5">
              Trabant-Tuning<br/>vom <span className="text-[#e11d1d]">Motorsport-Profi</span>
            </h1>
            <p className="text-gray-200 text-lg leading-relaxed mb-8 max-w-xl">
              Willkommen bei Kupke-Tuning – Eurem Partner für den Trabant im Rennsport und auf der Straße. Eigenentwickelte Spezialteile für Trabant 1.1 & 601, erprobt in Ralley, Berg- und Slalomeinsatz.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/category/tuning" className="inline-flex items-center gap-2 bg-[#e11d1d] hover:bg-[#b3161c] text-white font-semibold px-7 py-3.5 rounded-md transition-colors uppercase tracking-wide">
                Zum Tuning-Shop <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/category/motorsport" className="inline-flex items-center gap-2 border border-white/40 hover:bg-white hover:text-[#17191d] text-white font-semibold px-7 py-3.5 rounded-md transition-colors uppercase tracking-wide">
                Motorsport-Teile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="max-w-[1300px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="group border border-gray-200 rounded-lg p-5 text-center hover:border-[#e11d1d] hover:shadow-md transition-all">
              <span className="font-logo text-lg font-bold text-[#17191d] group-hover:text-[#e11d1d] transition-colors uppercase">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Product carousel */}
      <section className="max-w-[1300px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-logo text-2xl md:text-3xl font-bold text-[#17191d] uppercase">Beliebte Tuningteile</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="zurück" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#e11d1d] hover:text-white hover:border-[#e11d1d] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => scroll(1)} aria-label="weiter" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#e11d1d] hover:text-white hover:border-[#e11d1d] transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div ref={scroller} className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x" style={{ scrollbarWidth: 'thin' }}>
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
                  <div className="w-16 h-16 rounded-full bg-[#e11d1d]/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-[#e11d1d]" strokeWidth={1.8} />
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
            <span className="inline-flex items-center gap-2 text-[#e11d1d] text-sm font-bold uppercase tracking-widest mb-3"><Flag className="w-4 h-4" /> Kupke-Tuning Motorsport</span>
            <h2 className="font-logo text-3xl md:text-4xl font-bold uppercase">Diese Teams fahren mit uns</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Wir unterstützen junge Teams in ihrer Entwicklung – mit unseren speziell entwickelten Tuningteilen für den Trabant.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {teams.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-[#e11d1d]/60 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-9 h-9 rounded-full bg-[#e11d1d] flex items-center justify-center"><Trophy className="w-5 h-5" /></span>
                  <div>
                    <p className="font-logo font-bold text-lg leading-none">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.ort}</p>
                  </div>
                </div>
                <p className="text-[#e11d1d] text-xs font-bold uppercase tracking-wide mb-1">{t.disziplin}</p>
                <p className="font-semibold text-sm mb-2">{t.fahrzeug}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New products */}
      <section className="max-w-[1300px] mx-auto px-4 py-14">
        <h2 className="font-logo text-2xl md:text-3xl font-bold text-[#17191d] mb-6 text-center uppercase">Neu im Sortiment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.filter((p) => p.badge === 'Neu').concat(products.filter((p) => p.badge === 'Exclusiv' || p.badge === 'Motorsport')).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
