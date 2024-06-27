import prisma from "../lib/db";

export async function getLocations() {
  const locations = await prisma.location.findMany();
  return locations;
}

export async function getAmenities() {
  const amenities = await prisma.amenity.findMany();
  return amenities;
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    include:{
      favourites : {
        select:{
          unit: {
            select:{
              id:true
            }
          }
        }
      }
     
    },
    orderBy:{
      createdAt: 'desc'
    }
  });
  const safeUsers = users.map((user) => ({
    id : user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    status : user.status,
    favourites : user.favourites.map(fav=>fav.unit.id)
  }));

  return safeUsers;
}

export async function getAccommodationUnits(accommodationId: number, searchParams? : {checkIn?:string, checkOut?: string, guests?:string}) {
  const where: any = { accommodationId: accommodationId };
  where.priceLists = { some: { not: undefined, closed: false } };

  if (searchParams) {
    if (searchParams.checkIn && searchParams.checkOut) {
      const startDate = new Date(searchParams.checkIn);
      const endDate = new Date(searchParams.checkOut);

      if (startDate > endDate) {
        throw new Error('CheckIn must be before the checkOut!');
      } else {
        where.priceLists= {
            some: {
              AND: [
                {closed: false},
                { from: { lte: startDate } },
                { to: { gte: endDate } },
              ],
            },
          };

          where.reservations= {
            none: {
              AND: [
                { status: { not: 'Canceled' } },
                { status: { not: 'Declined' } },
                {
                  OR: [
                    { checkIn: { lte: startDate }, checkOut: { gte: startDate } },
                    { checkIn: { lt: endDate }, checkOut: { gte: endDate } },
                    { checkIn: { gte: startDate }, checkOut: { lte: endDate } },
                  ],
                },
              ],
            },
          };
      }
    }

    if (searchParams.guests) {
      const guests = parseInt(searchParams.guests, 10);
      if (guests >= 1) {
        where.capacity =  { gte: guests };
      } else {
        throw new Error('Minimal number of guests is 1!');
      }
    }
  }

  const units = await prisma.unit.findMany({
    where,
    include: {
      accommodation:{
        select:{
          address:true
        }
      },
      reservations : {
        where:{
          status: {notIn: ['Canceled', 'Declined']}
        },
        include:{
          review:{
            where:{
              rating:{
                not: undefined
              }
              
            }
          }
        }
      },
      amenities: {
        include:{
          amenity: true
        }
      },
      priceLists: true,
    },
  });

  const safeUnits = units.map((unit)=>({
    ...unit,
    address : unit.accommodation.address,
    amenitiesName : unit.amenities.map(a=>a.amenity.name),
    reservations : unit.reservations.map(r=>({
      checkIn: r.checkIn,
      checkOut : r.checkOut})),
    priceLists : unit.priceLists,
    reviews : unit.reservations.map(r=>r.review).filter(r=>r!==null)
}));

const rest = await prisma.unit.findMany({
  where: { accommodationId: accommodationId, id : {notIn : safeUnits.map(u=>u.id)}},
  include: {
    accommodation:{
      select:{
        address:true
      }
    },
    reservations : {
      where:{
        status: {notIn: ['Canceled', 'Declined']}
      },
      include:{
        review:{
          where:{
            rating: {not: undefined}
          }
        }
      }
    },
    amenities: {
      include:{
        amenity: true
      }
    },
    priceLists: true,
  }});

const theRest = rest.map((unit)=>({
  ...unit,
  amenitiesName : unit.amenities.map(a=>a.amenity.name),
  reservations : unit.reservations.map(r=>({
    checkIn: r.checkIn,
    checkOut : r.checkOut})),
  priceLists : unit.priceLists,
  reviews : unit.reservations.map(r=>r.review).filter(r=>r!==null)
}));
    
  return {safeUnits, theRest};
}

