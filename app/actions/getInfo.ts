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
        if (searchParams.guests && parseInt(searchParams.guests)<1) {
            throw new Error("Minimal number of guests is 1!")
        //     where['guests'] = searchParams.guests;
        }
    }

    const accommodations = await prisma.accommodation.findMany({
        where,
        include: { location: true, amenities: { include: { amenity: true } } },
    });

    const safeaccommodations = accommodations.map((accommodation) => ({
        id: accommodation.id,
        title: accommodation.title,
        description: accommodation.description,
        type: accommodation.type,
        country: accommodation.location.country,
        city: accommodation.location.city,
        amenities: accommodation.amenities.map(amenity => amenity.amenity?.name),
    }));

    return safeaccommodations;
}


export async function getLocations() {
    const locations = await prisma.location.findMany();
    const safeLocations = locations.map((location) => ({
        country: location.country,
        city: location.city,
        zip: location.zip
       
    }));

    return safeLocations;
}
