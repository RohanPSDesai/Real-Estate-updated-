import React, { useState, useEffect } from 'react';
import { Property, User, TransactionType } from '../types';
import { X, MapPin, Bed, Bath, Maximize, Phone, Mail, ShieldCheck, FileText, CheckCircle, Heart, AlertCircle } from 'lucide-react';

interface PropertyDetailProps {
  property: Property;
  user: User;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
  onUnlockContact: () => void;
  onLogin: () => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, user, isSaved, onToggleSave, onClose, onUnlockContact, onLogin }) => {
  const [contactRevealed, setContactRevealed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingSeller, setIsLoadingSeller] = useState(true);

  // Simulate fetching dynamic seller status/details
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoadingSeller(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleContactClick = () => {
    if (!user.isLoggedIn) {
      onLogin();
      return;
    }
    
    // Check if user has credits or is premium
    if (user.isPremium || user.leadCredits > 0) {
      // 1. Trigger deduction in parent
      onUnlockContact();
      
      // 2. Reveal Content
      setContactRevealed(true);
      
      // 3. Show Success Message
      setShowSuccess(true);
    } else {
        // Trigger payment flow / upgrade prompt
        const upgrade = window.confirm("You have exhausted your free leads! Would you like to upgrade to Prime for unlimited access?");
        if (upgrade) {
            // In a real app, redirect to payment gateway
            alert("Redirecting to subscription page...");
        }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn">
        
        {/* Header Actions */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
             <button 
                onClick={() => onToggleSave(property.id)}
                className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow-sm group"
                title={isSaved ? "Remove from Saved" : "Save Property"}
            >
                <Heart size={24} className={`transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600 group-hover:text-red-500'}`} />
            </button>
            <button 
                onClick={onClose}
                className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow-sm"
            >
                <X size={24} className="text-slate-800" />
            </button>
        </div>

        {/* Hero Image */}
        <div className="h-64 md:h-80 w-full relative">
            <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
                <h2 className="text-3xl font-bold text-white mb-2">{property.title}</h2>
                <div className="flex items-center text-white/90">
                    <MapPin size={18} className="mr-2" />
                    {property.address}, {property.area}, {property.city}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Main Content */}
            <div className="md:col-span-2 p-6 md:p-8 space-y-8">
                {/* Stats */}
                <div className="flex flex-wrap gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                        <Maximize className="text-indigo-600" size={24} />
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Area</p>
                            <p className="font-bold text-slate-800">{property.areaSqFt} sqft</p>
                        </div>
                    </div>
                    {property.bedrooms && (
                        <div className="flex items-center gap-2">
                            <Bed className="text-indigo-600" size={24} />
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">Bedrooms</p>
                                <p className="font-bold text-slate-800">{property.bedrooms} BHK</p>
                            </div>
                        </div>
                    )}
                    {property.bathrooms && (
                        <div className="flex items-center gap-2">
                            <Bath className="text-indigo-600" size={24} />
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">Bathrooms</p>
                                <p className="font-bold text-slate-800">{property.bathrooms}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">About this Property</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>

                {/* Amenities */}
                <div>
                     <h3 className="text-xl font-bold text-slate-800 mb-3">Amenities</h3>
                     <div className="flex flex-wrap gap-2">
                         {property.amenities.map(am => (
                             <span key={am} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full font-medium border border-indigo-100">
                                 {am}
                             </span>
                         ))}
                     </div>
                </div>

                {/* Maharashtra Specifics */}
                {(property.sanadStatus || property.sevenTwelveAvailable) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                            <FileText size={20} /> Legal Details (Maharashtra)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {property.sanadStatus && (
                                <div>
                                    <p className="text-sm text-amber-800/70 font-semibold">Sanad Status</p>
                                    <p className="text-amber-900 font-medium">{property.sanadStatus}</p>
                                </div>
                            )}
                            {property.sevenTwelveAvailable && (
                                <div>
                                    <p className="text-sm text-amber-800/70 font-semibold">7/12 Extract</p>
                                    <p className="text-green-700 font-bold flex items-center gap-1">
                                        <CheckCircle size={16} /> Verified Available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar / CTA */}
            <div className="bg-slate-50 border-l border-slate-200 p-6 md:p-8 flex flex-col h-full">
                <div className="mb-6">
                    <p className="text-slate-500 text-sm font-medium">Price</p>
                    <div className="text-3xl font-bold text-indigo-700">
                        ₹{property.price.toLocaleString('en-IN')}
                        {property.transactionType !== TransactionType.SALE && (
                            <span className="text-base font-normal text-slate-500"> / {property.rentalDuration}</span>
                        )}
                    </div>
                    {property.transactionType === TransactionType.RENT && (
                        <div className="mt-2 text-sm text-slate-600 space-y-1">
                            <p>Deposit: ₹{property.securityDeposit || 0}</p>
                            <p>Policy: {property.cancellationPolicy}</p>
                        </div>
                    )}
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 flex-grow">
                    <h4 className="font-bold text-slate-800 mb-4">Seller Information</h4>
                    
                    {isLoadingSeller ? (
                        // Loading Skeleton
                        <div className="animate-pulse space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="h-12 bg-slate-200 rounded-lg w-full"></div>
                                <div className="h-12 bg-slate-200 rounded-lg w-full"></div>
                            </div>
                        </div>
                    ) : (
                        // Loaded Content
                        <>
                            <div className="flex items-center gap-3 mb-4 animate-fadeIn">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                    {property.sellerName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{property.sellerName}</p>
                                    <p className="text-xs text-slate-500">Member since 2023</p>
                                </div>
                            </div>

                            {!contactRevealed ? (
                                <div className="space-y-3 animate-fadeIn">
                                    <div className="relative overflow-hidden rounded-lg bg-slate-100 p-3 blur-[2px] select-none">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Phone size={16} /> +91 99999 XXXXX
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 mt-2">
                                            <Mail size={16} /> xxxxx@example.com
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleContactClick}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck size={20} />
                                        View Contact Details
                                    </button>
                                    {user.isLoggedIn && !user.isPremium && (
                                        <p className="text-xs text-center text-slate-500">
                                            {user.leadCredits} free views remaining
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fadeIn">
                                    {showSuccess && (
                                        <div className="bg-green-50 text-green-800 border border-green-200 p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                                            <CheckCircle size={16} className="text-green-600" />
                                            <span>Contact revealed! 1 Credit deducted.</span>
                                        </div>
                                    )}
                                    
                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                                        <div className="flex items-center gap-2 text-indigo-900 font-bold mb-2">
                                            <Phone size={18} /> {property.sellerContact}
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-700 text-sm">
                                            <Mail size={16} /> Contact via Email
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 text-center">
                                        Please mention NearMePune when calling.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;