import React, { useState } from 'react';
import { Search, MapPin, Building2, Home } from 'lucide-react';
import { TransactionType, PropertyType } from '../types';
import { PUNE_AREAS } from '../constants';

interface HeroProps {
  onSearch: (filters: any) => void;
  activeModule: 'general' | 'property';
  onToggleModule: (module: 'general' | 'property') => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch, activeModule, onToggleModule }) => {
  const [location, setLocation] = useState('');
  const [transType, setTransType] = useState<TransactionType>(TransactionType.SALE);
  
  const handleSearch = () => {
    onSearch({ location, transType });
  };

  return (
    <div className="relative bg-indigo-900 text-white pb-20 pt-10 px-4 md:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
         <img src="https://picsum.photos/1920/600?blur=4" alt="Pune Skyline" className="object-cover w-full h-full" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="flex justify-between items-center mb-12">
           <h1 className="text-2xl font-bold tracking-tight">NearMePune.com</h1>
           {/* Context Toggle */}
           <div className="bg-indigo-950/50 p-1 rounded-lg flex items-center border border-indigo-700 backdrop-blur-sm">
              <button 
                onClick={() => onToggleModule('general')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeModule === 'general' ? 'bg-indigo-500 text-white shadow-lg' : 'text-indigo-300 hover:text-white'}`}
              >
                Explore Pune
              </button>
              <button 
                onClick={() => onToggleModule('property')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeModule === 'property' ? 'bg-indigo-500 text-white shadow-lg' : 'text-indigo-300 hover:text-white'}`}
              >
                <Home size={16} />
                Properties
              </button>
           </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            {activeModule === 'property' ? 'Find Your Dream Space in Pune' : 'Discover the Best of Pune'}
          </h2>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            {activeModule === 'property' 
              ? 'Buy, Rent, or Lease properties with trusted sellers and verified listings across Maharashtra.'
              : 'Restaurants, Events, Jobs and Local Services at your fingertips.'}
          </p>
        </div>

        {activeModule === 'property' && (
          <div className="bg-white rounded-xl shadow-2xl p-4 max-w-4xl mx-auto text-slate-800">
             <div className="flex flex-wrap gap-4 mb-4 border-b border-slate-100 pb-4">
                <button 
                  onClick={() => setTransType(TransactionType.SALE)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${transType === TransactionType.SALE ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                >
                  Buy
                </button>
                <button 
                   onClick={() => setTransType(TransactionType.RENT)}
                   className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${transType === TransactionType.RENT ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                >
                  Rent
                </button>
                <button 
                   onClick={() => setTransType(TransactionType.LEASE)}
                   className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${transType === TransactionType.LEASE ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                >
                  Commercial Lease
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5 relative">
                  <MapPin className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option value="">Select Location</option>
                    {PUNE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                  </select>
                </div>
                <div className="md:col-span-5 relative">
                  <Building2 className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none">
                     <option>Property Type (Any)</option>
                     {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                   <button 
                    onClick={handleSearch}
                    className="w-full h-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                   >
                     <Search size={20} />
                     Search
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
