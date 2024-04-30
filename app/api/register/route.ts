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