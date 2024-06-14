import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { capacity, beds, bathrooms, bedrooms, amenities, accommodationId, inquiry, priceLists , ...data} = body;
  

    const existingAccommodation = await prisma.accommodation.findUnique({
      where: { id: parseInt(accommodationId) }
    });

    if (!existingAccommodation) {
      return NextResponse.json({ unit: null }, { status: 400, headers: { "message": "Invalid accommodation info" } });
    }

    const newUnit = await prisma.unit.create({
      data: {
        ...data,
        capacity: parseInt(capacity),
        beds: parseInt(beds),
        bathrooms: parseInt(bathrooms),
        bedrooms : parseInt(bedrooms),
        inquiry: Boolean(inquiry),
        accommodationId : existingAccommodation.id,
        ...(priceLists && {priceLists: {
          create: priceLists.map((priceList: any) => ({
            from: new Date(priceList.from),
            to: new Date(priceList.to),
            price: parseFloat(priceList.price),
          })),
        }}),
        ...(amenities && {amenities: {
          create: amenities.map((amenity: any) => ({
            amenity: { connect: { id: parseInt(amenity) } }}))
          }}),
      },
    });

    return NextResponse.json({newUnit}, {status:200, headers:{ "message" : "Unit created successfully!"}});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ unit: null }, { status: 500, headers: { "message": "Error creating unit" } });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    const existingReservations = await prisma.reservation.count({
      where: { unitId: id }
    });

    if (existingReservations > 0) {
      return NextResponse.json({ deletedUnit: null }, { status: 400, headers: { "message": "This unit has reservations, cannot delete!" } });
    }

    const deletedUnit = await prisma.unit.delete({
      where: { id: id }
    });

    return NextResponse.json({ deletedUnit},{status: 200, headers: { "message": "Unit deleted successfully!" } });
  } catch (error) {
    return NextResponse.json({ deletedUnit: null }, { status: 500, headers: { "message": "Error deleting unit" } });
  }
}

export async function PUT(req: Request) {
    try {
      const body = await req.json();
      const { id, capacity, beds, bathrooms, bedrooms, amenities, inquiry, priceLists, accommodationId, ...data } = body;
  
      const amenityIds = amenities? amenities.map((a: string) => parseInt(a)) : [];
      const existingPriceLists = priceLists?.filter((priceList: any) => parseInt(priceList.id));
  
      const updatedUnit = await prisma.unit.update({
        where: { id: id },
        data: {
          ...data,
          accommodationId: parseInt(accommodationId),
          beds: parseInt(beds),
          bathrooms: parseInt(bathrooms),
          bedrooms : parseInt(bedrooms),
          capacity: parseInt(capacity),
          inquiry: Boolean(inquiry),
          ...(priceLists && {priceLists: {
            deleteMany: {
              id: { notIn: existingPriceLists?.map((p: any) => parseInt(p.id)) },
              closed: false
            },
            upsert: priceLists?.map((priceList: any) => ({
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
          },}),
          ...(amenities && {
          amenities: {
            deleteMany: {
              amenityId: { notIn: amenityIds }
            },
            connectOrCreate: amenities.map((amenityId: any) => ({
              where: { amenityId_unitId: { amenityId: parseInt(amenityId), unitId: id } },
              create: {
                amenity: { connect: { id: parseInt(amenityId) } },
              }
            }))
          },}),
        },
      });
  
      return NextResponse.json({ updatedUnit},{status: 200, headers: { "message": "Unit updated successfully!" } });
    } catch (error) {
      return NextResponse.json({ updatedUnit: null }, { status: 500, headers: { "message": "Error updating unit" } });
    }
  }