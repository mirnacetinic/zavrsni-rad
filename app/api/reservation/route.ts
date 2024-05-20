import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { checkIn, checkOut, guests, unitId, email } = body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    const existingUnit = await prisma.unit.findUnique({
        where: { id: unitId }
    });

    if (!existingUser) {
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Unknown user" } });
    }

    if (!existingUnit) {
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Unknown unit!" } });
    }

    if (parseInt(guests) > existingUnit.capacity) {
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Guests exceed unit's capacity!" } });
    }

    const conflictingReservation = await prisma.reservation.findFirst({
        where: {
            unitId: unitId,
            status: 'Active',
            AND: [
                {
                    checkIn: {
                        lt: checkOutDate
                    },
                    checkOut: {
                        gt: checkInDate
                    }
                }
            ]
        }
    });

    if (conflictingReservation) {
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Unit is already booked for the selected dates" } });
    }

    try {
        const newReservation = await prisma.reservation.create({
            data: {
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests: parseInt(guests),
                unitId: existingUnit.id,
                userId: existingUser.id
            }
        });

        return NextResponse.json(newReservation);

    } catch (error: any) {
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Error creating reservation" } });
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
            return NextResponse.json({ reservation: null }, { status: 404, headers: { "message": "Reservation not found!" } });
        }
        return NextResponse.json({ deletedReservation }, { status: 200, headers: { "message": "Reservation deleted successfully!" } });

    } catch (error) {
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Error deleting reservation" } });
    }
}

export async function PUT(req:Request){
    const body = await req.json();
    const {id, status} = body;

    try{
        const updatedReservation = await prisma.reservation.update({
            where:{id:id},
            data : {
                status: status
            }
        })

        if(updatedReservation){
            return NextResponse.json({updatedReservation}, { status: 200, headers: { "message": "Reservation updated successfully!" } })
        }

    }catch(error){
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Error updating reservation" } });

    }
}
