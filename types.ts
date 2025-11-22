export enum TransactionType {
  SALE = 'SALE',
  RENT = 'RENT',
  LEASE = 'LEASE'
}

export enum PropertyCategory {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  HOSPITALITY = 'HOSPITALITY'
}

export enum PropertyType {
  APARTMENT = 'Apartment',
  VILLA = 'Villa',
  PG = 'PG',
  HOSTEL = 'Hostel',
  HOTEL = 'Hotel',
  OFFICE = 'Office',
  SHOP = 'Shop'
}

export enum RentalDuration {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}

export enum CancellationPolicy {
  FLEXIBLE = 'Flexible',
  MODERATE = 'Moderate',
  STRICT = 'Strict'
}

export enum ListingTier {
  FREE = 'Free',
  PRIME = 'Prime',
  FEATURED = 'Featured'
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  leadCredits: number;
  isPremium: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  transactionType: TransactionType;
  category: PropertyCategory;
  type: PropertyType;
  price: number;
  currency: string;
  rentalDuration?: RentalDuration; // Only for Rent
  
  // Location
  address: string;
  city: string;
  area: string;
  
  // Specs
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt: number;
  
  // Maharashtra Specifics
  sanadStatus?: string; // N.A., Gaothan, etc.
  sevenTwelveAvailable?: boolean;

  // Media
  imageUrl: string;
  
  // Seller Info
  sellerId: string;
  sellerName: string;
  sellerContact: string; // Hidden by default

  // Amenities
  amenities: string[];
  
  // Policies (Airbnb style)
  cancellationPolicy?: CancellationPolicy;
  securityDeposit?: number;

  // Tier
  tier: ListingTier;
}