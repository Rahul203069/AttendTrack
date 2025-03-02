
//@ts-nocheck
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
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
    
    const { userId, timetable } = await request.json();
    
    if (!userId || !timetable) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Initialize empty attendance records for each subject in the timetable
    const attendance: Record<string, Record<string, string>> = {};
    
    // Update user with timetable data
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          timetable,
          attendance,
          timetableUploaded: true,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Timetable updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating timetable:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
