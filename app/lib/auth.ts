import prisma from "@/app/lib/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcrypt"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module 'next-auth' {
  interface User{
    id: number,
  }
}

export const authOptions : NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn:'/',
        signOut:'/',
    },
    providers: [
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "email", placeholder: "Email" },
          password: { label: "Password", type: "password" }
        },

        async authorize(credentials){
            if(!credentials?.email || !credentials?.password){
                throw new Error("Invalid credentials");
            }
            
            const user = await prisma.user.findUnique({
                where: { email : credentials.email}
            });

            if(!user){
                throw new Error("User does not exist");
            }

            else{
                if(await compare(credentials.password, user.hashPassword)){
                    return{
                        id: user.id,
                        email: user.email,
                    }
            }else{
                throw new Error("Wrong password");
            }
        }}})
    
    ]   
}