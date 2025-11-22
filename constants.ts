import { Property, TransactionType, PropertyCategory, PropertyType, RentalDuration, CancellationPolicy, ListingTier } from './types';

export const PUNE_AREAS = [
  "Koregaon Park",
  "Kalyani Nagar",
  "Viman Nagar",
  "Baner",
  "Aundh",
  "Wakad",
  "Hinjewadi",
  "Kothrud",
  "Magarpatta"
];

export const AMENITIES_LIST = [
  "WiFi",
  "AC",
  "Parking",
  "Gym",
  "Pool",
  "Security",
  "Power Backup",
  "Furnished",
  "Kitchen"
];

export const MOCK_USER = {
  id: "u1",
  name: "Aditya Patil",
  email: "aditya@example.com",
  isLoggedIn: true,
  leadCredits: 10,
  isPremium: false
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Luxury 3BHK with Garden View",
    description: "Spacious apartment in the heart of Koregaon Park. Close to Osho Ashram and German Bakery. Features Italian marble flooring and modular kitchen.",
    transactionType: TransactionType.SALE,
    category: PropertyCategory.RESIDENTIAL,
    type: PropertyType.APARTMENT,
    price: 25000000, // 2.5 Cr
    currency: "INR",
    address: "Lane 5, Koregaon Park",
    city: "Pune",
    area: "Koregaon Park",
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1800,
    sanadStatus: "N.A. Order Received",
    sevenTwelveAvailable: true,
    imageUrl: "https://picsum.photos/800/600?random=1",
    sellerId: "s1",
    sellerName: "Rahul Deshmukh",
    sellerContact: "+91 98765 43210",
    amenities: ["Parking", "Security", "Power Backup", "Gym"],
    cancellationPolicy: CancellationPolicy.STRICT,
    tier: ListingTier.FEATURED
  },
  {
    id: "p2",
    title: "Cozy Studio for Travelers",
    description: "Perfect for backpackers and solo travelers. Located in Viman Nagar near the airport. Daily cleaning included.",
    transactionType: TransactionType.RENT,
    category: PropertyCategory.HOSPITALITY,
    type: PropertyType.PG,
    rentalDuration: RentalDuration.DAILY,
    price: 1200,
    currency: "INR",
    address: "Datta Mandir Chowk, Viman Nagar",
    city: "Pune",
    area: "Viman Nagar",
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 350,
    imageUrl: "https://picsum.photos/800/600?random=2",
    sellerId: "s2",
    sellerName: "Priya Sharma",
    sellerContact: "+91 91234 56789",
    amenities: ["WiFi", "AC", "Furnished"],
    cancellationPolicy: CancellationPolicy.FLEXIBLE,
    securityDeposit: 0,
    tier: ListingTier.PRIME
  },
  {
    id: "p3",
    title: "Corporate Office Space IT Park",
    description: "Fully furnished office space suitable for IT startups. 50 workstations, 2 cabins, and a conference room.",
    transactionType: TransactionType.LEASE,
    category: PropertyCategory.COMMERCIAL,
    type: PropertyType.OFFICE,
    rentalDuration: RentalDuration.MONTHLY,
    price: 150000,
    currency: "INR",
    address: "Phase 1, Hinjewadi",
    city: "Pune",
    area: "Hinjewadi",
    areaSqFt: 2500,
    imageUrl: "https://picsum.photos/800/600?random=3",
    sellerId: "s3",
    sellerName: "TechSpace Realty",
    sellerContact: "+91 99887 76655",
    amenities: ["AC", "Security", "Power Backup", "Parking", "WiFi"],
    cancellationPolicy: CancellationPolicy.MODERATE,
    securityDeposit: 500000,
    tier: ListingTier.FREE
  }
];