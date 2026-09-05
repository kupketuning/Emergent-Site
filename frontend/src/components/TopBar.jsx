import React from 'react';
import { Truck, Wrench, Trophy, Facebook, Instagram, Youtube } from 'lucide-react';
import { topbarItems } from '../mock';

const iconMap = { Truck, Wrench, Trophy };

const TopBar = () => {
  return (
    <div className="w-full bg-[#17191d] text-gray-300 text-[13px]">
      <div className="max-w-[1300px] mx-auto px-4 h-10 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8 flex-1 justify-between max-w-[900px]">
          {topbarItems.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={idx} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#E63946]" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#E63946] transition-colors"><Facebook className="w-4 h-4" /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#E63946] transition-colors"><Instagram className="w-4 h-4" /></a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#E63946] transition-colors"><Youtube className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
