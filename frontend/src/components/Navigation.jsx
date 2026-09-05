import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { VEHICLES, TYPES } from '../lib/catalog';

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-[#17191d]">
      <div className="max-w-[1300px] mx-auto px-4 flex items-stretch justify-between">
        {/* Desktop */}
        <ul className="hidden lg:flex items-stretch">
          {VEHICLES.map((v) => (
            <li key={v.slug} className="relative group">
              <Link
                to={`/katalog/${v.slug}`}
                data-testid={`nav-vehicle-${v.slug}`}
                className={`flex items-center gap-1 px-4 h-12 text-[15px] font-semibold text-gray-200 hover:text-white border-b-2 border-transparent hover:border-[#E63946] transition-colors ${v.primary ? 'text-[#E63946]' : ''}`}
              >
                {v.name}
                <ChevronDown className="w-4 h-4" />
              </Link>
              <div className="absolute left-0 top-full z-40 min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-b-md opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                <ul className="py-2">
                  {TYPES.map((t) => (
                    <li key={t.slug}>
                      <Link to={`/katalog/${v.slug}/${t.slug}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#fdecec] hover:text-[#E63946] transition-colors">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>

        {/* Right: company links */}
        <ul className="hidden lg:flex items-stretch">
          {[{ to: '/team', label: 'Teams' }, { to: '/ueber-uns', label: 'Über uns' }, { to: '/dekra', label: 'DEKRA' }, { to: '/kontakt', label: 'Kontakt' }].map((l) => (
            <li key={l.to}>
              <Link to={l.to} data-testid={`nav-${l.to.replace('/', '')}`} className="flex items-center px-4 h-12 text-sm font-semibold text-gray-300 hover:text-white border-b-2 border-transparent hover:border-[#2EC4B6] transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button onClick={() => setOpen((o) => !o)} className="lg:hidden flex items-center gap-2 h-12 text-gray-100 font-semibold">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />} Menü
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#1f2228] border-t border-black/30">
          <ul className="px-4 py-2">
            {VEHICLES.map((v) => (
              <li key={v.slug} className="border-b border-white/10">
                <Link to={`/katalog/${v.slug}`} onClick={() => setOpen(false)} className="block py-3 font-semibold text-gray-200 hover:text-[#E63946]">
                  {v.name}
                </Link>
              </li>
            ))}
            {[{ to: '/team', label: 'Teams' }, { to: '/ueber-uns', label: 'Über uns' }, { to: '/dekra', label: 'DEKRA-geprüfte Qualität' }, { to: '/kontakt', label: 'Kontakt' }].map((l) => (
              <li key={l.to} className="border-b border-white/10 last:border-0">
                <Link to={l.to} onClick={() => setOpen(false)} className="block py-3 font-semibold text-gray-300 hover:text-[#2EC4B6]">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
