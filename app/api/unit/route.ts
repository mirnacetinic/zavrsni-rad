import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";


export async function POST(req:Request) {
        const body = await req.json();
        const { title, type, description,capacity, amenities, AccommodationId} = body;
        const existingAccommodation = await prisma.accommodation.findUnique({ where: { id : AccommodationId}});
    
        if (!existingAccommodation ) {
            return NextResponse.json({unit: null }, { status: 400, headers: { "message": "Invalid accommodation info" } });
        }

        else{  
            if(!amenities){
                 const newUnit = await prisma.unit.create({
                    data: {
                        title,
                        type,
                        description,
                        capacity,
                        accommodationId : existingAccommodation.id
                    }});

                return NextResponse.json(newUnit);
            }

            else{
                const newUnit = await prisma.unit.create({
                    data: {
                        title,
                        type,
                        description,
                        capacity,
                        accommodationId: existingAccommodation.id,
                        amenities: {
                            create: amenities.map((amenity:string) => ({ amenity: { connect: { id: parseInt(amenity) } } }))}
                        }});
                return NextResponse.json(newUnit);
            }
        }
}


export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        const existingReservations = await prisma.reservation.count({
            where: {
                unitId : id
            }
        });
        
       if(existingReservations>0){
        return NextResponse.json({deletedUnit:null},{status: 500, headers:{"message":"This unit has reservations, cannot delete!"}})
       }

        const deletedUnit = await prisma.unit.delete({
            where: { id: id }
        });

        if (!deletedUnit) {
            return NextResponse.json({deletedUnit : null },{ status: 404, headers: { "message": "Unit not found!" }});
        }

        return NextResponse.json({deletedUnit}, { status: 200, headers: { "message": "Accommodation deleted successfully!" }});
    } catch (error) {
        return NextResponse.json({deletedUnit: null},{ status: 500, headers: { "message": "Error deleting unit" }});
    }
}
