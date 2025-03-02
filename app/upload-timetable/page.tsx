import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import TimetableUploadForm from "@/components/timetable-upload-form";

export default async function UploadTimetablePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({
    email: session.user?.email,
  });
  
  if (user?.timetableUploaded) {
    redirect("/dashboard");
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Your Timetable</h1>
        <p className="text-muted-foreground mb-8">
          To get started, please upload your timetable. You can either upload an image of your timetable or manually enter your schedule.
        </p>
        <TimetableUploadForm userId={user?._id.toString()} />
      </div>
    </div>
  );
}