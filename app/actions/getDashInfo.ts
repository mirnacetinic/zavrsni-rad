import { Review } from "@prisma/client";
import prisma from "../lib/db";

const mapReviews = (reviews : Review[]) => reviews.map(r => ({
  id: r.reservationId,
  rating: r.rating,
  hostRating: r.hostRating,
  experience: r.experience,
}));


export async function getDashReviews(status?: string) {
  let where : any = {};
  if(status) where.status = status;
  const reviews = await prisma.review.findMany({ where });
  return mapReviews(reviews);
}


export async function getDashReservations() {
  const reservations = await prisma.reservation.findMany({
    include: {
      user: { select: { name: true, surname: true } },
      review: { select: { hostRating: true, rating: true, experience: true } },
      unit: {
        select: {
          title: true,
          type: true,
          accommodation: { select: { id: true, location: { select: { city: true } } } },
        },
      },
    },
  });

  return reservations.map(reservation => ({
    id: reservation.id,
    guest: `${reservation.user.name} ${reservation.user.surname}`,
    userId: reservation.userId,
    unitId: reservation.unitId,
    unitTitle: `${reservation.unit.type} ${reservation.unit.title}`,
    accommodation: reservation.unit.accommodation.id,
    city: reservation.unit.accommodation.location.city,
    checkIn: reservation.checkIn.toDateString(),
    checkOut: reservation.checkOut.toDateString(),
    guests: reservation.guests,
    status: reservation.status,
    price: reservation.price,
    paymentId: reservation.paymentId,
    wasInquiry: reservation.wasInquiry,
    review: reservation.review || "None",
  }));
}


export async function getBoardReservations(host: number) {
  const reservations = await prisma.reservation.findMany({
    where: { unit: { accommodation: { userId: host } } },
    include: {
      user: { select: { name: true, surname: true } },
      review: { select: { status: true, rating: true, hostRating: true, experience: true } },
      unit: {
        select: {
          title: true,
          type: true,
          accommodation: { select: { title: true, type: true } },
        },
      },
    },
    orderBy: { checkIn: 'desc' },
  });

  return reservations.map(reservation => ({
    id: reservation.id,
    guest: `${reservation.user.name} ${reservation.user.surname}`,
    unit: `${reservation.unit.type} ${reservation.unit.title}`,
    accommodation: `${reservation.unit.accommodation.type} ${reservation.unit.accommodation.title}`,
    checkIn: reservation.checkIn.toDateString(),
    checkOut: reservation.checkOut.toDateString(),
    guests: reservation.guests,
    status: reservation.status,
    wasInquiry: reservation.wasInquiry,
    revenue: reservation.price,
    review: reservation.review ? {
      rating: reservation.review.rating,
      hostRating: reservation.review.hostRating,
      experience: reservation.review.experience,
      status: reservation.review.status ?? 'None',
    } : 'None',
    guestRating: reservation.guestReview || 'None',
    past: reservation.checkIn > new Date() ? false : true,
  }));
}


