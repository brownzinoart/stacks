/**
 * Branch Availability component - shows book availability across library branches
 * Integrates with WorldCat + ILS for real-time availability data
 */

'use client';

const mockBranches = [
  { id: 1, name: 'Central Library', distance: '0.5 mi', available: 12, total: 15 },
  { id: 2, name: 'Westside Branch', distance: '1.2 mi', available: 8, total: 10 },
  { id: 3, name: 'Northside Branch', distance: '2.1 mi', available: 5, total: 8 },
  { id: 4, name: 'Downtown Branch', distance: '0.8 mi', available: 3, total: 6 },
];

export const BranchAvailability = () => {
  const handleReserveAtBranch = (branchId: number) => {
    // TODO: Implement branch reservation
    console.log('Reserving at branch:', branchId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Branch Availability</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {mockBranches.map((branch) => {
          const availabilityPercentage = (branch.available / branch.total) * 100;
          const isHighAvailability = availabilityPercentage >= 70;
          const isMediumAvailability = availabilityPercentage >= 40;
          
          return (
            <div key={branch.id} className="rounded-card bg-white p-4 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-text-primary">{branch.name}</h3>
                  <p className="text-sm text-text-secondary">{branch.distance} away</p>
                </div>
                
                <div className={`w-3 h-3 rounded-full ${
                  isHighAvailability 
                    ? 'bg-green-500' 
                    : isMediumAvailability 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`} />
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Availability</span>
                    <span className="font-medium">{branch.available}/{branch.total} books</span>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isHighAvailability 
                          ? 'bg-green-500' 
                          : isMediumAvailability 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${availabilityPercentage}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => handleReserveAtBranch(branch.id)}
                  disabled={branch.available === 0}
                  className="w-full bg-accent hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  {branch.available > 0 ? 'Reserve Here' : 'Not Available'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center">
        <button className="text-accent hover:text-accent/80 text-sm font-medium">
          View detailed availability map
        </button>
      </div>
    </div>
  );
}; 