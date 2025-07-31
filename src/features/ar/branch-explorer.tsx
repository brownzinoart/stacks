/**
 * Branch Explorer component - mini-map floorplans highlighting different zones
 * Uses Mapbox Indoor for navigation and zone discovery
 */

'use client';

import { useState } from 'react';

type LibraryZone = {
  id: string;
  name: string;
  description: string;
  color: string;
  items: number;
};

const mockZones: LibraryZone[] = [
  { id: 'fiction', name: 'Fiction', description: 'Novels and literature', color: 'bg-primary-blue', items: 234 },
  {
    id: 'nonfiction',
    name: 'Non-Fiction',
    description: 'Biographies, history, self-help',
    color: 'bg-primary-green',
    items: 156,
  },
  {
    id: 'reference',
    name: 'Reference',
    description: 'Encyclopedias, dictionaries',
    color: 'bg-primary-yellow',
    items: 89,
  },
  {
    id: 'children',
    name: "Children's Books",
    description: 'Books for young readers',
    color: 'bg-primary-pink',
    items: 178,
  },
  {
    id: 'magazines',
    name: 'Periodicals',
    description: 'Magazines and newspapers',
    color: 'bg-primary-purple',
    items: 45,
  },
  {
    id: 'computers',
    name: 'Computer Lab',
    description: 'Public computers and printers',
    color: 'bg-primary-teal',
    items: 12,
  },
];

export const BranchExplorer = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId === selectedZone ? null : zoneId);
    // TODO: Implement zone navigation
    console.log('Selected zone:', zoneId);
  };

  const selectedZoneData = mockZones.find((zone) => zone.id === selectedZone);

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-teal p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div>
          <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
            <span className="text-primary-orange">EXPLORE</span>
            <br />
            <span className="text-mega">LIBRARY</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Interactive Floor Plan */}
          <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-black text-text-primary">FLOOR PLAN</h3>

            <div className="outline-bold-thin relative h-64 rounded-2xl bg-white/60 p-4">
              {/* Simple floor plan representation */}
              <div className="relative h-full w-full rounded-xl border-2 border-text-primary">
                {/* Library zones as interactive areas */}
                {mockZones.map((zone, index) => {
                  const isSelected = selectedZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => handleZoneSelect(zone.id)}
                      className={`absolute ${zone.color} cursor-pointer rounded-lg opacity-70 transition-all duration-300 hover:opacity-90 ${
                        isSelected ? 'shadow-backdrop ring-4 ring-primary-orange ring-offset-2' : ''
                      }`}
                      style={{
                        left: `${(index % 3) * 30 + 10}%`,
                        top: `${Math.floor(index / 3) * 40 + 10}%`,
                        width: '25%',
                        height: '30%',
                      }}
                    />
                  );
                })}

                {/* Entrance marker */}
                <div className="shadow-backdrop absolute bottom-2 left-1/2 -translate-x-1/2 transform rounded-full bg-primary-orange px-3 py-1 text-xs font-black text-white">
                  ENTRANCE
                </div>
              </div>
            </div>

            <p className="mt-4 text-base font-bold text-text-primary sm:text-lg">
              Tap zones to see details and get directions
            </p>
          </div>

          {/* Zone Information */}
          <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-black text-text-primary">ZONE INFORMATION</h3>

            {selectedZoneData ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`h-6 w-6 rounded-full ${selectedZoneData.color} shadow-backdrop`} />
                  <h4 className="text-xl font-black text-text-primary">{selectedZoneData.name}</h4>
                </div>

                <p className="text-base font-bold text-text-primary sm:text-lg">{selectedZoneData.description}</p>

                <div className="outline-bold-thin rounded-2xl bg-white/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-text-primary sm:text-lg">Available items</span>
                    <span className="text-xl font-black text-text-primary">{selectedZoneData.items}</span>
                  </div>
                </div>

                <button className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-orange px-6 py-3 text-lg font-black text-white transition-transform hover:scale-105">
                  🧭 GET DIRECTIONS
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mb-6 text-6xl sm:text-8xl">🗺️</div>
                <p className="text-base font-bold text-text-primary sm:text-lg">
                  Select a zone on the floor plan to see details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Zone List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleZoneSelect(zone.id)}
              className={`rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:scale-105 ${
                selectedZone === zone.id
                  ? 'shadow-backdrop border-primary-orange bg-primary-orange/10'
                  : 'border-text-primary bg-white/80 backdrop-blur-sm hover:border-primary-orange'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-4 w-4 rounded-full ${zone.color} shadow-backdrop`} />
                <div>
                  <h4 className="text-base font-black text-text-primary">{zone.name}</h4>
                  <p className="text-sm font-bold text-text-primary">{zone.items} items</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-yellow opacity-25 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-green opacity-20 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-purple opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
