import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { categories } from '../mock';

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-[#17191d]">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Desktop */}
        <ul className="hidden lg:flex items-stretch">
          {categories.map((cat) => (
            <li key={cat.id} className="relative group">
              <Link
                to={`/category/${cat.id}`}
                className={`flex items-center gap-1 px-4 h-12 text-[15px] font-semibold text-gray-200 hover:text-white border-b-2 border-transparent hover:border-[#e11d1d] transition-colors ${cat.id === 'motorsport' ? 'text-[#e11d1d]' : ''}`}
              >
                {cat.name}
                {cat.sub.length > 0 && <ChevronDown className="w-4 h-4" />}
              </Link>
              {cat.sub.length > 0 && (
                <div className="absolute left-0 top-full z-40 min-w-[230px] bg-white shadow-xl border border-gray-100 rounded-b-md opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                  <ul className="py-2">
                    {cat.sub.map((s) => (
                      <li key={s}>
                        <Link to={`/category/${cat.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#fdecec] hover:text-[#e11d1d] transition-colors">
                          {s}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
            {categories.map((cat) => (
              <li key={cat.id} className="border-b border-white/10 last:border-0">
                <Link to={`/category/${cat.id}`} onClick={() => setOpen(false)} className="block py-3 font-semibold text-gray-200 hover:text-[#e11d1d]">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
