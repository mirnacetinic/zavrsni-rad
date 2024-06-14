import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locationId, ownerId, units, ...accommodationData } = body;

    const existingHost = await prisma.user.findUnique({
      where: { id: parseInt(ownerId) },
    });

    const existingLocation = await prisma.location.findUnique({
      where: { id: parseInt(locationId) },
    });

    if (!existingHost) {
      return NextResponse.json(
        { accommodation: null },
        { status: 400, headers: { message: "Invalid host info" } }
      );
    }

    if (existingHost.role === "USER") {
      await prisma.user.update({
        where: { id: existingHost.id },
        data: {
          role: "HOST",
        },
      });
    }

    if (!existingLocation) {
      return NextResponse.json(
        { accommodation: null },
        { status: 400, headers: { message: "Invalid location" } }
      );
    }

    const newAccommodation = await prisma.accommodation.create({
      data: {
        ...accommodationData,
        locationId: existingLocation.id,
        userId: existingHost.id,
        units: {
          create: units?.map((unit: any) => ({
            ...unit,
            capacity: parseInt(unit.capacity),
            bedrooms : parseInt(unit.bedrooms),
            bathrooms : parseInt(unit.bathrooms),
            beds : parseInt(unit.beds),
            inquiry: Boolean(unit.inquiry),
            priceLists: {
              create: unit.priceLists.map((priceList: any) => ({
                from: new Date(priceList.from),
                to: new Date(priceList.to),
                price: parseFloat(priceList.price),
              })),
            },
            amenities: {
              create: unit.amenities.map((amenity: any) => ({
                amenity: { connect: { id: parseInt(amenity) } },
              })),
            },
          })),
        },
       }
    });

    if(!newAccommodation){
      return NextResponse.json({ accommodation: null },{ status: 500, headers: { message: "Error creating accommodation" } });

    }

    return NextResponse.json(newAccommodation);
  } catch (error) {
    return NextResponse.json( { accommodation: null },{ status: 500, headers: { message: "Error creating accommodation" } }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json( { deletedAccommodation: null }, { status: 400, headers: { message: "Missing accommodationId" } });
    }

    const existingReservations = await prisma.reservation.count({
      where: {
        unit: {
          accommodationId: id,
        },
      },
    });

    if (existingReservations > 0) {
      return NextResponse.json(
        { deletedAccommodation: null },{ status: 400,headers: { message: "This accommodation has reservations, cannot delete!",},}
      );
    }

    const deletedAccommodation = await prisma.accommodation.delete({
      where: { id : parseInt(id) },
    });

    if (!deletedAccommodation) {
      return NextResponse.json({ deletedAccommodation: null },{ status: 404, headers: { message: "Accommodation not found!" } });
    }

    return NextResponse.json(
      { deletedAccommodation },{status: 200,headers: { message: "Accommodation deleted successfully!" },}
    );
  } catch (error) {
    return NextResponse.json({ deletedAccommodation: null },{ status: 500, headers: { message: "Error deleting Accommodation" } });
  }
}


export async function PUT(req: Request) {
    try {
      const body = await req.json();
      const { id, locationId, ownerId, units, ...accommodationData } = body;
  
      if (!id) {
        return NextResponse.json({ updatedAccommodation: null }, { status: 400, headers: { message: "Missing accommodation Id" } });
      }
  
      const unitUpserts = units?.map((unit: any) => ({
        where: { id: parseInt(unit.id) || 0 },
        update: {
          type: unit.type,
          title: unit.title,
          description: unit.description,
          capacity: parseInt(unit.capacity),
          bedrooms: parseInt(unit.bedrooms),
          bathrooms: parseInt(unit.bathrooms),
          beds: parseInt(unit.beds),
          inquiry: Boolean(unit.inquiry),
          priceLists: {
            deleteMany: {
              id: { notIn: unit.priceLists?.map((priceList: any) => priceList.id).filter((id: any) => id !== undefined) },
              closed : false
            },
            upsert: unit.priceLists?.map((priceList: any) => ({
              where: { id: priceList.id || 0 },
              update: {
                from: new Date(priceList.from),
                to: new Date(priceList.to),
                price: parseFloat(priceList.price),
              },
              create: {
                from: new Date(priceList.from),
                to: new Date(priceList.to),
                price: parseFloat(priceList.price),
              }
            })),
          },
          amenities: {
            deleteMany: {
              amenityId: { notIn: unit.amenities.map((a: string) => parseInt(a)) },
            },
            connectOrCreate: unit.amenities.map((amenityId: any) => ({
              where: { amenityId_unitId: { amenityId: parseInt(amenityId), unitId: unit.id } },
              create: {
                amenity: { connect: { id: parseInt(amenityId) } },
              }
            })),
          },
        },
        create: {
          type: unit.type,
          title: unit.title,
          description: unit.description,
          capacity: parseInt(unit.capacity),
          bedrooms: parseInt(unit.bedrooms),
          bathrooms: parseInt(unit.bathrooms),
          beds: parseInt(unit.beds),
          inquiry: Boolean(unit.inquiry),
          priceLists: {
            create: unit.priceLists?.map((priceList: any) => ({
              from: new Date(priceList.from),
              to: new Date(priceList.to),
              price: parseFloat(priceList.price),
            })),
          },
          amenities: {
            connectOrCreate: unit.amenities.map((amenityId: any) => ({
              where: { amenityId_unitId: { amenityId: parseInt(amenityId), unitId: unit.id } },
              create: {
                amenity: { connect: { id: parseInt(amenityId) } },
              }
            })),
          },
        },
      }));
  
      const updatedAccommodation = await prisma.accommodation.update({
        where: { id: parseInt(id) },
        data: {
          ...accommodationData,
          locationId: parseInt(locationId),
          userId: parseInt(ownerId),
          ...(units && {
            units: {
              deleteMany: {
                id: { notIn: units.map((u: any) => u.id).filter((u: any) => u !== undefined) },
              },
              upsert: unitUpserts,
            },
          }),
        },
      });

    return NextResponse.json({ updatedAccommodation },{status: 200, headers: { message: "Accommodation and units updated successfully!" }} );
  } catch (error) {
    return NextResponse.json({ updatedAccommodation: null },{ status: 500, headers: { message: "Error updating accommodation and units" } });
  }
}
