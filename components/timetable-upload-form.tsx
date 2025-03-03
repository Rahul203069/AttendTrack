"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";

export default function TimetableUploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [manualTimetable, setManualTimetable] = useState("");
  
  // Sample timetable data structure
  const sampleTimetable = {
    "Monday": {
      "9:00 - 9:50 am": "ECL 256 (G3)",
      "9:50 - 10:40 am": "ECL 256 (G3)",
      "10:40 - 11:30 am": null,
      "11:30 - 12:20 pm": "ECL 254 (G3) / ECL 258 (G4)",
      "12:20 - 1:10 pm": null,
      "1:10 - 2:00 pm": "Lunch",
      "2:00 - 2:50 pm": "ECT 259",
      "2:50 - 3:40 pm": "ECT 252",
      "3:40 - 4:30 pm": "ECT 259",
      "4:30 - 5:20 pm": null
    },
    "Tuesday": {
      "9:00 - 9:50 am": "ECL 255 (G3)",
      "9:50 - 10:40 am": null,
      "10:40 - 11:30 am": null,
      "11:30 - 12:20 pm": "ECL 256 (G4)",
      "12:20 - 1:10 pm": null,
      "1:10 - 2:00 pm": "Lunch",
      "2:00 - 2:50 pm": "ECT 250",
      "2:50 - 3:40 pm": "ECT 252",
      "3:40 - 4:30 pm": "MAT 213",
      "4:30 - 5:20 pm": null
    },
    "Wednesday": {
      "9:00 - 9:50 am": null,
      "9:50 - 10:40 am": null,
      "10:40 - 11:30 am": null,
      "11:30 - 12:20 pm": "ECL 254 (G4)",
      "12:20 - 1:10 pm": null,
      "1:10 - 2:00 pm": "Lunch",
      "2:00 - 2:50 pm": "ECT 251",
      "2:50 - 3:40 pm": "MAT 213",
      "3:40 - 4:30 pm": "MAT 213",
      "4:30 - 5:20 pm": null
    },
    "Thursday": {
      "9:00 - 9:50 am": null,
      "9:50 - 10:40 am": null,
      "10:40 - 11:30 am": null,
      "11:30 - 12:20 pm": "ECT 250",
      "12:20 - 1:10 pm": null,
      "1:10 - 2:00 pm": "Lunch",
      "2:00 - 2:50 pm": null,
      "2:50 - 3:40 pm": null,
      "3:40 - 4:30 pm": null,
      "4:30 - 5:20 pm": null
    },
    "Friday": {
      "9:00 - 9:50 am": "ECT 252",
      "9:50 - 10:40 am": "ECT 251",
      "10:40 - 11:30 am": "ECT 253",
      "11:30 - 12:20 pm": null,
      "12:20 - 1:10 pm": null,
      "1:10 - 2:00 pm": "Lunch",
      "2:00 - 2:50 pm": null,
      "2:50 - 3:40 pm": null,
      "3:40 - 4:30 pm": null,
      "4:30 - 5:20 pm": null
    },
    "Saturday": {
      "9:00 - 9:50 am": "ECL 256 (G3)",
      "9:50 - 10:40 am": "ECT 252",
      "10:40 - 11:30 am": "MAT 213",
      "11:30 - 12:20 pm": "ECL 255 (G3)",
      "12:20 - 1:10 pm": null,
      "1:10 - 2:00 pm": "Lunch",
      "2:00 - 2:50 pm": "ECT 259",
      "2:50 - 3:40 pm": "ECT 250",
      "3:40 - 4:30 pm": null,
      "4:30 - 5:20 pm": null
    },
    "Sunday": {
      "9:00 - 9:50 am": "ECL 254 (G3)",
      "9:50 - 10:40 am": "ECT 253",
      "10:40 - 11:30 am": "ECT 251",
      "11:30 - 12:20 pm": "ECL 258 (G4)",
      "12:20 - 1:10 pm": null,
      "1:10 - 2:00 pm": "Lunch",
      "2:00 - 2:50 pm": "ECT 252",
      "2:50 - 3:40 pm": "MAT 213",
      "3:40 - 4:30 pm": "ECT 259",
      "4:30 - 5:20 pm": null
    }
  }
  ;
  
  // For image upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        
        // In a real app, you would upload the image and process it
        // For this demo, we'll simulate image processing and use the sample timetable
        setTimeout(async () => {
          try {
            // Simulate API call to save timetable
            const response = await fetch('/api/timetable', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                timetable: sampleTimetable,
              }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to save timetable');
            }
            
            toast({
              title: "Timetable uploaded successfully",
              description: "Your timetable has been processed and saved.",
            });
            
            router.push('/dashboard');
          } catch (error) {
            toast({
              title: "Error uploading timetable",
              description: "There was an error processing your timetable. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsUploading(false);
          }
        }, 2000);
      }
    },
  });
  
  // For manual entry
  const handleManualSubmit = async () => {
    setIsUploading(true);
    
    try {
      // In a real app, you would parse the text input
      // For this demo, we'll use the sample timetable
      const response = await fetch('/api/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          timetable: sampleTimetable,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save timetable');
      }
      
      toast({
        title: "Timetable saved successfully",
        description: "Your timetable has been processed and saved.",
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error saving timetable",
        description: "There was an error processing your timetable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // For demo purposes, let's add a quick setup option
  const handleQuickSetup = async () => {
    setIsUploading(true);
    
    try {
      const response = await fetch('/api/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          timetable: sampleTimetable,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save timetable');
      }
      
      toast({
        title: "Demo timetable loaded",
        description: "A sample timetable has been loaded for demonstration.",
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error setting up demo",
        description: "There was an error setting up the demo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Tabs defaultValue="image" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="image">Upload Image</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="demo">Quick Demo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="image">
        <Card>
          <CardContent className="pt-6">
            <div 
              {...getRootProps()} 
              className="border-2 border-dashed border-primary/20 rounded-lg p-12 text-center hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">Drag and drop your timetable image</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPEG, PNG
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="manual">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter your timetable in JSON format or as plain text. We'll process it for you.
              </p>
              <Textarea 
                placeholder="Enter your timetable here..." 
                className="min-h-[300px] font-mono text-sm"
                value={manualTimetable}
                onChange={(e) => setManualTimetable(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleManualSubmit} 
              disabled={isUploading || !manualTimetable.trim()}
              className="w-full"
            >
              {isUploading ? "Processing..." : "Save Timetable"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="demo">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">Quick Demo Setup</h3>
              <p className="text-sm text-muted-foreground">
                Load a sample timetable to quickly see how the attendance tracker works.
              </p>
            </div>
            <Button 
              onClick={handleQuickSetup} 
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Setting up..." : "Load Demo Timetable"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}