import prisma from "../lib/db";

export  async function getUsers() {
    const users = await prisma.user.findMany();
    const safeUsers = users.map((user) => ({
        name: user.name,
        surname: user.surname,
        email: user.email,
    }));

    return safeUsers;
    
}

export async function getAccomodations(searchParams?: { whereTo?: string; checkIn?: string; checkOut?:string; guests?:string }) {
    const where: any = {};

    if (searchParams) {
        

        if (searchParams.whereTo) {
            where['location'] = { city: searchParams.whereTo };
        }
        // if (checkIn) {
        //     where['checkIn'] = checkIn;
        // }
        // if (checkOut) {
        //     where['checkOut'] = checkOut;
        // }
        // if (searchParams.guests) {
        //     where['guests'] = searchParams.guests;
        // }
    }

    const accomodations = await prisma.accomodation.findMany({
        where,
        include: { location: true, units: true, amenities: { include: { amenity: true } } }
    });

    const safeaccomodations = accomodations.map((accomodation) => ({
        id: accomodation.id,
        title: accomodation.title,
        description: accomodation.description,
        type: accomodation.type,
        country: accomodation.location.country,
        city: accomodation.location.city,
        units: accomodation.units.map((unit) => ({
            unitTitle: unit.title,
            unitDescription: unit.description
        })),
        amenities: accomodation.amenities.map(amenity => amenity.amenity),
    }));

    return safeaccomodations;
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
