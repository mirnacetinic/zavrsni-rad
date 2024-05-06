import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";


export async function POST(req:Request) {
        const body = await req.json();
        const { title, type, description, location, user, amenities} = body;
        const existingHost = await prisma.user.findUnique({where: {email : user}});
        const existingLocation = await prisma.location.findUnique({where: {zip : location}});
    
        if (!existingHost ) {
            return NextResponse.json({ accomodation: null }, { status: 400, headers: { "message": "Invalid host info" } });
        }

        if(!existingLocation){
            return NextResponse.json({ accomodation: null }, { status: 400, headers: { "message": "Invalid location" } });
        }


        else{  
            const newAccommodation = await prisma.accommodation.create({
                    data: {
                        title,
                        type,
                        description,
                        locationId : existingLocation.id,
                        userId : existingHost.id,
                        amenities: {
                            create: amenities.map((amenity:string) => ({ amenity: { connect: { id: parseInt(amenity) } } }))
                           
                    }}})

                return NextResponse.json(newAccommodation);
            }
}


