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
  { id: 'fiction', name: 'Fiction', description: 'Novels and literature', color: 'bg-blue-500', items: 234 },
  { id: 'nonfiction', name: 'Non-Fiction', description: 'Biographies, history, self-help', color: 'bg-green-500', items: 156 },
  { id: 'reference', name: 'Reference', description: 'Encyclopedias, dictionaries', color: 'bg-yellow-500', items: 89 },
  { id: 'children', name: 'Children\'s Books', description: 'Books for young readers', color: 'bg-pink-500', items: 178 },
  { id: 'magazines', name: 'Periodicals', description: 'Magazines and newspapers', color: 'bg-purple-500', items: 45 },
  { id: 'computers', name: 'Computer Lab', description: 'Public computers and printers', color: 'bg-gray-500', items: 12 },
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Explore Central Library</h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interactive Floor Plan */}
        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="font-medium text-text-primary mb-4">Floor Plan</h3>
          
          <div className="relative bg-gray-100 rounded-lg p-4 h-64">
            {/* Simple floor plan representation */}
            <div className="relative w-full h-full border-2 border-gray-300 rounded">
              {/* Library zones as interactive areas */}
              {mockZones.map((zone, index) => {
                const isSelected = selectedZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneSelect(zone.id)}
                    className={`absolute ${zone.color} opacity-60 hover:opacity-80 transition-opacity rounded cursor-pointer ${
                      isSelected ? 'ring-2 ring-accent ring-offset-2' : ''
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
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Entrance
              </div>
            </div>
          </div>
          
          <p className="text-sm text-text-secondary mt-2">
            Tap zones to see details and get directions
          </p>
        </div>
        
        {/* Zone Information */}
        <div className="rounded-card bg-white p-6 shadow-card">
          <h3 className="font-medium text-text-primary mb-4">Zone Information</h3>
          
          {selectedZoneData ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${selectedZoneData.color}`} />
                <h4 className="font-medium text-text-primary">{selectedZoneData.name}</h4>
              </div>
              
              <p className="text-text-secondary">{selectedZoneData.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Available items</span>
                  <span className="font-medium text-text-primary">{selectedZoneData.items}</span>
                </div>
              </div>
              
              <button className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                🧭 Get Directions
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-text-secondary">
                Select a zone on the floor plan to see details
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Zone List */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mockZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => handleZoneSelect(zone.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedZone === zone.id
                ? 'border-accent bg-accent/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded ${zone.color}`} />
              <div>
                <h4 className="font-medium text-text-primary">{zone.name}</h4>
                <p className="text-sm text-text-secondary">{zone.items} items</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 