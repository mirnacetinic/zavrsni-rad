import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    const body = await req.json();
    const { checkIn, checkOut , guests, unitId, email } = body;
    const existingUser = await prisma.user.findUnique({
        where : {email : email}
    })
    const existingUnit = await prisma.unit.findUnique({
        where : {id : unitId}
    })

    if(!existingUser){
        return NextResponse.json({ reservation:null },{ status: 500, headers: { "message": "Unknown user" } });

    }

    if(!existingUnit){
        return NextResponse.json({reservation : null }, {status: 500, headers:{"message":"Unknown unit!"}})
    }

    if(parseInt(guests)>existingUnit.capacity){
        return NextResponse.json({reservation:null}, {status: 500, headers:{"message":"Guests exceed unit's capacity!"}})
    }

    try{
        const newReservation = await prisma.reservation.create({
            data:{
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                guests: parseInt(guests),
                unitId : existingUnit.id,
                userId: existingUser.id

            }
        });

        return NextResponse.json(newReservation);

    }catch(error:any){
        return NextResponse.json({reservation : null },{ status: 500, headers: { "message": "Error creating reservation" } });

    }
    
}

export async function DELETE(req: Request) {
    const body = await req.json();
    const { id } = body;
    try {
            const deletedReservation = await prisma.reservation.delete({
                    where: { id: id }
            });

            if (!deletedReservation) {
                return NextResponse.json({reservation : null },{ status: 404, headers: { "message": "Reservation not found!" } });
            }
            return NextResponse.json({deletedReservation}, { status: 200, headers: { "message": "Reservation deleted successfully!" } });

            } catch (error) {
                return NextResponse.json({ reservation: null },{ status: 500, headers: { "message": "Error deleting reservation" } });
        }
}
