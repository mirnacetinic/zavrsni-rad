import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const body = await req.json();
        const {...data} = body;
        const review = await prisma.review.create({data});
        if(!review){
            return NextResponse.json({review:null},{status:500, headers:{"message": "Error leaving a review!"}})

        }
        return NextResponse.json({review}, {status:200, headers:{"message" : "Review posted"}});

    }catch(error){
        return NextResponse.json({review:null},{status:500, headers:{"message": "Error leaving a review!"}})
    }
}

export async function DELETE(req:Request){
    try{
        const body = await req.json();
        const {id} = body;
        const review = await prisma.review.delete({
            where: { reservationId : parseInt(id)}
        });

        if(!review){
            return NextResponse.json({review:null},{status:500, headers:{"message": "Error deleting the review!"}})

        }

        return NextResponse.json({review}, {status:200, headers:{"message" : "Review deleted"}});

    }catch(error){
        return NextResponse.json({review:null},{status:500, headers:{"message": "Error deleting the review!"}})
    }
}


export async function PUT(req:Request){
    try{
        const body = await req.json();
        const {id, ...data} = body;
        const review = await prisma.review.update({
            where: { reservationId : id},
            data
        });

        if(!review){
            return NextResponse.json({review:null},{status:500, headers:{"message": "Error updating the review!"}})

        }

        return NextResponse.json({review}, {status:200, headers:{"message" : "Review updated"}});

    }catch(error){
        return NextResponse.json({review:null},{status:500, headers:{"message": "Error updating the review!"}})
    }
}


