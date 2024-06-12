import { NextResponse } from "next/server";
import { utapi } from "../uploadthing/core";

export async function DELETE(req:Request) {
    try{
        const body = await req.json();
        const { key } = body;
        const deleted = await utapi.deleteFiles(key);

        return NextResponse.json(deleted);

    }catch(error){
        return NextResponse.json({deleted:null}, {status:500, headers:{"message": "Something went wrong"}})

    }
    
}