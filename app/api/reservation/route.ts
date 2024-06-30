import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { checkIn, checkOut, guests, unitId, email, userId, paymentId, price, status, wasInquiry } = body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if(checkOutDate<checkInDate){
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Wrong dates" } });

    }

    const existingUser = await prisma.user.findUnique({
        where:{
            ...(email && {email: email}),
            ...(userId && { id: parseInt(userId) }),
            }
    });

    const existingUnit = await prisma.unit.findUnique({
        where: { id: parseInt(unitId) }
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
            unitId: existingUnit.id,
            status: {notIn: ['Canceled', 'Declined']},
            AND: [
                {
                    checkIn: {
                        lte: checkOutDate
                    },
                    checkOut: {
                        gte: checkInDate
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
                userId: existingUser.id,
                wasInquiry: Boolean(wasInquiry),
                paymentId,
                status,
                price : parseFloat(price)
            }
        });

        return NextResponse.json(newReservation);

    } catch (error: any) {
        console.log(error);
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

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...data } = body;

 
    if (data.checkIn) data.checkIn = new Date(data.checkIn);
    if (data.checkOut) data.checkOut = new Date(data.checkOut);
    if (data.userId) data.userId = parseInt(data.userId);
    if (data.guestReview) data.guestReview = parseInt(data.guestReview);

    if (data.checkIn && data.checkOut && data.checkOut < data.checkIn) {
        return NextResponse.json({ reservation: null }, { status: 400, headers: { "message": "Wrong dates" } });
    }

 
    if (data.unitId) {
        data.unitId = parseInt(data.unitId);
        const existingUnit = await prisma.unit.findUnique({
            where: { id: data.unitId }
        });

        if (!existingUnit) {
            return NextResponse.json({ reservation: null }, { status: 400, headers: { "message": "Unknown unit!" } });
        }

        if (data.guests) {
            data.guests = parseInt(data.guests);
            if(data.guests > existingUnit.capacity)
                return NextResponse.json({ reservation: null }, { status: 400, headers: { "message": "Guests exceed unit's capacity!" } });
        }

        if (data.checkIn && data.checkOut) {
            const conflictingReservation = await prisma.reservation.findFirst({
                where: {
                    id: { not: id },
                    unitId: existingUnit.id,
                    status: { notIn: ['Canceled', 'Declined'] },
                    AND: [
                        {
                            checkIn: { lte: data.checkOut },
                            checkOut: { gte: data.checkIn }
                        }
                    ]
                }
            });

            if (conflictingReservation) {
                return NextResponse.json({ reservation: null }, { status: 400, headers: { "message": "Unit is already booked for the selected dates" } });
            }
        }
    }

    try {
        const updatedReservation = await prisma.reservation.update({
            where: { id: id },
            data
        });

        if (updatedReservation) {
            return NextResponse.json({ updatedReservation }, { status: 200, headers: { "message": "Reservation updated successfully!" } });
        }
    } catch (error) {
        console.error("Error updating reservation:", error);
        return NextResponse.json({ reservation: null }, { status: 500, headers: { "message": "Error updating reservation" } });
    }
}