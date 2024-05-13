import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    const body = await req.json();
    const { unitId, email } = body;
    const existingUser = await prisma.user.findUnique({
        where : {email : email}
    })
    const existingUnit = await prisma.unit.findUnique({
        where : {id : unitId}
    })

    if(!existingUser){
        return NextResponse.json({ newFavourite:null },{ status: 500, headers: { "message": "Unknown user" } });

    }

    if(!existingUnit){
        return NextResponse.json({newFavourite : null }, {status: 500, headers:{"message":"Unknown unit!"}})
    }

    try{
        const newFavourite = await prisma.userFavorites.create({
            data:{
                userId :existingUser.id,
                unitId : existingUnit.id
            }
        });

        return NextResponse.json(newFavourite);

    }catch(error:any){
        return NextResponse.json({newFavourite : null },{ status: 500, headers: { "message": "Error favouriting the unit" } });

    }
    
}

export async function DELETE(req: Request) {
    const body = await req.json();
    const { email, unitId } = body;
    const existingUser = await prisma.user.findUnique({
        where : {email : email}
    })
    if(!existingUser){
        return NextResponse.json({ newFavourite:null },{ status: 500, headers: { "message": "Unknown user" } });

    }
    
    try {
            const deletedFavourite = await prisma.userFavorites.delete({
                    where: { unitId_userId: {
                        unitId: parseInt(unitId),
                        userId: existingUser.id,
                    }}
            });

            if (!deletedFavourite) {
                return NextResponse.json({deletedFavourite : null },{ status: 404, headers: { "message": "Favourite not found!" } });
            }
            return NextResponse.json({deletedFavourite}, { status: 200, headers: { "message": "Unliked successfully!" } });

            } catch (error) {
                return NextResponse.json({ deletedFavourite: null },{ status: 500, headers: { "message": "Error unliking the unit!" } });
        }
}

