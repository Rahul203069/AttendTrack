//@ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { format, set } from "date-fns";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Toast } from "./ui/toast";
import TimetableView from "./timetable-view";
import Attendance from "./Attendance";


function getAttendanceStatus(attendance: Record<string, Record<string, string>>, date: string, subject: string): string {
  if (!attendance[date]) {
      return "Not chosen"; // No record for the given date
  }
  
  if (attendance[date][subject] === undefined) {
      return "Not chosen"; // No record for the given subject on that date
  }
  
  return attendance[date][subject]; // Returns "present" or "absent"
}

export default function MarkAttendance({ user }: { user: any }) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date|string>(new Date());
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceForm, setattendanceForm] = useState(null)

const [relode, setrelode] = useState(false)
 

  useEffect(() => {
 

   axios.get(`http://localhost:3000/api/timetable`).then((res)=>{setattendanceForm(res.data);}).catch((err)=>{toast({ title: "Error", description: err.message, variant: "destructive" })})

  
  }, [relode]);
  
  // Extract unique subjects from timetable
  const subjects = new Set<string>();
  Object.values(user.timetable).forEach((day: any) => {
    Object.values(day).forEach((subject: any) => {
      if (subject && subject !== "Lunch" && subject !== null) {
        subjects.add(subject);
      }
    });
  });

  
  
  
  return (
   
     <>
     
        <div className="space-y-2">

          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {setDate(date),console.log}}
                
                initialFocus
                />
            </PopoverContent>
          </Popover>
        </div>
        
       


   

{attendanceForm&&<Attendance setrelode={setrelode} timetable={attendanceForm} date={date} />}


        
       
      
            </>
  );
}