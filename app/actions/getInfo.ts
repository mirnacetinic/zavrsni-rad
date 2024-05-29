import prisma from "../lib/db";

export async function getUsers() {
  const users = await prisma.user.findMany({
    include:{
      _count: {
        select: { reservations: true },
      },
      favourites : {
        select:{
          unit: true
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
    reservations : user._count.reservations,
    favourites : user.favourites.map(fav=>fav.unit.id)
  }));

  return safeUsers;
}

export async function getAmenities() {
  const amenities = await prisma.amenity.findMany();
  return amenities;
}

export async function getUnits() {
  const units = await prisma.unit.findMany({
    include:{
      amenities:{
        include:{
          amenity:{
            select:{
              name: true
            }
          }
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
   ...unit,
  accommodation: unit.accommodation.title,
    
    amenities: unit.amenities.map(amenity => amenity.amenity.name) 
  }));

  return safeUnits;
}

export async function getAccommodationUnits(accommodationId: number) {
  const units = await prisma.unit.findMany({
    where: { accommodationId: accommodationId },
    include: {
      reservations : {
        where:{
          status: {not: 'Canceled'}
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
    amenities : unit.amenities.map(a=>a.amenity.name),
    reservations : unit.reservations.map(r=>({
      checkIn: r.checkIn,
      checkOut : r.checkOut})),
    prices : unit.priceLists
}));
    
  return safeUnits;
}

export async function getAccommodations(searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string; }) {
  const where: any = {};
  const unitConditions: any[] = [];
  where.status = 'Active';
  unitConditions.push({
    not : undefined
  },{
    priceLists :{some : {not : undefined}}
  })
  if (searchParams) {
    if (searchParams.whereTo) {
      where["location"] = {
        city: { contains: searchParams.whereTo, mode: "insensitive" },
      };
    }

    if (searchParams.checkIn && searchParams.checkOut) {
      const startDate = new Date(searchParams.checkIn);
      const endDate = new Date(searchParams.checkOut);

      if (startDate > endDate) {
        throw new Error("CheckIn must be before the checkOut!");
      } else {
        unitConditions.push({
          priceLists: {
            some: {
              AND: [
                { from: { lte: startDate } },
                { to: { gte: endDate } },
              ],
            },
          },
        });
        unitConditions.push({
          reservations: {
            none: {
              AND: [
                { status: { not: "Canceled" } },
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
      }
    }

    if (searchParams.guests) {
      if (parseInt(searchParams.guests) >= 1) {
        unitConditions.push({ capacity: { gte: parseInt(searchParams.guests) } });
      } else {
        throw new Error("Minimal number of guests is 1!");
      }
    }

    if (unitConditions.length > 0) {
      where["units"] = { some: { AND: unitConditions } };
    }
  }

  const accommodations = await prisma.accommodation.findMany({
    where,
    include: { location: true }
  });

  const safeAccommodations = accommodations.map((accommodation) => ({
    id: accommodation.id,
    title: accommodation.title,
    description: accommodation.description,
    type: accommodation.type,
    country: accommodation.location.country,
    city: accommodation.location.city,
    address : accommodation.address,
    imageUrl: accommodation.imageUrl,
    status : accommodation.status
  }));

  return safeAccommodations;
}

export async function getDashAccommodation(host?:number) {
  const where: any = {};
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
      }

     }
  });

  const safeAccommodations = accommodations.map((accommodation) => ({
    id: accommodation.id,
    ownerId : accommodation.user.id,
    owner : accommodation.user.name + ' ' + accommodation.user.surname,
    title: accommodation.title,
    description: accommodation.description,
    type: accommodation.type,
    locationId : accommodation.locationId,
    country: accommodation.location.country,
    city: accommodation.location.city,
    address : accommodation.address,
    status : accommodation.status,
  
  }));

  return safeAccommodations;
}

export async function getLocations() {
  const locations = await prisma.location.findMany();
  return locations;
}

export async function getReservations(guest? : number, unit? : number) {
  const where : any = {};
  if(guest){
    where.userId = guest;
  }
  if(unit){
    where.unitId = unit;
  }
  const reservations = await prisma.reservation.findMany(
    { where,
      include:{
      user : {select:{ name:true, surname:true}},
      review: {
        select:{
          rating:true
        }
      },
      unit : {
        select:{
          title:true,
          type: true,
          accommodationId : true
        }
      }
    }, orderBy:{
      createdAt : 'asc'
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
    review : reservation.review?.rating
  }));

  return safeReservations;
}

export async function getFavourites(id:number) {
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
