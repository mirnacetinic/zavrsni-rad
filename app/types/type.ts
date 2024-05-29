export type SafeUser = {
    id : number,
    name : string,
    surname : string,
    email : string,
    favourites : number[] | []
    role : string,
    status : string
    
}

export type AccommodationType = "House" | "Villa" | "Apartment" | "Room";
export type ActiveStatus = "Active" | "Suspended" | "Inactive";

export interface Location {
  id: number;
  country: string;
  city: string;
  zip: string;
}

export interface Accommodation {
  id: number;
  title: string;
  type: AccommodationType;
  status: ActiveStatus;
  description: string;
  location: Location;
  address: string;
  user: string;
  imageUrl: string | null;
}

export interface Unit {
  id: number;
  title: string;
  type: AccommodationType;
  description: string;
  capacity: number;
  images: string[];
  amenities: string[];
}

export interface SafeAmenitiy{
    'name': string;
}

export interface safeReservation{
    id: number,
    guest: string,
    unit: number,
    unitTitle : string,
    accommodation : number,
    checkIn: string,
    checkOut: string,
    guests: number,
    status : string,
    price : number,
    review : number | undefined
}