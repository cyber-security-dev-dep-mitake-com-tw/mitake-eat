export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  priceLevel: 0 | 1 | 2 | 3 | 4;
  types: string[];
  website?: string;
  reservationUrl?: string;
  phone?: string;
  photoUrl?: string;
  distance?: number;
  openingHours?: string[];
}

export interface SearchParams {
  lat: number;
  lng: number;
  radius: number;
  budgetPerPerson?: number;
  totalBudget?: number;
  participants: number;
  budgetMode: "total" | "per_person";
  foodTypes: string[];
  dateTime?: string;
  targetCount: number;
}

export interface FilterState {
  maxPriceLevel: number;
  minRating: number;
  maxDistance?: number;
  selectedFoodTypes: string[];
}

export type SortOption = "rating_desc" | "rating_asc" | "distance" | "price_asc" | "price_desc";

export interface DemoRestaurant extends Restaurant {
  isDemo: true;
}
