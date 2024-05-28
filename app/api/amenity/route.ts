import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const amenities = await prisma.amenity.findMany();
        return NextResponse.json({ amenities });
    } catch (error) {
        return NextResponse.json({ status: 500, headers:{'message':'Error fetching amenities'} });
    }
}
export async function POST(req:Request) {
        const body = await req.json();
        const {name} = body;

        const existingAmenity = await prisma.amenity.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } }
            
        });
      
        if (existingAmenity) {
            return NextResponse.json({amenity: null }, { status: 400, headers: { "message": "Amenity already exists!" } });
        }
            else{  
                const newAmenity = await prisma.amenity.create({
                    data: {
                        name,
                    }})
    
                return NextResponse.json(newAmenity);
            }

}

export async function DELETE(req: Request) {
    const body = await req.json();
    const { id } = body;

    try {
        const deletedAmenity = await prisma.amenity.delete({
            where: {id: id}
        });

        if (!deletedAmenity) {
            return NextResponse.json({ status: 404, headers: { "message": "Amenity not found!" } });
        }

        return NextResponse.json({ status: 200, headers: { "message": "Amenity deleted successfully!" } });
    } catch (error) {
        return NextResponse.json({ status: 500, headers: { "message": "Error deleting amenity" } });
    }
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, data } = body;

    try {
     
        const updated = await prisma.amenity.update({
            where: {id : id},
            data
        })
        if (!updated) {
            return NextResponse.json({amenity:null},{ status: 404, headers: { "message": "Amenity not found!" } });
        }

        return NextResponse.json({updated},{ status: 200, headers: { "message": "Amenity updated successfully!" } });
    } catch (error) {
        return NextResponse.json({ status: 500, headers: { "message": "Error updating amenity" } });
    }
}
