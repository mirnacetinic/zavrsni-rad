import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, type, description, locationId, ownerId, units, address, status, imageUrl } = body;
        const existingHost = await prisma.user.findUnique({ where: { id: parseInt(ownerId) } });
        const existingLocation = await prisma.location.findUnique({ where: { id : parseInt(locationId) } });

        if (!existingHost) {
            return NextResponse.json({ accomodation: null }, { status: 400, headers: { "message": "Invalid host info" } });
        }

        if(existingHost.role === 'USER'){
            await prisma.user.update({
                where:{ id : existingHost.id},
                data:{
                    role:'HOST'
                }
            })
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

            if(!newAccommodation){
                return NextResponse.json({newAccommodation:null},{ status: 500, headers: { "message": "Error creating Accommodation" } } )
            }

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
                        priceLists: {
                            create: unit.priceLists.map((priceList: any) => ({
                                from: new Date(priceList.from),
                                to: new Date(priceList.to),
                                price: parseFloat(priceList.price)
                            }))
                        },
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

        if(!newAccommodation){
            return NextResponse.json({newAccommodation:null},{ status: 500, headers: { "message": "Error creating Accommodation" } } )
        }
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
            return NextResponse.json({ deletedAccommodation: null }, { status: 400, headers: { "message": "Missing accommodationId" } });
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
        const { id, title, type, description, locationId, ownerId, status, address } = body;


        if (!id) {
            return NextResponse.json({ updatedAccommodation: null }, { status: 400, headers: { "message": "Missing accommodation Id" } });
        }
        const updatedAccommodation = await prisma.accommodation.update({
            where: { id : id },
            data:{
                title,
                type,
                description,
                address,
                status,
                userId : parseInt(ownerId),
                locationId : parseInt(locationId)
            }
        });

        return NextResponse.json({ updatedAccommodation }, { status: 200, headers: { "message": "Accommodation updated successfully!" } });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ updatedAccommodation: null }, { status: 500, headers: { "message": "Error updating Accommodation" } });
    }
}
