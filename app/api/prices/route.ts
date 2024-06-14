import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { data } = body;
  try {
    const newPrice = await prisma.priceList.create({
      data:{
        from: new Date(data.from),
        to: new Date(data.to),
        closed : Boolean(data.closed),
        price: parseFloat(data.price),
        unitId: parseInt(data.unitId)
    }

    });
    if (!newPrice) {
      return NextResponse.json({ newPrice: null },{ status: 500, headers: { message: "Error creating!" } }
      );
    }

    return NextResponse.json({ newPrice},{ status: 200, headers: { message: "Created successfully!" } }
    );
  } catch (error) {
    return NextResponse.json({ newPrice: null },{ status: 500, headers: { message: "Error creating pricelist"} }
    );
  }
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { ids, id, ...data } = body;
    try {
      const updated = await prisma.priceList.updateMany({
        where: {unitId : {in : ids}} || {id:id},
        data
      });
      if (!updated) {
        return NextResponse.json({ priceList: null },{ status: 404, headers: { message: "PriceList not found!" } }
        );
      }
  
      return NextResponse.json({ updated },{ status: 200, headers: { message: "Pricelist updated successfully!" } }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json({ priceList: null },{ status: 500, headers: { message: "Error updating priceList"} }
      );
    }
  }

  export async function DELETE(req: Request) {
    const body = await req.json();
    const { id } = body;

    try {
      const deleted = await prisma.priceList.delete({
        where: {id: id}
      });
      if (!deleted) {
        return NextResponse.json({ priceList: null },{ status: 404, headers: { message: "PriceList not found!" } }
        );
      }
  
      return NextResponse.json({ deleted },{ status: 200, headers: { message: "Pricelist deleted successfully!" } }
      );
    } catch (error) {
      return NextResponse.json({ priceList: null },{ status: 500, headers: { message: "Error deleting priceList"} }
      );
    }
  }
  
  