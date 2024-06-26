import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locations = await prisma.location.findMany();
    return NextResponse.json({ locations });
  } catch (error) {
    return NextResponse.json(
      { locations: null },
      { status: 500, headers: { message: "Error fetching locations" } }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { city, country, zip } = body;

  const existingLocation = await prisma.location.findUnique({
    where: { zip: zip },
  });

  if (existingLocation) {
    return NextResponse.json(
      { location: null },
      {
        status: 409,
        headers: { message: "Location with this ZIP code already exists!" },
      }
    );
  } else if (zip) {
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zip)) {
      return NextResponse.json(
        { location: null },
        { status: 400, headers: { message: "Invalid ZIP code" } }
      );
    } else {
      const newLocation = await prisma.location.create({
        data: {
          city,
          country,
          zip,
        },
      });

      return NextResponse.json(newLocation);
    }
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  const accommodationOnLocation = await prisma.accommodation.findFirst({
    where: { locationId: parseInt(id) },
  });

  if (!accommodationOnLocation) {
    try {
      const deletedlocation = await prisma.location.delete({
        where: { id: id },
      });

      if (!deletedlocation) {
        return NextResponse.json({
          status: 404,
          headers: { message: "Location not found!" },
        });
      }
      return NextResponse.json({
        status: 200,
        headers: { message: "Location deleted successfully!" },
      });
    } catch (error) {
      return NextResponse.json(
        { location: null },
        { status: 500, headers: { message: "Error deleting location" } }
      );
    }
  } else {
    return NextResponse.json(
      { location: null },
      {
        status: 500,
        headers: {
          message: "There is accommodation on this location, cannot delete!",
        },
      }
    );
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, city, country, zip } = body;
  try {
    const updated = await prisma.location.update({
      where: { id: id },
      data : {
        city,
        country,
        zip
      }
    });
    if (!updated) {
      return NextResponse.json(
        { location: null },
        { status: 404, headers: { message: "Location not found!" } }
      );
    }

    return NextResponse.json(
      { updated },
      { status: 200, headers: { message: "Location updated successfully!" } }
    );
  } catch (error) {
    return NextResponse.json(
      { location: null },
      { status: 500, headers: { message: "Error updating Location"} }
    );
  }
}
