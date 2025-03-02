import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import DashboardLayout from "@/components/dashboard-layout";
import TimetableView from "@/components/timetable-view";

export default async function TimetablePage() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-6">Your Timetable</h1>
        <TimetableView timetable={user.timetable} />
      </div>
    </DashboardLayout>
  );
}