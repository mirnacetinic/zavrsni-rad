import { getServerSession } from "next-auth";
import prisma from "../lib/db";
import { authOptions } from "../lib/auth";


export default async function getUser(){
    try{
      const session = await getServerSession(authOptions);
      if(!session?.user){
        return null;
      }
      const user = await prisma.user.findUnique({
        where: { email : session.user.email as string}, include:{
          favourites : true
        }
    });

    if(user){
      return{
        email : user.email,
        name : user.name,
        surname : user.surname,
        role : user.role,
        favourites : user.favourites.map(fav=>fav.unitId)
      }
    }

    return null;

  }catch(error){
    return null;
  }
}