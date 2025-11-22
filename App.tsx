import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import PropertyDetail from './components/PropertyDetail';
import ListingForm from './components/ListingForm';
import { Property, User, TransactionType, PropertyType, ListingTier } from './types';
import { MOCK_PROPERTIES, MOCK_USER } from './constants';
import { PlusCircle, LogOut, User as UserIcon, Heart } from 'lucide-react';

const App: React.FC = () => {
  // Helper to sort properties by tier: Featured > Prime > Free
  // Added secondary sort to keep list stable (Price High to Low)
  const sortPropertiesByTier = (props: Property[]) => {
    const priority = {
      [ListingTier.FEATURED]: 3,
      [ListingTier.PRIME]: 2,
      [ListingTier.FREE]: 1
    };
    return [...props].sort((a, b) => {
      const pA = priority[a.tier] || 1;
      const pB = priority[b.tier] || 1;
      
      // Primary Sort: Tier descending
      if (pA !== pB) {
          return pB - pA;
      }
      
      // Secondary Sort: Price descending (as a fallback tie-breaker)
      return b.price - a.price;
    });
  };

  // State Management
  const [activeModule, setActiveModule] = useState<'general' | 'property'>('property');
  const [user, setUser] = useState<User>(MOCK_USER);
  // Initialize with sorted properties
  const [properties, setProperties] = useState<Property[]>(sortPropertiesByTier(MOCK_PROPERTIES));
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sortPropertiesByTier(MOCK_PROPERTIES));
  
  // Navigation State
  const [view, setView] = useState<'list' | 'create' | 'saved'>('list');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Saved Properties State
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);

  // Load Saved Properties from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedProperties');
    if (saved) {
        try {
            setSavedPropertyIds(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to parse saved properties", e);
        }
    }
  }, []);

  // Toggle Save Function
  const toggleSaveProperty = (id: string) => {
      setSavedPropertyIds(prev => {
          const newSaved = prev.includes(id) 
              ? prev.filter(pid => pid !== id)
              : [...prev, id];
          
          localStorage.setItem('savedProperties', JSON.stringify(newSaved));
          return newSaved;
      });
  };

  // Filter properties logic
  const handleSearch = (filters: { location: string; transType: TransactionType }) => {
    let results = properties;
    if (filters.location) {
        results = results.filter(p => p.area === filters.location);
    }
    if (filters.transType) {
        results = results.filter(p => p.transactionType === filters.transType);
    }
    // Always re-sort results by tier
    setFilteredProperties(sortPropertiesByTier(results));
    setView('list');
  };

  // Mock Login logic
  const toggleLogin = () => {
    setUser(prev => ({ ...prev, isLoggedIn: !prev.isLoggedIn }));
  };

  // Create Listing
  const handleCreateListing = (data: any) => {
    const newProperty: Property = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        // Use first uploaded image if available, else random fallback
        imageUrl: (data.images && data.images.length > 0) 
            ? data.images[0] 
            : `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`,
        sellerId: user.id,
        sellerName: user.name,
        sellerContact: "+91 88888 77777"
    };
    
    // Add new property and re-sort the entire list
    const updatedList = sortPropertiesByTier([newProperty, ...properties]);
    
    setProperties(updatedList);
    setFilteredProperties(updatedList);
    setView('list');
    alert("Property Listed Successfully!");
  };

  // Lead Consumption
  const handleUnlockContact = () => {
      if (user.leadCredits > 0) {
          setUser(prev => ({ ...prev, leadCredits: prev.leadCredits - 1 }));
      }
  };

  // Hero Section Toggle
  const handleToggleModule = (module: 'general' | 'property') => {
      setActiveModule(module);
      if (module === 'general') {
          // In a real app, this would route to a different component/page
          alert("Switching to Main General Module (Out of Scope for this demo)");
          setActiveModule('property'); // revert for demo
      }
  };

  // Determine which properties to show based on view
  const displayedProperties = view === 'saved' 
      ? properties.filter(p => savedPropertyIds.includes(p.id)) 
      : filteredProperties;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Overlay */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
             <div 
                className="flex items-center gap-2 font-bold text-xl text-indigo-900 cursor-pointer"
                onClick={() => setView('list')}
             >
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">N</div>
                 NearMePune
             </div>
             
             <div className="flex items-center gap-4">
                 {/* Saved Properties Link */}
                 <button 
                    onClick={() => setView('saved')}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${view === 'saved' ? 'text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg' : 'text-slate-500 hover:text-indigo-600'}`}
                 >
                    <Heart size={18} className={savedPropertyIds.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                    <span className="hidden md:inline">Saved</span>
                    {savedPropertyIds.length > 0 && (
                        <span className="bg-slate-200 text-slate-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {savedPropertyIds.length}
                        </span>
                    )}
                 </button>

                 {user.isLoggedIn ? (
                     <div className="flex items-center gap-4">
                         <div className="hidden md:flex flex-col items-end mr-2">
                             <span className="text-sm font-bold text-slate-700">{user.name}</span>
                             <span className="text-xs text-indigo-600 font-semibold">{user.leadCredits} Credits Left</span>
                         </div>
                         <button 
                             onClick={() => setView('create')}
                             className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
                         >
                             <PlusCircle size={16} /> List Property
                         </button>
                         <button onClick={toggleLogin} className="text-slate-400 hover:text-red-500">
                             <LogOut size={20} />
                         </button>
                     </div>
                 ) : (
                     <button onClick={toggleLogin} className="text-sm font-semibold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg">
                         Log In
                     </button>
                 )}
             </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col min-h-[calc(100vh-64px)]">
         {(view === 'list' || view === 'saved') && (
             <>
                {view === 'list' && (
                    <Hero 
                        onSearch={handleSearch} 
                        activeModule={activeModule}
                        onToggleModule={handleToggleModule}
                    />
                )}
                
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {view === 'saved' ? 'Saved Properties' : `${displayedProperties.length} Properties in Pune`}
                        </h2>
                        {view === 'list' && (
                            /* Simple Sort (Visual only for demo) */
                            <select className="border border-slate-300 rounded-md p-2 text-sm bg-white">
                                <option>Recommended (Tier)</option>
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        )}
                    </div>

                    {view === 'saved' && displayedProperties.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700">No Saved Properties</h3>
                            <p className="text-slate-500 mb-6">Start exploring and save properties you like!</p>
                            <button 
                                onClick={() => setView('list')}
                                className="text-indigo-600 font-medium hover:underline"
                            >
                                Browse Properties
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedProperties.map(property => (
                                <PropertyCard 
                                    key={property.id} 
                                    property={property} 
                                    isSaved={savedPropertyIds.includes(property.id)}
                                    onToggleSave={toggleSaveProperty}
                                    onClick={setSelectedProperty} 
                                />
                            ))}
                        </div>
                    )}

                    {view === 'list' && displayedProperties.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            <p className="text-lg">No properties found matching your criteria.</p>
                            <button 
                                onClick={() => setFilteredProperties(sortPropertiesByTier(properties))}
                                className="mt-4 text-indigo-600 font-medium hover:underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </main>
             </>
         )}

         {view === 'create' && (
             <div className="max-w-7xl mx-auto px-4 w-full">
                 <ListingForm 
                    onCancel={() => setView('list')}
                    onSubmit={handleCreateListing}
                 />
             </div>
         )}
      </div>

      {/* Modals */}
      {selectedProperty && (
          <PropertyDetail 
              property={selectedProperty} 
              user={user}
              isSaved={savedPropertyIds.includes(selectedProperty.id)}
              onToggleSave={toggleSaveProperty}
              onClose={() => setSelectedProperty(null)}
              onUnlockContact={handleUnlockContact}
              onLogin={toggleLogin}
          />
      )}
    </div>
  );
};

export default App;