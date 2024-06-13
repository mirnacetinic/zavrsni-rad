import prisma from "../lib/db";

export async function getDashReviews(status?:string){
  let where: any = {};
  if(status) where.status = status;
  const reviews = await prisma.review.findMany({
    where
  })

  const safeReviews = reviews.map(r=>({
    id : r.reservationId,
    rating : r.rating,
    hostRating : r.hostRating,
    experience: r.experience
  }))

  return safeReviews;
}
export async function getDashReservations() {
   
    const reservations = await prisma.reservation.findMany(
      { 
        include:{
        user : {select:{ name:true, surname:true}},
        review: {
          select:{
            hostRating : true,
            rating:true,
            experience: true,
          }
        },
        unit : {
          select:{
            title:true,
            type: true,
            accommodation:{
              select:{
                id: true,
                location:{
                  select:{
                    city: true,
                  }
                }
  
              }
              
            }
          }
        }
      }}
    );
  
    const safeReservations = reservations.map((reservation) => ({
      id: reservation.id,
      guest: reservation.user.name + ' ' + reservation.user.surname,
      userId : reservation.userId,
      unit: reservation.unitId,
      unitTitle : reservation.unit.type + ' ' + reservation.unit.title,
      accommodation : reservation.unit.accommodation.id,
      city : reservation.unit.accommodation.location.city,
      checkIn: reservation.checkIn.toDateString(),
      checkOut: reservation.checkOut.toDateString(),
      guests: reservation.guests,
      status : reservation.status,
      price : reservation.price,
      paymentId : reservation.paymentId,
      wasInquiry : reservation.wasInquiry,
      review : reservation.review || "None"
    }));
  
    return safeReservations;
  }

  export async function getBoardReservations(host : number) {
    const where : any = {};
    if(host){
      where.unit = {
          accommodation: {
            userId: host,
          },
      };
    }
  
    const reservations = await prisma.reservation.findMany(
      { where,
        include:{
        user : {
          select:{
            name:true,
            surname:true
          }},
        review: {
          select:{
            status : true,
            rating:true,
            hostRating: true,
            experience: true,
          }
        },
        unit : {
          select:{
            title:true,
            type: true,
            accommodation:{
              select:{
                title : true,
                type : true,
              }
            }
          }
        }
      }, orderBy:{
        checkIn : 'desc'
      }}
    );
  
    const safeReservations = reservations.map((reservation) => ({
      id: reservation.id,
      guest: reservation.user.name + ' ' + reservation.user.surname,
      unit : reservation.unit.type + ' ' + reservation.unit.title,
      accommodation : reservation.unit.accommodation.type + ' ' + reservation.unit.title,
      checkIn: reservation.checkIn.toDateString(),
      checkOut: reservation.checkOut.toDateString(),
      guests: reservation.guests,
      status : reservation.status,
      wasInquiry : reservation.wasInquiry,
      revenue : reservation.price,
      review : reservation.review? {
          rating: reservation.review.rating,
          hostRating: reservation.review.hostRating,
          experience: reservation.review.experience,
          status: reservation.review.status ?? 'None',
        } : 'None',
      guestRating : reservation.guestReview || 'None',
      past : reservation.checkIn > new Date()? false : true
    }));
  
    return safeReservations;
  }
  

  export async function getDashUsers() {
    const users = await prisma.user.findMany({
        include: {
            accommodations: {
                select: {
                    type: true,
                    title: true,
                    units: {
                        select: {
                            title: true,
                            type: true,
                            reservations: {
                                select: {
                                    checkIn: true,
                                    checkOut: true,
                                    price: true,
                                    review:{
                                      select:{
                                        hostRating:true,
                                      }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            reservations: {
                select: {
                    checkIn: true,
                    checkOut: true,
                    price: true,
                    guestReview: true,
                    review:{
                      select:{
                        hostRating: true,
                        rating:true,
                        experience:true,
                        reservationId:true,
                      }

                    },
                    unit: {
                        select: {
                            title: true,
                            type: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const safeUsers = users.map((user) => {
        const hostedReservations = user.accommodations.flatMap(a =>
            a.units.flatMap(u =>
                u.reservations.map(r => ({
                    unit : u.type + ' ' + u.title,
                    checkIn: r.checkIn.toLocaleDateString(),
                    checkOut: r.checkOut.toLocaleDateString(),
                    price: r.price,
                    hostRating: r.review?.hostRating || "None",
                }))
            )
        );

        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            country: user.country,
            email: user.email,
            role: user.role,
            status: user.status,
            reservations: user.reservations.length > 0 ? user.reservations.map((r) => ({
                unit: `${r.unit.type} ${r.unit.title}`,
                checkIn: r.checkIn.toLocaleDateString(),
                checkOut: r.checkOut.toLocaleDateString(),
                price: r.price,
            })) : "None",
            guestRatings: user.reservations.map(r=>r.guestReview).filter(r=>r!=null).length>0? user.reservations.map(r=>r.guestReview).filter(r=>r!=null) : "None",
            writtenReviews: user.reservations.map(r => r.review).filter(rev => rev != null).length > 0 ? user.reservations.map(r => r.review).filter(rev => rev != null) : "None",
            accommodations: user.accommodations.length > 0 ? user.accommodations.map(a=>({Accommodation: a.type+' '+a.title})) : "None",
            hostedReservations: hostedReservations.length > 0 ? hostedReservations : "None",
            revenue : hostedReservations.length>0? hostedReservations.map(r=>r.price).reduce((r,sum)=>sum+=r) : "None"
        };
    });

    return safeUsers;
}


export async function getDashAccommodation() {
  const accommodations = await prisma.accommodation.findMany({
    include: { 
      location: true,
      user:{
        select:{
          name: true,
          surname:true,
          id : true
        }
      },
      units:{
        select:{
          reservations:{
            select:{
              review:{
                select:{
                  rating: true,
                  hostRating: true,
                  experience: true,
                }
              }
            }
          }
        }
      }
    }
  });

  const safeAccommodations = accommodations.map((accommodation) => ({
    id: accommodation.id,
    ownerId : accommodation.user.id,
    owner : accommodation.user.name + ' ' + accommodation.user.surname,
    title: accommodation.title,
    description: accommodation.description,
    status : accommodation.status,
    type: accommodation.type,
    locationId : accommodation.locationId,
    country: accommodation.location.country,
    city: accommodation.location.city,
    address : accommodation.address,
    reviews: accommodation.units.flatMap(u => u.reservations.flatMap(r => r.review || []))?.length > 0 
      ? accommodation.units.flatMap(u => u.reservations.flatMap(r => r.review || []))
      : "None"
  }));

  return safeAccommodations;
}