export async function getDashUpcoming(host?: number) {
  const where: any = {
    status: { notIn: ['Canceled', 'Declined'] },
  };

  if (host) {
    where.unit = { accommodation: { userId: host } };
  }

  const now = new Date();
  now.setHours(0,0,0,0);
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  where.checkIn = { lte: nextWeek, gte : now };

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      user: { select: { name: true, surname: true } },
      unit: {
        select: {
          title: true,
          type: true,
          accommodation: { select: { title: true, type: true } },
        },
      },
    },
    orderBy: { checkIn: 'asc' },
  });

  const safeReservations = reservations.map(reservation => ({
    id: reservation.id,
    guest: `${reservation.user.name} ${reservation.user.surname}`,
    unit: `${reservation.unit.type} ${reservation.unit.title}`,
    accommodation: `${reservation.unit.accommodation.type} ${reservation.unit.accommodation.title}`,
    checkIn: reservation.checkIn.toDateString(),
    checkOut: reservation.checkOut.toDateString(),
    guests: reservation.guests,
    status: reservation.status,
    revenue: reservation.price,
  }));

  return {
    checkingInToday: safeReservations.filter(reservation => reservation.checkIn === now.toDateString() && reservation.status === 'Active'),
    upcoming: safeReservations.filter(reservation => reservation.checkIn !== now.toDateString()),
  };
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
                  review: { select: { hostRating: true } },
                },
              },
            },
          },
        },
      },
      reservations: {
        select: {
          checkIn: true,
          checkOut: true,
          price: true,
          guestReview: true,
          review: { select: { hostRating: true, rating: true, experience: true, reservationId: true } },
          unit: { select: { title: true, type: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users.map(user => {
    const hostedReservations = user.accommodations.flatMap(accommodation =>
      accommodation.units.flatMap(unit =>
        unit.reservations.map(reservation => ({
          unit: `${unit.type} ${unit.title}`,
          checkIn: reservation.checkIn.toLocaleDateString(),
          checkOut: reservation.checkOut.toLocaleDateString(),
          price: reservation.price,
          hostRating: reservation.review?.hostRating || "None",
        }))
      )
    );

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      passId : user.hashPassword,
      role: user.role,
      status: user.status,
      country: user.country,
      reservations: user.reservations.length > 0 ? user.reservations.map(r => ({
        unit: `${r.unit.type} ${r.unit.title}`,
        checkIn: r.checkIn.toLocaleDateString(),
        checkOut: r.checkOut.toLocaleDateString(),
        price: r.price,
      })) : "None",
      guestRatings: user.reservations.flatMap(r => r.guestReview ? [{ rating: r.guestReview }] : []).length > 0 ? user.reservations.flatMap(r => r.guestReview ? [{ rating: r.guestReview }] : []) : "None",
      writtenReviews: user.reservations.map(r => r.review).filter(rev => rev != null).length > 0 ? user.reservations.map(r => r.review).filter(rev => rev != null) : "None",
      accommodations: user.accommodations.length > 0 ? user.accommodations.map(a => ({ Accommodation: `${a.type} ${a.title}` })) : "None",
      hostedReservations: hostedReservations.length > 0 ? hostedReservations : "None",
      revenue: hostedReservations.reduce((sum, r) => sum + r.price, 0) || "None",
    };
  });
}


export async function getDashAccommodation() {
  const accommodations = await prisma.accommodation.findMany({
    include: {
      location: true,
      user: { select: { name: true, surname: true, id: true } },
      units: {
        select: {
          reservations: {
            select: {
              review: { select: { rating: true, hostRating: true, experience: true } },
            },
          },
        },
      },
    },
  });

  return accommodations.map(accommodation => ({
    id: accommodation.id,
    ownerId: accommodation.user.id,
    owner: `${accommodation.user.name} ${accommodation.user.surname}`,
    title: accommodation.title,
    description: accommodation.description,
    status: accommodation.status,
    type: accommodation.type,
    locationId: accommodation.locationId,
    country: accommodation.location.country,
    city: accommodation.location.city,
    address: accommodation.address,
    reviews: accommodation.units.flatMap(unit => unit.reservations.flatMap(reservation => reservation.review || [])).length > 0 
      ? accommodation.units.flatMap(unit => unit.reservations.flatMap(reservation => reservation.review || []))
      : "None",
  }));
}

export async function getHostAccommodation(host?:number) {
  let where : any = {};
  if(host){
    where.userId = host;

  }
  const accommodations = await prisma.accommodation.findMany({
    where,
    include: { 
      location: true,
      user:{
        select:{
          name: true,
          surname:true,
          id : true
        }
      },
      units : {
        include:{
          priceLists:{
            orderBy:{
              from: 'desc'
            }
          },
          reservations: {
            where:{
              status: { notIn : ['Canceled', 'Declined']}
            }
          },
          amenities:{
            include:{
              amenity: true
              }
            }
          },
          orderBy:{
            title: 'asc'
          }
        },
     },
     orderBy:{
      title: 'asc'
     }
  });

  const safeAccommodations = accommodations.map((accommodation) => ({
    id: accommodation.id,
    ownerId : accommodation.userId,
    owner : accommodation.user.name + ' ' + accommodation.user.surname,
    title: accommodation.title,
    description: accommodation.description,
    type: accommodation.type,
    image : accommodation.imageUrl,
    imageKey : accommodation.imageKey,
    locationId : accommodation.locationId,
    country: accommodation.location.country,
    city: accommodation.location.city,
    address : accommodation.address,
    status : accommodation.status,
    units : accommodation.units.map((unit)=>({
      ...unit,
       amenities: unit.amenities.map(amenity => amenity.amenityId),
       amenitiesName : unit.amenities.map(amenity=>amenity.amenity.name),
       priceLists : unit.priceLists.filter(price=>!price.closed) || [],
       closedDates : unit.priceLists.filter(price=>price.closed).map(p=>({id: p.id, start:p.from, end:p.to})) || []
     }))
  
  }));

  return safeAccommodations;
}

export async function getDashUnits() {
  const units = await prisma.unit.findMany({
    include:{
      amenities:{
        include:{
        amenity: true
        }
      },
      accommodation:{
        select:{
          title: true 
        }
      }
    }
  });

  const safeUnits = units.map(unit=>({
    id: unit.id,
    accommodationId : unit.accommodationId,
    accommodation: unit.accommodation.title,
    title : unit.title,
    type : unit.type,
    description: unit.description,
    capacity : unit.capacity,
    bedrooms : unit.bedrooms,
    beds : unit.beds,
    bathrooms : unit.bathrooms,
    inquiry: unit.inquiry.toString(),
    amenities: unit.amenities.length>0? unit.amenities.flatMap(amenity => ({id: amenity.amenity.id.toString(), name : amenity.amenity.name})) : "None",
    }));

  return safeUnits;
}
