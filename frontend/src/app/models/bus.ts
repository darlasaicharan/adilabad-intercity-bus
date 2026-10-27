/**
 * TypeScript Data Models for Adilabad Intercity Bus Information Service
 */

export interface Bus {
  id: string;
  busName: string;
  busType: string;
  startingCity: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  journeyDuration: string;
  fare: number;
  availableSeats: number;
  totalSeats: number;
  route: string;
  boardingPoints?: string[];
  droppingPoints?: string[];
  amenities?: string[];
  frequency?: string;
  operator?: string;
  viaRoute?: string;
}

export interface SearchQuery {
  from: string;
  to: string;
  date?: string;
}

export interface SearchResponse {
  success: boolean;
  from?: string;
  to?: string;
  date?: string | null;
  totalResults: number;
  buses: Bus[];
  message?: string;
}

export interface SingleBusResponse {
  success: boolean;
  bus: Bus;
  message?: string;
}

export interface CitiesResponse {
  success: boolean;
  count: number;
  cities: string[];
  message?: string;
}
