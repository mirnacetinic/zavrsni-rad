import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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