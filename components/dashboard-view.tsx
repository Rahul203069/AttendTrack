
"use client";
  const name=            [
  {
    "Course Title": "Electronics-II",
    "Course Code": "ECT 250"
  },
  {
    "Course Title": "Digital Electronics & Logic Design",
    "Course Code": "ECT 251"
  },
  {
    "Course Title": "Communication Systems-I",
    "Course Code": "ECT 252"
  },
  {
    "Course Title": "Applied EMF and waves",
    "Course Code": "ECT 253"
  },
  {
    "Course Title": "Control Systems",
    "Course Code": "ECT 259"
  },
  {
    "Course Title": "Mathematics IV",
    "Course Code": "MAT 213"
  },
  {
    "Course Title": "Electronics-II Lab",
    "Course Code": "ECL 254"
  },
  {
    "Course Title": "Digital Electronics & Logic Design Lab",
    "Course Code": "ECL 255"
  },
  {
    "Course Title": "Communication-I Lab",
    "Course Code": "ECL 256"
  }
]
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart3, BookOpen, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function DashboardView({ user }: { user: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate attendance statistics
  const subjects = new Set();
  const subjectAttendance: Record<string, { present: number; total: number }> = {};
  
  // Extract subjects from timetable
  Object.values(user.timetable).forEach((day: any) => {
    Object.values(day).forEach((subject: any) => {
      if (subject && subject !== "Lunch" && subject !== null) {
        subjects.add(subject);
        if (!subjectAttendance[subject]) {
          subjectAttendance[subject] = { present: 0, total: 0 };
        }
      }
    });
  });
  
  // Calculate attendance for each subject
  if (user.attendance) {
    Object.entries(user.attendance).forEach(([date, classes]: [string, any]) => {
      Object.entries(classes).forEach(([subject, status]: [string, any]) => {
        if (subjectAttendance[subject]) {
          subjectAttendance[subject].total++;
          if (status === "present") {
            subjectAttendance[subject].present++;
          }
        }
      });
    });
  }
  
  // Calculate overall attendance percentage
  let totalPresent = 0;
  let totalClasses = 0;
  
  Object.values(subjectAttendance).forEach((data) => {
    totalPresent += data.present;
    totalClasses += data.total;
  });
  
  const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  
  // Prepare data for pie chart
  const chartData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalClasses - totalPresent },
  ];
  
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-3))"];
  
  return (
    <div className="flex min-h-screen flex-col md:p-4">

    
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}
            </p>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Overall Attendance
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallPercentage}%</div>
                    <Progress value={overallPercentage} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Classes
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalClasses}</div>
                    <p className="text-xs text-muted-foreground">
                      {totalPresent} classes attended
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subjects
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subjects.size}</div>
                    <p className="text-xs text-muted-foreground">
                      Tracked subjects
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your recent attendance records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>

    
                    <div className="space-y-4">
                      {Object.entries(subjectAttendance).slice(0, 5).map(([subject, data]) => (
                        <div key={subject} className="flex items-center">
                          <div className="w-full space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Progress 
                                value={data.total > 0 ? (data.present / data.total) * 100 : 0} 
                                className="h-2 w-full" 
                              />
                              <span className="ml-2">
                                {data.total > 0 ? Math.round((data.present / data.total) * 100) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="subjects" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from(subjects).map((subject: any) => {
                  const data = subjectAttendance[subject];
                  const percentage = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
                  
                  return (
                    <Card key={subject}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{subject}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{percentage}%</div>
                        <Progress value={percentage} className="mt-2" />
                        <p className="mt-2 text-xs text-muted-foreground">
                          {data.present} of {data.total} classes attended
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="timetable" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Timetable</CardTitle>
                  <CardDescription>
                    Your class schedule for the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {Object.entries(user.timetable).map(([day, schedule]: [string, any]) => (
                      <div key={day} className="space-y-2">
                        <h3 className="font-semibold">{day}</h3>
                        <div className="space-y-2">
                          {Object.entries(schedule).map(([time, subject]: [string, any]) => (
                            subject && subject !== null ? (
                              <div key={time} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center space-x-3">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{time}</span>
                                </div>
                                <div className="text-sm font-medium">{subject}</div>
                              </div>
                            ) : null
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}