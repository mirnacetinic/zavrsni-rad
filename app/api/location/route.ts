import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";


export async function POST(req:Request) {
        const body = await req.json();
        const {city,country,zip} = body;

        const existingLocation = await prisma.location.findUnique({
            where: { zip:zip }

        });

        if(existingLocation){
            return NextResponse.json({location:null},{ status: 409, headers: { "message": "Location with this ZIP code already exists!" } })
        }

        else if(zip){
            const zipRegex = /^\d{5}$/;
            if (!zipRegex.test(zip)) {
                return NextResponse.json({ location: null }, { status: 400, headers: { "message": "Invalid ZIP code" } });
            }
            else{  
                const newLocation = await prisma.location.create({
                    data: {
                        city,
                        country,
                        zip
                    }})
    
                return NextResponse.json(newLocation);
            }
        }


}