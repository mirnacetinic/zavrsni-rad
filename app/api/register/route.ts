import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req:Request) {
        const body = await req.json();
        const{ name, surname, email, country, password, role, status} = body;

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
                    country,
                    hashPassword:hashPass,
                    role,
                    status
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

export async function PUT(req:Request){
    const body = await req.json();
    const {id, name, surname, email, country, password, role, status} = body;
    try{
        const existingUser = await prisma.user.findUnique({
            where:{ id: id}
        });

        if(!existingUser){
            return NextResponse.json({user:null},{ status: 409, headers: { "message": "User does not exist!" } })
        }

        const hashPass = existingUser.hashPassword === password? password : await hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: { id : id },
            data: {
                name,
                surname,
                email,
                country,
                hashPassword:hashPass,
                role,
                status
            }
        });

        if(updatedUser){
            return NextResponse.json({updatedUser:updatedUser},{status:200, headers:{"message":"User updated successfully!"}})
        }

    }catch(error:any){
        return NextResponse.json({ updatedUser: null }, { status: 500, headers: { "message": "Error updating user" } });

    }

}

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json({users});
    } catch (error: any) {
        return NextResponse.json({ users: null }, { status: 500, headers: { "message": "Error fetching users" } });
    }
}