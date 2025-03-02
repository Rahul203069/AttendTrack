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
      <div className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Mark Attendance</h1>
        <div className="max-w-md mx-auto">
          <MarkAttendance user={user} />
        </div>
      </div>
    </DashboardLayout>
  );
}