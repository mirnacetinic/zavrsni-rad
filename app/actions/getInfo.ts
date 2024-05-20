import prisma from "../lib/db";

export async function getUsers() {
  const users = await prisma.user.findMany({
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
    id: unit.id,
    name: unit.title,
    type: unit.type,
    description: unit.description,
    accommodation: unit.accommodation.title,
    capacity: unit.capacity,
    amenities: unit.amenities.map(amenity => amenity.amenity.name) 
  }));

  return safeUnits;
}

export async function getAccommodationUnits(accommodationId: string) {
  const units = prisma.unit.findMany({
    where: { accommodationId: parseInt(accommodationId) },
    include: {
      amenities: true,
    },
  });

  return units;
}

export async function getAccommodations(searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string; }) {
  const where: any = {};
  const unitConditions: any[] = [];

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
          reservations: {
            none: {
              AND: [
                { status: { not: "Canceled" } },
                {
                  OR: [
                    {
                      checkIn: { lte: startDate },
                      checkOut: { gt: startDate }, 
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
                },
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
    imageUrl: accommodation.imageUrl,
  }));

  return safeAccommodations;
}

export async function getHostAccommodation(id: number) {
  const accommodations = await prisma.accommodation.findMany({
    where: { userId: id },
    include: { location: true }
  });

  const safeAccommodations = accommodations.map((accommodation) => ({
    id: accommodation.id,
    title: accommodation.title,
    description: accommodation.description,
    type: accommodation.type,
    country: accommodation.location.country,
    city: accommodation.location.city,
    imageUrl: accommodation.imageUrl,
  }));

  return safeAccommodations;
}

export async function getLocations() {
  const locations = await prisma.location.findMany();
  return locations;
}

export async function getReservations(guest? : number) {
  const where : any = {};
  if(guest){
    where.userId = guest;
  }
  const reservations = await prisma.reservation.findMany(
    { where,
      include:{
      user : true,
      unit : {
        select:{
          title:true
        }
      }
    }, orderBy:{
      checkIn : 'desc'
    }}
  );

  const safeReservations = reservations.map((reservation) => ({
    id: reservation.id,
    guest: reservation.user.name + ' ' + reservation.user.surname,
    unit: reservation.unitId,
    unitTitle : reservation.unit.title,
    checkIn: reservation.checkIn.toDateString(),
    checkOut: reservation.checkOut.toDateString(),
    guests: reservation.guests,
    status : reservation.status
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
