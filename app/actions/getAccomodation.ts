import prisma from "../lib/db";

export default async function getAccommodation(id: string) {
    try {
        const accommodation = await prisma.accommodation.findUnique({
            where: { id: parseInt(id)},
            include: {
                location: true,
                user: true,
                units:{
                    select:{
                        reservations:{
                            select:{
                                review:{
                                    select:{
                                        experience:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (accommodation) {
            const avgRating = await prisma.review.aggregate({
                where:{
                    reservation:{
                        unit:{
                            accommodationId:accommodation.id
                        }
                        
                    }
                },
                _avg:{
                    rating:true
                }
            })

            const safeAccommodation = {
                ...accommodation,
                user : accommodation.user.name + ' ' + accommodation.user.surname,
                country: accommodation.location.country,
                city: accommodation.location.city,
                rating : avgRating._avg.rating,
                reviews : accommodation.units?.flatMap(u=>u.reservations?.flatMap(r=>r.review?.experience).filter(e=>e!==undefined))
            }

            return safeAccommodation;
        }
       
        return null;
    } catch (error: any) {
        throw new Error("Couldn't load the listing");
    }
}
