import React from 'react';
import { Car } from 'lucide-react';
import { VEHICLES } from '../lib/catalog';
import { CatalogTile } from './CatalogTile';

const VehicleTiles = () => {
  const primary = VEHICLES.find((v) => v.primary);
  const rest = VEHICLES.filter((v) => !v.primary);

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-10" data-testid="vehicle-tiles">
      <h2 className="font-logo text-2xl md:text-3xl font-bold text-[#17191d] uppercase mb-5">Wähle Dein Fahrzeug</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
        <CatalogTile to={`/katalog/${primary.slug}`} icon={Car} title={primary.name} big testId={`vehicle-tile-${primary.slug}`} />
        {rest.map((v) => (
          <CatalogTile key={v.slug} to={`/katalog/${v.slug}`} icon={Car} title={v.name} testId={`vehicle-tile-${v.slug}`} />
        ))}
      </div>
    </section>
  );
};

export default VehicleTiles;