export async function getAccommodations(searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string; }) {
  const where: any = { status: 'Active' };
  const unitConditions: any[] = [
    { not: undefined },
    { priceLists: { some: { not: undefined, closed : false } } },
  ];

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (searchParams) {
    if (searchParams.whereTo) {
      where.location = { city: { contains: searchParams.whereTo, mode: 'insensitive' } };
    }

    if(searchParams.guests){
      unitConditions.push({
        capacity: {gte : parseInt(searchParams.guests)}
      })
    }

    if (searchParams.checkIn && searchParams.checkOut) {
      startDate = new Date(searchParams.checkIn);
      endDate = new Date(searchParams.checkOut);

      if (startDate > endDate) {
        throw new Error('CheckIn must be before the checkOut!');
      } else {

        unitConditions.push({
          reservations: {
            none: {
              AND: [
                { status: { notIn: ["Canceled", "Declined"] } },
                {
                  OR: [
                    {
                      checkIn: { lte: startDate },
                      checkOut: { gte: startDate }, 
                    },
                    {
                      checkIn: { lt: endDate }, 
                      checkOut: { gte: endDate },
                    },
                    {
                      checkIn: { gte: startDate },
                      checkOut: { lte: endDate },
                    },
                  ],
                }
              ],
            },
          },
        });

        unitConditions.push({
          AND: [
            {priceLists: {
                some: {
                  AND: [{ closed: false },{ from: { lte: startDate } },{ to: { gte: endDate } }]}
                }
            },
            {priceLists: {
                none: {
                  AND: [{ closed: true },
                    {OR: [
                          { from: { lte: startDate }, to: { gte: startDate } },
                          { from: { lte: endDate }, to: { gte: endDate } },
                          { from: { gte: startDate }, to: { lte: endDate } },
                        ],
                    },
                  ],
                },
              },
            },
          ],
        });
      }}}

  if (unitConditions.length > 0) {
    where.units = { some: { AND: unitConditions } };
  }

  const accommodations = await prisma.accommodation.findMany({
    where,
    include: {
      location: true,
      units: {
        include: {
          _count: { select: { reservations: true } },
          amenities: { select: { amenity: { select: { name: true } } } },
          reservations: { select: { review: { select: { rating: true } } } },
          priceLists: true,
        },
      },
    },
  });

  const safeAccommodations = accommodations.map((accommodation) => {
    const ratings = accommodation.units.flatMap((unit) =>
      unit.reservations.filter((r: any) => r.review != undefined).map((reservation) => reservation.review?.rating || 0)
    );
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
    const avgRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    let price = 0;

if (startDate && endDate) {
  const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  const prices = accommodation.units?.flatMap((unit) =>
    unit?.priceLists.filter(priceList => 
      priceList.from <= startDate && 
      priceList.to >= endDate && 
      !priceList.closed
    ).map(priceList => {
      let unitPrice = priceList.price;
      if (priceList.deal) {
        const discount = priceList.deal / 100;
        unitPrice -= unitPrice * discount;
      }
      return unitPrice;
    })
  );

  price = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length * days : 0;
}


    return {
      id: accommodation.id,
      title: accommodation.title,
      description: accommodation.description,
      type: accommodation.type,
      country: accommodation.location.country,
      city: accommodation.location.city,
      address: accommodation.address,
      imageUrl: accommodation.imageUrl,
      popularity: accommodation.units.reduce((acc, unit) => acc + unit._count.reservations, 0),
      rating: avgRating,
      amenities: accommodation.units.flatMap((u) => u.amenities.flatMap((a) => a.amenity.name)),
      price : price
    };
  });

  return safeAccommodations;
}

export async function getReservations(guest? : number) {
  const where : any = {};
  if(guest){
    where.userId = guest;
  }
  const reservations = await prisma.reservation.findMany(
    { where,
      include:{
      user : {select:{ name:true, surname:true}},
      review: true,
      unit : {
        select:{
          title:true,
          type: true,
          accommodationId : true
        }
      }
    }, orderBy:{
      createdAt : 'desc'
    }}
  );

  const safeReservations = reservations.map((reservation) => ({
    id: reservation.id,
    guest: reservation.user.name + ' ' + reservation.user.surname,
    unit: reservation.unitId,
    unitTitle : reservation.unit.type + ' ' + reservation.unit.title,
    accommodation : reservation.unit.accommodationId,
    checkIn: reservation.checkIn.toDateString(),
    checkOut: reservation.checkOut.toDateString(),
    guests: reservation.guests,
    status : reservation.status,
    price : reservation.price,
    paymentId : reservation.paymentId,
    wasInquiry : reservation.wasInquiry,
    review : reservation.review || undefined
  }));

  return safeReservations;
}


export async function getFavourites( id : number) {
   const favourites = await prisma.userFavorites.findMany({
    where:{ userId : id },
    include:{
      unit :{
        include:{
          accommodation:{
            include:{
              location : true,
            }
          }
        }
      }
    }
   });

   const faves = favourites.map((f)=>({
    ...f.unit.accommodation,
    city : f.unit.accommodation.location.city,
    country : f.unit.accommodation.location.country,

}));

   return faves;
}



