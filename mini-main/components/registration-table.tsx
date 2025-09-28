"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StudentRegistration {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  eventId: string;
  eventName: string;
  registrationDate: string;
}

interface RegistrationTableProps {
  registrations: StudentRegistration[];
  title?: string;
  description?: string;
}

export function RegistrationTable({ 
  registrations, 
  title = "Event Registrations", 
  description = "Students who have registered for your events" 
}: RegistrationTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredRegistrations = registrations.filter(reg => 
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    
    const headers = ["Name", "Roll No", "Email", "Event Name", "Registration Date"];
    const csvData = filteredRegistrations.map(reg => [
      reg.name,
      reg.rollNo,
      reg.email,
      reg.eventName,
      new Date(reg.registrationDate).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "event_registrations.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {registrations.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportCSV}
              className="shrink-0"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {registrations.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center border border-dashed rounded-lg p-6 text-center">
            <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No registrations found.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">When students register for an event, they will appear here.</p>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email or event..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Student Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Event Name</th>
                    <th className="text-left py-3 px-4 font-medium">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{registration.name}</td>
                      <td className="py-3 px-4">{registration.email}</td>
                      <td className="py-3 px-4">{registration.eventName}</td>
                      <td className="py-3 px-4">{new Date(registration.registrationDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}