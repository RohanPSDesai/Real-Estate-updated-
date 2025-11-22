import React, { useState } from 'react';
import { Bed, Bath, Maximize, MapPin, IndianRupee, Crown, ShieldCheck, Image as ImageIcon, Heart } from 'lucide-react';
import { Property, TransactionType, ListingTier } from '../types';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClick: (p: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSaved, onToggleSave, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `${(price / 100000).toFixed(2)} Lac`;
    return price.toLocaleString('en-IN');
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(property.id);
  };

  return (
    <div 
      onClick={() => onClick(property)}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border overflow-hidden cursor-pointer relative ${property.tier === ListingTier.FEATURED ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-100'}`}
    >
      {/* Tier Badges */}
      {property.tier === ListingTier.FEATURED && (
        <div className="absolute top-4 right-4 z-20 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <Crown size={12} className="fill-current" /> FEATURED
        </div>
      )}
      {property.tier === ListingTier.PRIME && (
        <div className="absolute top-4 right-4 z-20 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <ShieldCheck size={12} /> PRIME
        </div>
      )}

      <div className="relative h-48 overflow-hidden bg-slate-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 animate-pulse">
            <ImageIcon size={48} />
          </div>
        )}
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Favorite Button Overlay - Added z-30 to ensure it's above image but below modal overlays if any */}
        <button 
            onClick={handleSaveClick}
            className="absolute top-4 left-4 z-30 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110 group/heart"
            title={isSaved ? "Remove from Saved" : "Save Property"}
        >
            <Heart 
              size={18} 
              className={`transition-colors duration-300 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600 group-hover/heart:text-red-500'}`} 
            />
        </button>

        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            property.transactionType === TransactionType.SALE ? 'bg-blue-600 text-white' : 
            property.transactionType === TransactionType.RENT ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'
          }`}>
            {property.transactionType}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-slate-700">
           {property.category}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{property.title}</h3>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{property.area}, {property.city}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-slate-600 text-sm">
           {property.bedrooms && (
             <div className="flex items-center gap-1">
               <Bed size={16} /> <span>{property.bedrooms} Beds</span>
             </div>
           )}
           {property.bathrooms && (
             <div className="flex items-center gap-1">
               <Bath size={16} /> <span>{property.bathrooms} Baths</span>
             </div>
           )}
           <div className="flex items-center gap-1">
             <Maximize size={16} /> <span>{property.areaSqFt} sqft</span>
           </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center text-indigo-700 font-bold text-lg">
             <IndianRupee size={18} />
             {formatPrice(property.price)}
             {property.transactionType !== TransactionType.SALE && (
               <span className="text-xs font-normal text-slate-500 ml-1">/ {property.rentalDuration}</span>
             )}
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;