
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { parse, format } from 'date-fns';
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


export async function GET(request: Request) {


const datestring= await request.url

console.log(datestring)

  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const email= session.user?.email;
    
    if (!email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    
    const { db } = await connectToDatabase();
    console.log(email)
  //   if(datestring){

    
  // const da= datestring.split("?")[1]
  // const use=    db.collection('users').find(
  //       { 
  //         email: "rs3296472t@gmail.com", 
  //         [`timetable.attendance.${da}`]: { $exists: true } 
  //       },
  //       { projection: { [`timetable.attendance.${da}`]: 1, _id: 0 } }
  //     );
  //   console.log(use)
  //     return NextResponse.json(
  //       { timetable: use },
  //       { status: 200 }
  //     );
  //   }
    const user = await db.collection("users").findOne({
      email: email,
    });
console.log(user)

    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { timetable: user },
      { status: 200 }
    );
  } catch (error) {
  
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}