"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function MarkAttendance({ user }: { user: any }) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract unique subjects from timetable
  const subjects = new Set<string>();
  Object.values(user.timetable).forEach((day: any) => {
    Object.values(day).forEach((subject: any) => {
      if (subject && subject !== "Lunch" && subject !== null) {
        subjects.add(subject);
      }
    });
  });
  
  const handleMarkAttendance = async (status: "present" | "absent") => {
    if (!date || !selectedSubject) {
      toast({
        title: "Missing information",
        description: "Please select a date and subject",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          subject: selectedSubject,
          status,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark attendance");
      }
      
      toast({
        title: "Attendance marked",
        description: `You've marked yourself as ${status} for ${selectedSubject}`,
      });
      
      // Reset selection
      setSelectedSubject("");
    } catch (error) {
      toast({
        title: "Error marking attendance",
        description: "There was an error marking your attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
        <CardDescription>
          Record your attendance for classes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(subjects).map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleMarkAttendance("present")}
            disabled={isSubmitting || !date || !selectedSubject}
          >
            <Check className="mr-2 h-4 w-4" />
            Present
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleMarkAttendance("absent")}
            disabled={isSubmitting || !date || !selectedSubject}
          >
            <X className="mr-2 h-4 w-4" />
            Absent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}