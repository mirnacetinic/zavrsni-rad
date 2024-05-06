import prisma from "../lib/db";


export default async function getAccommodation(id:string){
    try{
        const accommodation = await prisma.accommodation.findUnique({
            where : {id : parseInt(id)},
            include: { 
                location: true,
                units: true, 
                amenities: { 
                        include: { amenity: true },
                    }, 
            },
        });

        if(accommodation){
        const safeAccomodation={
            ...accommodation,
            country: accommodation.location.country,
            city: accommodation.location.city,
            units : accommodation.units.map((unit)=>unit),
            amenities: accommodation.amenities.map(amenity => amenity.amenity?.name),
        }
        

        return safeAccomodation;
    }
        
    }catch(error:any){
        throw new Error("Couldn't load the listing");

    }
}
    