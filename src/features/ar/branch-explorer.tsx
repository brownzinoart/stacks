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
  { id: 'nonfiction', name: 'Non-Fiction', description: 'Biographies, history, self-help', color: 'bg-primary-green', items: 156 },
  { id: 'reference', name: 'Reference', description: 'Encyclopedias, dictionaries', color: 'bg-primary-yellow', items: 89 },
  { id: 'children', name: 'Children\'s Books', description: 'Books for young readers', color: 'bg-primary-pink', items: 178 },
  { id: 'magazines', name: 'Periodicals', description: 'Magazines and newspapers', color: 'bg-primary-purple', items: 45 },
  { id: 'computers', name: 'Computer Lab', description: 'Public computers and printers', color: 'bg-primary-teal', items: 12 },
];

export const BranchExplorer = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId === selectedZone ? null : zoneId);
    // TODO: Implement zone navigation
    console.log('Selected zone:', zoneId);
  };

  const selectedZoneData = mockZones.find(zone => zone.id === selectedZone);

  return (
    <div className="bg-primary-teal rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
      <div className="space-y-6 sm:space-y-8 relative z-10">
        <div>
          <h2 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
            <span className="text-primary-orange">EXPLORE</span><br />
            <span className="text-mega">LIBRARY</span>
          </h2>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Interactive Floor Plan */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 outline-bold-thin">
            <h3 className="font-black text-text-primary text-lg mb-4">FLOOR PLAN</h3>
            
            <div className="relative bg-white/60 rounded-2xl p-4 h-64 outline-bold-thin">
              {/* Simple floor plan representation */}
              <div className="relative w-full h-full border-2 border-text-primary rounded-xl">
                {/* Library zones as interactive areas */}
                {mockZones.map((zone, index) => {
                  const isSelected = selectedZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => handleZoneSelect(zone.id)}
                      className={`absolute ${zone.color} opacity-70 hover:opacity-90 transition-all duration-300 rounded-lg cursor-pointer ${
                        isSelected ? 'ring-4 ring-primary-orange ring-offset-2 shadow-backdrop' : ''
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
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-primary-orange text-white text-xs px-3 py-1 rounded-full font-black shadow-backdrop">
                  ENTRANCE
                </div>
              </div>
            </div>
            
            <p className="text-base sm:text-lg text-text-primary font-bold mt-4">
              Tap zones to see details and get directions
            </p>
          </div>
          
          {/* Zone Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 outline-bold-thin">
            <h3 className="font-black text-text-primary text-lg mb-4">ZONE INFORMATION</h3>
            
            {selectedZoneData ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full ${selectedZoneData.color} shadow-backdrop`} />
                  <h4 className="font-black text-text-primary text-xl">{selectedZoneData.name}</h4>
                </div>
                
                <p className="text-base sm:text-lg text-text-primary font-bold">{selectedZoneData.description}</p>
                
                <div className="bg-white/60 p-4 rounded-2xl outline-bold-thin">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg text-text-primary font-bold">Available items</span>
                    <span className="font-black text-text-primary text-xl">{selectedZoneData.items}</span>
                  </div>
                </div>
                
                <button className="w-full bg-primary-orange text-white font-black py-3 px-6 rounded-2xl hover:scale-105 transition-transform touch-feedback shadow-backdrop text-lg">
                  🧭 GET DIRECTIONS
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl sm:text-8xl mb-6">🗺️</div>
                <p className="text-base sm:text-lg text-text-primary font-bold">
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
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                selectedZone === zone.id
                  ? 'border-primary-orange bg-primary-orange/10 shadow-backdrop'
                  : 'border-text-primary hover:border-primary-orange bg-white/80 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${zone.color} shadow-backdrop`} />
                <div>
                  <h4 className="font-black text-text-primary text-base">{zone.name}</h4>
                  <p className="text-sm text-text-primary font-bold">{zone.items} items</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 bg-primary-yellow rounded-full opacity-25 animate-float z-0" />
      <div className="absolute bottom-8 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 animate-float-delayed z-0" />
      <div className="absolute top-12 left-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-blue rounded-full opacity-35 animate-float-slow z-0" />
      <div className="absolute bottom-4 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-green rounded-full opacity-20 animate-float z-0" />
      <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-orange rounded-full opacity-40 animate-float-delayed z-0" />
      <div className="absolute bottom-12 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-purple rounded-full opacity-30 animate-float-slow z-0" />
    </div>
  );
}; 