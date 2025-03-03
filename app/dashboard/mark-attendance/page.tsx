//@ts-nocheck
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import MarkAttendance from "@/components/mark-attendance";
import DashboardLayout from "@/components/dashboard-layout";

export default async function MarkAttendancePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({
    email: session.user?.email,
  });
  
  if (!user?.timetableUploaded) {
    redirect("/upload-timetable");
  }
  
  return (
    <DashboardLayout>
   
      <div className="container md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Mark Attendance</h1>
            <p className="text-muted-foreground text-md">
            {user.name},Record your attendance for classes
            </p>
          </div>
        <div className="max-w-md ">
          <MarkAttendance user={user} />
        </div>
      </div>
    </DashboardLayout>
  );
}