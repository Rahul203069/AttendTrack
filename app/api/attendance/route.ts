import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { date, subject, status } = await request.json();
    
    if (!date || !subject || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Update attendance record
    await db.collection("users").updateOne(
      { email: session.user?.email },
      {
        $set: {
          [`attendance.${date}.${subject}`]: status,
          updatedAt: new Date(),
        },
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const user = await db.collection("users").findOne(
      { email: session.user?.email },
      { projection: { attendance: 1 } }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ attendance: user.attendance || {} });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}