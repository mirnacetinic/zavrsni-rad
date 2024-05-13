import prisma from "../lib/db";

export  async function getUsers() {
    const users = await prisma.user.findMany();
    const safeUsers = users.map((user) => ({
        name: user.name,
        surname: user.surname,
        email: user.email,
        role : user.role,
    }));

    return safeUsers;
    
}

export async function getAmenities(){
    const amenities = (await prisma.amenity.findMany());
    return amenities;
}

export async function getUnits(){
    const units = await prisma.unit.findMany();
    return units;
}

export async function getAccommodationUnits(accommodationId:string) {
    const units = prisma.unit.findMany({
        where: { accommodationId : parseInt(accommodationId)},
        include:{ 
            amenities : true
        }
        });

        return units; 
}

export async function getAccommodations(searchParams?: { whereTo?: string; checkIn?: string; checkOut?:string; guests?:string }) {
    const where: any = {};
    if (searchParams) {
        
        if (searchParams.whereTo) {
            where['location'] = { city: {contains : searchParams.whereTo, mode:'insensitive'} };
        }
        //if (searchParams.checkIn) {
        //     where['checkIn'] = checkIn;
        //}
        // if (serachParams.checkOut) {
        //     where['checkOut'] = checkOut;
        // }
        if (searchParams.guests) {
            if(parseInt(searchParams.guests) >= 1)
                where['units'] = { some: { capacity: { gte: parseInt(searchParams.guests) } } }; 
            else{
                throw new Error("Minimal number of guests is 1!");
            }
        }

    }

    const accommodations = await prisma.accommodation.findMany({
        where,
        include: { location: true}});

    const safeaccommodations = accommodations.map((accommodation) => ({
        id: accommodation.id,
        title: accommodation.title,
        description: accommodation.description,
        type: accommodation.type,
        country: accommodation.location.country,
        city: accommodation.location.city,
        imageUrl : accommodation.imageUrl
    }));

    return safeaccommodations;
}

export async function getHostAccommodation(id:number){
    const accommodations = await prisma.accommodation.findMany({
        where: { userId : id },
        include: { location: true },
    });

    const safeAccommodations = accommodations.map((accommodation) => ({
        title: accommodation.title,
        description: accommodation.description,
        type: accommodation.type,
        country: accommodation.location.country,
        city: accommodation.location.city
    }));

    return safeAccommodations;

}

export async function getLocations() {
    const locations = await prisma.location.findMany();
    return locations;
}

export async function getReservations() {
    const reservations = await prisma.reservation.findMany();

    const safeReservations = reservations.map((reservation)=>({
        id : reservation.id,
        user : reservation.userId,
        unit : reservation.unitId,
        checkIn: reservation.checkIn.toDateString(),
        checkOut : reservation.checkOut.toDateString(),
        guests : reservation.guests

    }))
    return safeReservations;
}
