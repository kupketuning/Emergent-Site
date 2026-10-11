import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingCart, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatEuro } from '../mock';
import Logo from './Logo';

const Header = () => {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { count, total } = useCart();
  const { user } = useAuth();

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="w-full bg-white">
      <div className="max-w-[1300px] mx-auto px-4 py-4 flex items-center gap-6">
        {/* Logo */}
        <Logo variant="dark" size={40} />

        {/* Search */}
        <form onSubmit={submit} className="flex-1 hidden md:block max-w-[560px]">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Suchbegriff eingeben ..."
              className="w-full h-11 rounded-md border border-gray-300 pl-4 pr-12 text-sm outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
            />
            <button type="submit" aria-label="Suchen" className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-white bg-[#E63946] hover:bg-[#C92F3C] rounded-r-md transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-5 md:gap-6 ml-auto text-[#2d3748]">
          <Link to="/kontakt" className="hidden sm:flex flex-col items-center text-xs hover:text-[#E63946] transition-colors">
            <Phone className="w-5 h-5 mb-1" />
            Kontakt
          </Link>
          <button className="hidden sm:flex flex-col items-center text-xs hover:text-[#E63946] transition-colors" onClick={() => alert('Wunschliste folgt in Kürze!')}>
            <Heart className="w-5 h-5 mb-1" />
            Wunschliste
          </button>
          <Link to={user ? '/konto' : '/konto/anmelden'} data-testid="header-account-link" className="hidden sm:flex flex-col items-center text-xs hover:text-[#E63946] transition-colors">
            <User className="w-5 h-5 mb-1" />
            {user ? (user.name ? user.name.split(' ')[0] : 'Konto') : 'Konto'}
          </Link>
          <Link to="/cart" className="relative flex flex-col items-center text-xs hover:text-[#E63946] transition-colors">
            <div className="relative">
              <ShoppingCart className="w-5 h-5 mb-1" />
              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#E63946] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{count}</span>
              )}
            </div>
            <span className="font-semibold">{formatEuro(total)}</span>
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={submit} className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Suchbegriff eingeben ..."
            className="w-full h-11 rounded-md border border-gray-300 pl-4 pr-12 text-sm outline-none focus:border-[#E63946]"
          />
          <button type="submit" aria-label="Suchen" className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-white bg-[#E63946] rounded-r-md">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
    </header>
  );
};

export default Header;
