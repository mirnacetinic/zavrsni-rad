import prisma from "../lib/db";


export default async function getAccmodation(id:string){
    console.log(id);
    try{
        const accomodation = await prisma.accomodation.findUnique({
            where : {id : parseInt(id)},
            include: { location: true, units: true, amenities: { include: { amenity: true } } },
        
        });

        return accomodation;
        
    }catch(error:any){
        throw new Error("Couldn't load the listing");

    }
}
    