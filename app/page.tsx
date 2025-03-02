import { Button } from '@/components/ui/button';
import { Calendar, GraduationCap, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">AttendanceTracker</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Track your attendance <span className="text-primary">effortlessly</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Never miss a class again. Upload your timetable, track your attendance, and get insights into your academic performance.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex flex-col items-center text-center space-y-2">
                <Calendar className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">Timetable Upload</h3>
                <p className="text-sm text-muted-foreground">Upload your class schedule and we'll organize it for you</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex flex-col items-center text-center space-y-2">
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">Attendance Analytics</h3>
                <p className="text-sm text-muted-foreground">Get insights into your attendance patterns</p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}