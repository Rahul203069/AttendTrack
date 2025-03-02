import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import DashboardView from "@/components/dashboard-view";

export default async function DashboardPage() {
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
  
  return <DashboardView user={user} />;
}