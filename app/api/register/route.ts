import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req:Request) {
        const body = await req.json();
        const {name, surname, email, password, role} = body;

        const existingUser = await prisma.user.findUnique({
            where: { email : email }

        });

        if(existingUser){
            return NextResponse.json({user:null},{ status: 409, headers: { "message": "Email already taken!" } })
        }

        else{
            const hashPass = await hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    name,
                    surname,
                    email,
                    hashPassword:hashPass,
                    role
                }})

            return NextResponse.json(newUser);
        }

}

export async function DELETE(req:Request){
    const body = await req.json();
    const {id} = body;
    try{
        const deletedUser = await prisma.user.delete({
            where: { id : parseInt(id) }
        })

        if(deletedUser){
            return NextResponse.json({deletedUser:deletedUser},{status:200, headers:{"message":"User deleted successfully!"}})
        }

    }catch(error:any){
        return NextResponse.json({ deletedUser: null }, { status: 500, headers: { "message": "Error deleting user" } });

    }

}