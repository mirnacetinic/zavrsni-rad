import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, type, description, location, user, units, imageUrl } = body;
        const existingHost = await prisma.user.findUnique({ where: { email: user } });
        const existingLocation = await prisma.location.findUnique({ where: { zip : location } });

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
                    description,
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
                locationId: existingLocation.id,
                userId: existingHost.id,
                imageUrl,
                units: {
                    create: units.map((unit: any) => ({
                        title: unit.title,
                        type: unit.type,
                        description: unit.description,
                        capacity: parseInt(unit.capacity),
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

        const existingReservations = await prisma.reservation.count({
            where: {
                unit: {
                    accommodationId: id
                }
            }
        });

       if(existingReservations>0){
        return NextResponse.json({deletedAccommodation:null},{status: 500, headers:{"message":"This accommodation has reservations, cannot delete!"}})
       }

        const deletedAccommodation = await prisma.accommodation.delete({
            where: { id: id }
        });

        if (!deletedAccommodation) {
            return NextResponse.json({deletedAccommodation : null },{ status: 404, headers: { "message": "Accommodation not found!" }});
        }

        return NextResponse.json({deletedAccommodation}, { status: 200, headers: { "message": "Accommodation deleted successfully!" }});
    } catch (error) {
        return NextResponse.json({deletedAccommodation: null},{ status: 500, headers: { "message": "Error deleting Accommodation" }});
    }
}
