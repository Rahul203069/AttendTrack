//@ts-nocheck
"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, BookOpen, Clock, LogOut, Upload } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Mark Attendance", href: "/dashboard/mark-attendance", icon: Clock },
    { name: "Timetable", href: "/dashboard/timetable", icon: Calendar },
  ];
  
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold">AttendanceTracker</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="px-2 pb-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-background/95 backdrop-blur border-b md:hidden">
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold">AttendanceTracker</span>
            </div>
          </div>
        </div>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}