import React, { useState, useRef } from 'react';
import { TransactionType, PropertyCategory, PropertyType, RentalDuration, CancellationPolicy, ListingTier } from '../types';
import { PUNE_AREAS, AMENITIES_LIST } from '../constants';
import { Sparkles, Loader2, Save, Upload, X, Image as ImageIcon, ChevronLeft, ChevronRight, Crown, ShieldCheck, CheckCircle } from 'lucide-react';
import { generatePropertyDescription } from '../services/geminiService';

interface ListingFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ onCancel, onSubmit }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
     title: '',
     description: '',
     transactionType: TransactionType.SALE,
     category: PropertyCategory.RESIDENTIAL,
     type: PropertyType.APARTMENT,
     price: '',
     rentalDuration: RentalDuration.MONTHLY,
     address: '',
     area: '',
     city: 'Pune',
     bedrooms: '2',
     bathrooms: '2',
     areaSqFt: '',
     sanadStatus: '',
     sevenTwelveNumber: '',
     amenities: [] as string[],
     cancellationPolicy: CancellationPolicy.MODERATE,
     securityDeposit: '',
     images: [] as string[],
     tier: ListingTier.FREE
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
      setFormData(prev => {
          const current = prev.amenities;
          if (current.includes(amenity)) {
              return { ...prev, amenities: current.filter(a => a !== amenity) };
          } else {
              return { ...prev, amenities: [...current, amenity] };
          }
      });
  };

  const handleAiGenerate = async () => {
      if (!formData.type || !formData.area) {
          alert("Please fill in Property Type and Area first.");
          return;
      }
      setLoadingAi(true);
      const desc = await generatePropertyDescription(formData);
      setFormData(prev => ({ ...prev, description: desc }));
      setLoadingAi(false);
  };

  // --- Image Upload Handlers ---
  const handleFiles = (files: FileList) => {
      Array.from(files).forEach(file => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, e.target!.result as string]
                    }));
                }
            };
            reader.readAsDataURL(file);
          }
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          handleFiles(e.target.files);
      }
  };

  const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
      } else if (e.type === "dragleave") {
          setDragActive(false);
      }
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFiles(e.dataTransfer.files);
      }
  };

  const removeImage = (index: number) => {
      setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
      const newImages = [...formData.images];
      if (direction === 'left' && index > 0) {
          [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      } else if (direction === 'right' && index < newImages.length - 1) {
          [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
      }
      setFormData(prev => ({ ...prev, images: newImages }));
  };
  // -----------------------------

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation
      if (!formData.title || !formData.price) {
          alert("Please fill required fields");
          return;
      }

      setIsSubmitting(true);

      // Simulate Payment Process for Paid Tiers
      if (formData.tier !== ListingTier.FREE) {
          // In a real app, this is where Stripe/Razorpay logic would trigger
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay for "payment"
      } else {
          // Minimal delay for free tier for better UX feeling
          await new Promise(resolve => setTimeout(resolve, 500));
      }

      onSubmit(formData);
      setIsSubmitting(false);
  };

  return (
    <div className="bg-white max-w-4xl mx-auto rounded-xl shadow-xl overflow-hidden my-8 border border-slate-200">
       <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
           <div>
            <h2 className="text-2xl font-bold">List Your Property</h2>
            <p className="text-indigo-200">Reach thousands of buyers in Pune instantly.</p>
           </div>
           <button onClick={onCancel} className="text-indigo-200 hover:text-white">Cancel</button>
       </div>

       <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
           
           {/* Section 1: Basic Transaction Info */}
           <div className="space-y-4">
               <h3 className="text-lg font-bold text-slate-800 border-b pb-2">1. Transaction Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">I want to</label>
                       <div className="flex bg-slate-100 p-1 rounded-lg">
                           <button 
                             type="button"
                             onClick={() => setFormData(prev => ({ ...prev, transactionType: TransactionType.SALE }))}
                             className={`flex-1 py-2 text-sm font-medium rounded-md ${formData.transactionType === TransactionType.SALE ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}
                           >
                            Sell
                           </button>
                           <button 
                             type="button"
                             onClick={() => setFormData(prev => ({ ...prev, transactionType: TransactionType.RENT }))}
                             className={`flex-1 py-2 text-sm font-medium rounded-md ${formData.transactionType === TransactionType.RENT ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}
                           >
                            Rent/Lease
                           </button>
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Property Category</label>
                       <select 
                         name="category" 
                         value={formData.category} 
                         onChange={handleInputChange}
                         className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                           {Object.values(PropertyCategory).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                   </div>

                   <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                       <select 
                         name="type" 
                         value={formData.type} 
                         onChange={handleInputChange}
                         className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                           {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                   </div>
               </div>
           </div>

           {/* Section 2: Location & Specs */}
           <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">2. Location & Specs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Area / Locality</label>
                        <select 
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                        >
                            <option value="">Select Area in Pune</option>
                            {PUNE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Exact Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleInputChange}
                            placeholder="Building Name, Street"
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none" 
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">BHK</label>
                             <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Baths</label>
                             <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Area (sq ft)</label>
                             <input type="number" name="areaSqFt" value={formData.areaSqFt} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                </div>
           </div>

           {/* Section 3: Legal & Local (Maharashtra Context) */}
           <div className="space-y-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-lg font-bold text-amber-900 border-b border-amber-200 pb-2">3. Legal Details (Important)</h3>
                <p className="text-xs text-amber-700">Providing these details increases trust score by 40%.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sanad / NA Status</label>
                        <input 
                            type="text" 
                            name="sanadStatus" 
                            value={formData.sanadStatus} 
                            onChange={handleInputChange}
                            placeholder="e.g. NA Order Received / Gaothan"
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">7/12 Extract Number (Optional)</label>
                        <input 
                            type="text" 
                            name="sevenTwelveNumber" 
                            value={formData.sevenTwelveNumber} 
                            onChange={handleInputChange}
                            placeholder="Survey No / Hissa No"
                            className="w-full p-2 border border-slate-300 rounded-lg outline-none" 
                        />
                    </div>
                </div>
           </div>

           {/* Section 4: Pricing & Policies */}
           <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">4. Pricing & Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price (INR)</label>
                        <input 
                            type="number" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleInputChange}
                            className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-800 outline-none" 
                        />
                    </div>
                    {formData.transactionType === TransactionType.RENT && (
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Rental Frequency</label>
                             <select name="rentalDuration" value={formData.rentalDuration} onChange={handleInputChange} className="w-full p-2 border rounded-lg">
                                 {Object.values(RentalDuration).map(d => <option key={d} value={d}>{d}</option>)}
                             </select>
                        </div>
                    )}
                </div>
                {formData.transactionType === TransactionType.RENT && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Security Deposit</label>
                            <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Cancellation Policy</label>
                             <select name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleInputChange} className="w-full p-2 border rounded-lg">
                                 {Object.values(CancellationPolicy).map(p => <option key={p} value={p}>{p}</option>)}
                             </select>
                        </div>
                    </div>
                )}
           </div>

           {/* Section 5: Photos */}
           <div className="space-y-4">
                <div className="flex justify-between items-end border-b pb-2">
                    <h3 className="text-lg font-bold text-slate-800">5. Property Photos</h3>
                    <span className="text-sm text-slate-500">{formData.images.length} Photos Uploaded</span>
                </div>
                
                <div 
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="bg-indigo-100 p-3 rounded-full mb-3">
                        <Upload className="text-indigo-600" size={24} />
                    </div>
                    <p className="text-slate-700 font-medium mb-1">Drag & drop photos here</p>
                    <p className="text-slate-500 text-sm mb-4">or click to browse from your device</p>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden" 
                    />
                    <button 
                        type="button"
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors pointer-events-none"
                    >
                        Select Files
                    </button>
                </div>

                {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                     {index > 0 && (
                                         <button type="button" onClick={(e) => { e.stopPropagation(); moveImage(index, 'left'); }} className="p-1 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-sm" title="Move Left">
                                             <ChevronLeft size={16} />
                                         </button>
                                     )}
                                     <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm" title="Remove">
                                         <X size={16} />
                                     </button>
                                     {index < formData.images.length - 1 && (
                                         <button type="button" onClick={(e) => { e.stopPropagation(); moveImage(index, 'right'); }} className="p-1 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-sm" title="Move Right">
                                             <ChevronRight size={16} />
                                         </button>
                                     )}
                                </div>
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm flex items-center gap-1">
                                        <ImageIcon size={12} /> Cover
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
           </div>

           {/* Section 6: Description with AI */}
           <div className="space-y-4">
                <div className="flex justify-between items-end border-b pb-2">
                    <h3 className="text-lg font-bold text-slate-800">6. Description</h3>
                    <button 
                        type="button" 
                        onClick={handleAiGenerate}
                        disabled={loadingAi}
                        className="flex items-center gap-2 text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                        {loadingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Auto-Write with AI
                    </button>
                </div>
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    placeholder="Headline (e.g., Spacious 3BHK in Baner)"
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold" 
                />
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your property..."
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none" 
                />
           </div>

           {/* Section 7: Amenities */}
           <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">7. Amenities</h3>
                <div className="flex flex-wrap gap-3">
                    {AMENITIES_LIST.map(amenity => (
                        <button
                            key={amenity}
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className={`px-4 py-2 rounded-full text-sm border transition-colors ${formData.amenities.includes(amenity) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>
           </div>

           {/* Section 8: Tier Selection */}
           <div className="space-y-4">
               <h3 className="text-lg font-bold text-slate-800 border-b pb-2">8. Select Listing Tier</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* Free Tier */}
                   <div 
                      onClick={() => setFormData(prev => ({ ...prev, tier: ListingTier.FREE }))}
                      className={`cursor-pointer border rounded-xl p-5 transition-all ${formData.tier === ListingTier.FREE ? 'border-slate-600 ring-2 ring-slate-100 bg-slate-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                   >
                       <div className="flex justify-between items-start mb-3">
                           <span className="font-bold text-slate-700">Free</span>
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.tier === ListingTier.FREE ? 'border-slate-600 bg-slate-600 text-white' : 'border-slate-300'}`}>
                               {formData.tier === ListingTier.FREE && <CheckCircle size={12} />}
                           </div>
                       </div>
                       <div className="text-2xl font-bold text-slate-900 mb-2">₹0</div>
                       <ul className="text-sm text-slate-600 space-y-2">
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Standard Visibility</li>
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Basic Support</li>
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Listed for 30 days</li>
                       </ul>
                   </div>

                   {/* Prime Tier */}
                   <div 
                      onClick={() => setFormData(prev => ({ ...prev, tier: ListingTier.PRIME }))}
                      className={`cursor-pointer border rounded-xl p-5 transition-all ${formData.tier === ListingTier.PRIME ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                   >
                       <div className="flex justify-between items-start mb-3">
                           <span className="font-bold text-indigo-700 flex items-center gap-1"><ShieldCheck size={16} /> Prime</span>
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.tier === ListingTier.PRIME ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                               {formData.tier === ListingTier.PRIME && <CheckCircle size={12} />}
                           </div>
                       </div>
                       <div className="text-2xl font-bold text-slate-900 mb-2">₹499</div>
                       <ul className="text-sm text-slate-600 space-y-2">
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> 2x Visibility</li>
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> 'Prime' Badge</li>
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Verified Seller Tag</li>
                       </ul>
                   </div>

                   {/* Featured Tier */}
                   <div 
                      onClick={() => setFormData(prev => ({ ...prev, tier: ListingTier.FEATURED }))}
                      className={`cursor-pointer border rounded-xl p-5 transition-all relative overflow-hidden ${formData.tier === ListingTier.FEATURED ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                   >
                       {formData.tier === ListingTier.FEATURED && (
                           <div className="absolute top-0 right-0 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                       )}
                       <div className="flex justify-between items-start mb-3">
                           <span className="font-bold text-amber-600 flex items-center gap-1"><Crown size={16} /> Featured</span>
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.tier === ListingTier.FEATURED ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300'}`}>
                               {formData.tier === ListingTier.FEATURED && <CheckCircle size={12} />}
                           </div>
                       </div>
                       <div className="text-2xl font-bold text-slate-900 mb-2">₹999</div>
                       <ul className="text-sm text-slate-600 space-y-2">
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Top of Search</li>
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> 'Featured' Badge</li>
                           <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> 10x Leads Guaranteed</li>
                       </ul>
                   </div>
               </div>
           </div>

           <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
               <button type="button" disabled={isSubmitting} onClick={onCancel} className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button>
               <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                   {isSubmitting ? (
                       <>
                         <Loader2 size={18} className="animate-spin" />
                         {formData.tier === ListingTier.FREE ? 'Publishing...' : 'Processing Payment...'}
                       </>
                   ) : (
                       <>
                         {formData.tier === ListingTier.FREE ? <Save size={18} /> : <Crown size={18} />}
                         {formData.tier === ListingTier.FREE ? 'Publish Listing' : `Pay ₹${formData.tier === ListingTier.PRIME ? '499' : '999'} & Publish`}
                       </>
                   )}
               </button>
           </div>

       </form>
    </div>
  );
};

export default ListingForm;