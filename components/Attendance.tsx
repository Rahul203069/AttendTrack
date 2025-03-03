//@ts-nocheck
"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import TimeSlotCard from "./Card";
function getDayFromDate(dateString:string) {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

function getAttendanceStatus(attendance: Record<string, Record<string, string>>, date: string, subject: string): string {
  if (!attendance[date]) {
      return "Not chosen"; // No record for the given date
  }
  
  if (attendance[date][subject] === undefined) {
      return "Not chosen"; // No record for the given subject on that date
  }
  
  return attendance[date][subject]; // Returns "present" or "absent"
}
export default function Attendance({ timetable,date,setrelode }: {timetable: Record<string, Record<string, string | null>>,date:Date }) {
  const days = Object.keys(timetable.timetable.timetable);
  console.log(days,'s')
  const [activeDay, setActiveDay] = useState(getDayFromDate(date.toString()));

  console.log(getDayFromDate(date.toString()),'hehrhjkjk')
  
  return (
      <>
      
      <Tabs value={getDayFromDate(date.toString())} >
          <TabsList className="hidden grid-cols-5 mb-4">
            {days.map((day) => (
              <TabsTrigger key={day} value={day}>
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {days.map((day) => (
              <TabsContent key={day} value={day} className="space-y-4">
              <h3 className="text-lg font-semibold">{day}'s Schedule</h3>
              <div className="space-y-2">
                {Object.entries(timetable.timetable.timetable[day]).map(([time, subject]) => (
                    subject && subject !== null ? (
                        <TimeSlotCard time={time} setrelode={setrelode} attendance={timetable.timetable.attendance} subject={subject} date={date} />
                    ) : null
                ))}
                
                {Object.values(timetable.timetable.timetable[day]).every(subject => !subject || subject === null) && (
                    <div className="text-center py-8 text-muted-foreground">
                    No classes scheduled for this day
                  </div>
                )}
              </div>
            </TabsContent>
            
          ))}
        </Tabs>
  
          </>
     
  );
}