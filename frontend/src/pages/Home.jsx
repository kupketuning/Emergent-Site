import React, { useRef } from 'react';
import { Heart, Wrench, Trophy, Truck, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, features, IMG } from '../mock';

const iconMap = { Heart, Wrench, Trophy, Truck };

const Home = () => {
  const scroller = useRef(null);
  const [playing, setPlaying] = React.useState(false);

  const scroll = (dir) => {
    if (!scroller.current) return;
    scroller.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Video */}
          <div className="relative rounded-lg overflow-hidden shadow-md aspect-video bg-black">
            {playing ? (
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/7pfYh7PpG-U?autoplay=1"
                title="Trabitipp"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button onClick={() => setPlaying(true)} className="group w-full h-full relative">
                <img src={IMG.mechanic1} alt="Trabitipp Video" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full bg-[#e11d1d] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white font-bold text-xl drop-shadow-lg">#Trabitipp – Wintermantel wechseln</div>
              </button>
            )}
          </div>

          {/* Welcome text */}
          <div>
            <h1 className="font-logo text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">Herzlich Willkommen bei TRABANTWELT!</h1>
            <p className="font-bold text-[#1a1a1a] mb-4">Schön, dass Ihr da seid!</p>
            <p className="text-[#3a4658] leading-relaxed mb-4">Euer Herz schlägt für den Trabant? Dann sind wir der Begleiter für Euer Projekt! Trabantwelt – das Versandhaus für hochwertige Ersatzteile und Zubehör rund um das Zwickauer Kultauto!</p>
            <p className="text-[#3a4658] leading-relaxed mb-4">Bei uns findet Ihr Ersatzteile in Originalqualität und Neuproduktionen, aus eigener Entwicklung und Fertigung. Wir garantieren Passgenauigkeit und Langlebigkeit, welche konstant im Rennsport, auf Prüfständen und im Straßeneinsatz bestätigt werden.</p>
            <p className="text-[#3a4658] leading-relaxed">Wir wünschen Euch viel Freude beim Einkauf!</p>
          </div>
        </div>
      </section>

      {/* Product carousel */}
      <section className="max-w-[1300px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-logo text-2xl font-bold text-[#1a1a1a]">Beliebte Produkte</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="zurück" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#008d36] hover:text-white hover:border-[#008d36] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => scroll(1)} aria-label="weiter" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#008d36] hover:text-white hover:border-[#008d36] transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div ref={scroller} className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x" style={{ scrollbarWidth: 'thin' }}>
          {products.slice(0, 12).map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f4f6f9] border-y border-gray-200 mt-6">
        <div className="max-w-[1300px] mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((f, i) => {
              const Icon = iconMap[f.icon];
              return (
                <div key={i} className="text-center flex flex-col items-center">
                  <Icon className="w-12 h-12 text-[#008d36] mb-4" strokeWidth={1.5} />
                  <h3 className="font-logo text-xl font-bold text-[#1a1a1a] mb-3">{f.title}</h3>
                  <p className="text-[#3a4658] text-sm leading-relaxed max-w-[260px]">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category showcase */}
      <section className="max-w-[1300px] mx-auto px-4 py-14">
        <h2 className="font-logo text-2xl font-bold text-[#1a1a1a] mb-6 text-center">Neuheiten im Sortiment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.filter((p) => p.badge === 'Neu').concat(products.filter((p) => p.badge === 'Tuning')).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
