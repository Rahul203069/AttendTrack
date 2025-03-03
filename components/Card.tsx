//@ts-nocheck
"use client"
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format, set } from 'date-fns';
import { Clock, Check, X } from 'lucide-react';
import { Toast } from './ui/toast';
import { Snippet } from 'next/font/google';
import { ClipLoader } from 'react-spinners';
interface TimeSlotCardProps {
  time: string;
  subject: string;
  date:string
  attendance: any
}


function getAttendanceStatus(
  attendance: Record<string, Record<string, Record<string, string>>>,
  date: string,
  subject: string,
  time?: string
): string {

  console.log(attendance[  format(date, "yyyy-MM-dd")],  format(date, "yyyy-MM-dd"))
  
  const dat = format(date, "yyyy-MM-dd");
  if (!attendance[dat]) {
      return "Not chosen"; // No record for the given date
  }
  
  if (!attendance[dat][subject]) {
      return "Not chosen"; // No record for the given subject on that date
  }

  // if (time) {
  //     // If a specific time is provided, check within the subject's attendance
  //     return attendance[dat][subject][time] ?? "Not chosen";
  // }

  // If no specific time is provided, return general attendance status
  console.log(attendance[dat][subject],'hj')
  if(attendance[dat][subject]){
return attendance[dat][subject]
  }
  return 'Not chosen'
}
const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ time, subject,date,attendance,setrelode, }) => {
  const [attendanc, setAttendanc] = useState<'present' | 'absent' | null>(null);
const [IsSubmitting, setIsSubmitting] = useState(false)
  const markPresent = () => {
    console.log(time,subject,date)
    setAttendanc('present');
  };

  const markAbsent = () => {
    setAttendanc('absent');
  };

  const resetAttendance = () => {
    setAttendanc(null);
  };


const {toast} = useToast()


const [aloader, setaloader] = useState(false)
const [ploader, setploader] = useState(false)

const handleMarkAttendance = async (status) => {
  if(status === 'present'){
    setaloader(true)
  }

  if(status === 'absent'){
    setploader(true)
  }
    if (!date || !subject) {
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
          subject: subject,
          status,
        }),
      })
    
      if (!response.ok) {
        throw new Error("Failed to mark attendance");
      }
      
      toast({
        title: "Attendance marked",
        description: `You've marked yourself as ${status} for ${subject}`,
      });
      
      // Reset selection
   
    } catch (error) {
      toast({
        title: "Error marking attendance",
        description: "There was an error marking your attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
     
      setaloader(false)
      setploader(false)
      setIsSubmitting(false);
      setrelode((prev)=>!prev)
    }
  };











  return (
    <div className="flex justify-between items-center p-3 rounded-lg border hover:shadow-md transition-shadow " onClick={()=>{console.log(getAttendanceStatus(attendance,date,subject,time),'babay')}}>
      <div className="flex items-center">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="ml-3 text-sm font-medium">{time}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{subject}</span>
        {getAttendanceStatus(attendance,date,subject,time) === 'Not chosen' ? (
          <div className="flex gap-2">
            <button 
              onClick={()=>{handleMarkAttendance('present')}}
              className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-all hover:shadow-sm"
              aria-label="Mark present"
            >
            {aloader?

<ClipLoader size={10}></ClipLoader>
:<Check className="w-3 h-3" />
}
              <span className="text-xs font-medium">Present</span>
            </button>
            <button 
              onClick={()=>{handleMarkAttendance('absent')}}
              className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-all hover:shadow-sm"
              aria-label="Mark absent"
            >
                 {ploader?

<ClipLoader size={10}></ClipLoader>
:<X className="w-3 h-3" />
}
              <span className="text-xs font-medium">Absent</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${
              getAttendanceStatus(attendance,date,subject,time) === 'present' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              { getAttendanceStatus(attendance,date,subject,time) === 'present' ? (
                <>{aloader?

                  <ClipLoader size={10}></ClipLoader>
                  :<Check className="w-3 h-3" />
                }
                  <span>Present</span>
                </>
              ) : (
                <>
                {aloader?

<ClipLoader size={10}></ClipLoader>
:<X className="w-3 h-3" />
}
                
                  <span>Absent</span>
                </>
              )}
            </div>
            <button 
              onClick={resetAttendance}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Reset attendance" >

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotCard;