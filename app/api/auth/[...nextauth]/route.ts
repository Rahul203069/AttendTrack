import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account }: any) {
      try {
        const { db } = await connectToDatabase();
        
        // Check if user exists
        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });
        
        if (!existingUser) {
          // Create new user
          await db.collection("users").insertOne({
            _id: new ObjectId(),
            name: user.name,
            email: user.email,
            image: user.image,
            timetableUploaded: false,
            timetable: null,
            attendance: {},
            createdAt: new Date(),
          });
        }
        
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };