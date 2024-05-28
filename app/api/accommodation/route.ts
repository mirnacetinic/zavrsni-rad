import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, type, description, location, user, units, address, status, imageUrl } = body;
        const existingHost = await prisma.user.findUnique({ where: { id: parseInt(user) } });
        const existingLocation = await prisma.location.findUnique({ where: { id : parseInt(location) } });

        if (!existingHost) {
            return NextResponse.json({ accomodation: null }, { status: 400, headers: { "message": "Invalid host info" } });
        }

        if (!existingLocation) {
            return NextResponse.json({ accomodation: null }, { status: 400, headers: { "message": "Invalid location" } });
        }

        if (!units) {
            const newAccommodation = await prisma.accommodation.create({
                data: {
                    title,
                    type,
                    status,
                    description,
                    address,
                    locationId: existingLocation.id,
                    userId: existingHost.id
                }
            });

            return NextResponse.json(newAccommodation);
        }

        else{
            const newAccommodation = await prisma.accommodation.create({
            data: {
                title,
                type,
                description,
                address,
                status,
                locationId: existingLocation.id,
                userId: existingHost.id,
                imageUrl,
                units: {
                    create: units.map((unit: any) => ({
                        title: unit.title,
                        type: unit.type,
                        description: unit.description,
                        capacity: parseInt(unit.capacity),
                        images : unit.images,
                        amenities: {
                            create: unit.amenities.map((amenity: any) => ({
                                amenity: { connect: { id: parseInt(amenity) } }
                            }))
                        }
                    }))
                }
            },
            include: {
                units: true
            }
        });
        return NextResponse.json(newAccommodation);
    }
    } catch (error) {
        return NextResponse.json({ status: 500, headers: { "message": "Error creating Accommodation" } });
    }
}




export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;


        if (!id) {
            return NextResponse.json({ deletedAccommodation: null }, { status: 400, headers: { "message": "Missing accommodation ID" } });
        }

        const existingReservations = await prisma.reservation.count({
            where: {
                unit: {
                    accommodationId: id
                }
            }
        });

        if (existingReservations > 0) {
            return NextResponse.json({ deletedAccommodation: null }, { status: 400, headers: { "message": "This accommodation has reservations, cannot delete!" } });
        }

        const deletedAccommodation = await prisma.accommodation.delete({
            where: { id }
        });

        if (!deletedAccommodation) {
            return NextResponse.json({ deletedAccommodation: null }, { status: 404, headers: { "message": "Accommodation not found!" } });
        }

        return NextResponse.json({ deletedAccommodation }, { status: 200, headers: { "message": "Accommodation deleted successfully!" } });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ deletedAccommodation: null }, { status: 500, headers: { "message": "Error deleting Accommodation" } });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, type, description, location, user, status, address } = body;


        if (!id) {
            return NextResponse.json({ updatedAccommodation: null }, { status: 400, headers: { "message": "Missing accommodation ID" } });
        }
        const updatedAccommodation = await prisma.accommodation.update({
            where: { id : id },
            data:{
                title,
                type,
                description,
                address,
                status,
                userId : parseInt(user),
                locationId : parseInt(location)
            },
            include: { units: true }
        });

        return NextResponse.json({ updatedAccommodation }, { status: 200, headers: { "message": "Accommodation updated successfully!" } });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ updatedAccommodation: null }, { status: 500, headers: { "message": "Error updating Accommodation" } });
    }
}
