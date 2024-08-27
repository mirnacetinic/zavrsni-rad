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
                            where:{ review: {isNot: null}},
                            select:{
                                review: {
                                    select:{
                                        rating:true,
                                        hostRating:true,
                                        experience:true,
                                        createdAt: true,
                                        reservation:{
                                            select:{
                                                unit:{
                                                    select:{
                                                        title:true,
                                                    }
                                                }
                                            }
                                        }
                                    }
                                
                                }
                            },
                            orderBy:{
                                review:{
                                    createdAt: 'desc'
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
                ownerEmail : accommodation.user.email,
                country: accommodation.location.country,
                city: accommodation.location.city,
                rating : avgRating._avg.rating,
                reviews: accommodation.units?.flatMap(unit => 
                    unit.reservations.flatMap(reservation => {
                        const review = reservation?.review;
                        return review ? {
                            rating: review.rating,
                            hostRating: review.hostRating,
                            experience: review.experience,
                            unit: review.reservation?.unit?.title ?? null
                        } : null;
                    })
                ).filter(review => review != null) as {
                    rating: number | null;
                    hostRating: number | null;
                    experience: string | null;
                    unit: string | null;
                }[]
            }

            return safeAccommodation;
        }
       
        return null;
    } catch (error: any) {
        throw new Error("Couldn't load the listing");
    }
}
