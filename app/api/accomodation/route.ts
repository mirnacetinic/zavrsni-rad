import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";


export async function POST(req:Request) {
        const body = await req.json();
        const { title, type, description, location, user} = body;

        const existingHost = await prisma.user.findUnique({where: {email : user}});
        const existingLocation = await prisma.location.findUnique({where: {zip : location}});
    
    
        if (!existingHost ) {
            return NextResponse.json({ accomodation: null }, { status: 400, headers: { "message": "Invalid host info" } });
        }

        if(!existingLocation){
            return NextResponse.json({ accomodation: null }, { status: 400, headers: { "message": "Invalid location" } });
        }


        else{  
            const newAccomodation = await prisma.accomodation.create({
                    data: {
                        title,
                        type,
                        description,
                        locationId : existingLocation.id,
                        userId : existingHost.id
                    }})
    
                return NextResponse.json(newAccomodation);
            }
}


