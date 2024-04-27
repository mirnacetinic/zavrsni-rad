import prisma from "../lib/db";

export default async function getInfo(type:string,searchParams?: { whereTo?: string; checkIn?: string; checkOut?:string; guests?:string }) {
    let result;

    switch (type) {
        case 'users':
            result = await getUsers();
            break;
        case 'objects':
            result = await getObjects(searchParams);
            break;
        case 'locations':
            result = await getLocations();
            break;
        default:
            throw new Error('Invalid type provided');
    }

    return result;
}

async function getUsers() {
    const users = await prisma.user.findMany();
    const safeUsers = users.map((user) => ({
        name: user.name,
        surname: user.surname,
        email: user.email,
    }));

    return safeUsers;
    
}

async function getObjects(searchParams?: { whereTo?: string; checkIn?: string; checkOut?:string; guests?:string }) {
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

    const objects = await prisma.object.findMany({
        where,
        include: { location: true, units: true, amenities: { include: { amenity: true } } }
    });

    const safeObjects = objects.map((listing) => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        type: listing.type,
        country: listing.location.country,
        city: listing.location.city,
        units: listing.units.map((unit) => ({
            unitTitle: unit.title,
            unitDescription: unit.description
        })),
        amenities: listing.amenities.map(amenity => amenity.amenity),
    }));

    return safeObjects;
}


async function getLocations() {
    const locations = await prisma.location.findMany();
    const safeLocations = locations.map((location) => ({
        country: location.country,
        city: location.city,
        ZIP: location.zip
       
    }));

    return safeLocations;
}
