"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";

export default function TimetableView({ timetable }: { timetable: Record<string, Record<string, string | null>> }) {
  const days = Object.keys(timetable);
  const [activeDay, setActiveDay] = useState(days[0]);
  
  return (
   
    
        <Tabs defaultValue={activeDay} onValueChange={setActiveDay}>
          <TabsList className="grid grid-cols-5 mb-4">
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
                {Object.entries(timetable[day]).map(([time, subject]) => (
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
                
                {Object.values(timetable[day]).every(subject => !subject || subject === null) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No classes scheduled for this day
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
     
  );
}