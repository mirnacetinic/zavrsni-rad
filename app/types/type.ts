export interface SafeUser{
    id : number,
    name : string,
    surname : string,
    email : string,
    favourites : number[] | []
    role : string,
    
}

export interface SafeAmenitiy{
    'name': string;
}

export interface safeReservation{
    id: number,
    guest: string,
    unit: number,
    unitTitle : string,
    checkIn: string,
    checkOut: string,
    guests: number,
    status : string
}