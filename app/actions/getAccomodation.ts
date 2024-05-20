import prisma from "../lib/db";

export default async function getAccommodation(id: string) {
    try {
        const accommodation = await prisma.accommodation.findUnique({
            where: { id: parseInt(id)},
            include: {
                location: true,
                user: true,
                units:{
                    include:{
                        amenities: {
                            select: {
                                amenity: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
                
            }
        });

        if (accommodation) {
            const safeAccommodation = {
                ...accommodation,
                user : accommodation.user.name + ' ' + accommodation.user.surname,
                country: accommodation.location.country,
                city: accommodation.location.city,
                units: accommodation.units.map(unit => ({
                    ...unit,
                    amenities: unit.amenities.map(a => a.amenity.name)
                }))
            }

            return safeAccommodation;
        }
    } catch (error: any) {
        throw new Error("Couldn't load the listing");
    }
}
