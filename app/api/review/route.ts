import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const body = await req.json();
        const { reservationId, rating} = body;
        const review = await prisma.review.create({
            data:{
                reservationId : reservationId,
                rating : parseInt(rating)
            }

        })

        return NextResponse.json({review}, {status:200, headers:{"message" : "Review posted"}});

    }catch(error){
        return NextResponse.json({review:null},{status:500, headers:{"message": "Error leaving a review!"}})
    }
}