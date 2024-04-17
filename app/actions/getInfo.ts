import prisma from "../lib/db";

export default async function getInfo(type:string) {
    let result;

    switch (type) {
        case 'users':
            result = await getUsers();
            break;
        case 'listings':
            result = await getListings();
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

async function getListings() {
    const listings = await prisma.object.findMany( {include: {
        location: true,
        units:true
    }});

    
    const safeListings = listings.map((listing) => ({
        Title: listing.title,
        Description: listing.description,
        Country: listing.location.country,
        City: listing.location.city,
        Units: listing.units.map((unit) => ({
            Title: unit.title,
            Description: unit.description
        }))
    }));

    return safeListings;
    
}

async function getLocations() {
    const locations = await prisma.location.findMany();
    const safeLocations = locations.map((location) => ({
        Country: location.country,
        City: location.city,
        ZIP: location.zip
       
    }));

    return safeLocations;
}
