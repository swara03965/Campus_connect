"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Users,
  Calendar,
  Plus,
  LogOut,
  User,
  Eye,
  FileText,
  ListChecks,
  ClipboardList
} from "lucide-react"
import { NotificationCenter } from "@/components/notification-center"
import { RegistrationTable } from "@/components/registration-table"
import { EventContext } from "@/contexts/event-context"

interface Event {
  id: string
  name: string
  description: string
  date: string
  registrationsCount: number
}

interface Student {
  id: string
  username: string
  name: string
  email: string
}

interface ClubHeadDashboardProps {
  user: { id: string, name: string; email: string; role?: string }
  onLogout: () => void
}

export function ClubHeadDashboard({ user, onLogout }: ClubHeadDashboardProps) {
  const { toast } = useToast()
  const eventContext = useContext(EventContext)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Student[]>([])
  const [showRegistrations, setShowRegistrations] = useState(false)
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: ""
  })
  const [activeTab, setActiveTab] = useState("create-event")

  // Mock data for demonstration
  useEffect(() => {
    // This would be replaced with actual API calls in production
    setEvents([
      {
        id: "1",
        name: "Tech Workshop",
        description: "Learn about the latest technologies",
        date: "2024-10-15",
        registrationsCount: 12
      },
      {
        id: "2",
        name: "Cultural Night",
        description: "Celebrate diversity through performances",
        date: "2024-10-20",
        registrationsCount: 25
      }
    ])
  }, [])

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    // Create new event data
    const newEventData = {
      id: Date.now().toString(),
      name: newEvent.name,
      description: newEvent.description,
      date: new Date().toISOString().split("T")[0],
      registrationsCount: 0,
      createdBy: user.id // Add the club head ID to track event ownership
    }
    
    // Add event to local state
    setEvents([...events, newEventData])
    
    // Add event to context if available
    if (eventContext) {
      try {
        eventContext.addEvent({
          // id: newEventData.id, // Removed as 'id' is not allowed in 'Omit<Event, "id">'
          title: newEventData.name,
          description: newEventData.description,
          date: newEventData.date,
          time: "12:00",
          location: "Campus",
          category: "General",
          maxAttendees: 100,
          priority: "medium",
          status: "published",
          attendees: 0,
          createdBy: user.id
        })
      } catch (error) {
        // If context fails, we still have the local state update
        console.log("Context update failed, but local state was updated");
      }
    }
    
    // Reset form
    setNewEvent({ name: "", description: "" })
    
    // Show success message
    toast({
      title: "Event Created",
      description: `${newEvent.name} has been created successfully.`,
    })
  }

  const handleViewRegistrations = async (eventId: string) => {
    try {
      // In a real app, this would be an API call to GET /events/{id}/registrations
      // const response = await fetch(`/api/events/${eventId}/registrations`);
      // const data = await response.json();
      
      let studentRegistrations = [];
      
      // Use event context if available, otherwise use mock data
      if (eventContext) {
        const contextRegistrations = eventContext.getEventRegistrations(eventId);
        if (contextRegistrations.length > 0) {
          studentRegistrations = contextRegistrations.map(reg => ({
            id: reg.id,
            username: reg.rollNo,
            name: reg.name,
            email: reg.email
          }));
        } else {
          // Mock data for demonstration if no registrations in context
          studentRegistrations = [
            { id: "s1", username: "student1", name: "John Doe", email: "john@example.com" },
            { id: "s2", username: "student2", name: "Jane Smith", email: "jane@example.com" },
            { id: "s3", username: "student3", name: "Bob Johnson", email: "bob@example.com" }
          ];
        }
      } else {
        // Mock data for demonstration
        studentRegistrations = [
          { id: "s1", username: "student1", name: "John Doe", email: "john@example.com" },
          { id: "s2", username: "student2", name: "Jane Smith", email: "jane@example.com" },
          { id: "s3", username: "student3", name: "Bob Johnson", email: "bob@example.com" }
        ];
      }
      
      const event = events.find(e => e.id === eventId);
      setSelectedEvent(event || null);
      setRegistrations(studentRegistrations);
      setShowRegistrations(true);
      
      // Notify user of successful data fetch
      toast({
        title: "Registrations Loaded",
        description: `Loaded ${studentRegistrations.length} registrations for ${event?.name || 'this event'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch registrations. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleBackToEvents = () => {
    setShowRegistrations(false)
    setSelectedEvent(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <header className="relative z-40 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-20 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Club Head Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Manage your club events</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <NotificationCenter />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {showRegistrations ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedEvent?.name} - Registrations</h2>
                <p className="text-muted-foreground">{selectedEvent?.description}</p>
              </div>
              <Button onClick={handleBackToEvents} variant="outline">
                Back to Events
              </Button>
            </div>
            
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Registered Students
                </CardTitle>
                <CardDescription>Students who have registered for this event</CardDescription>
              </CardHeader>
              <CardContent>
                {registrations.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No registrations yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Username</th>
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{student.username}</td>
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4">{student.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="create-event" className="mt-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="create-event" className="data-[state=active]:bg-primary/10">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </TabsTrigger>
              <TabsTrigger value="my-events" className="data-[state=active]:bg-primary/10">
                <Calendar className="w-4 h-4 mr-2" />
                My Events
              </TabsTrigger>
              <TabsTrigger value="registrations" className="data-[state=active]:bg-primary/10">
                <ClipboardList className="w-4 h-4 mr-2" />
                Registrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create-event" className="space-y-6">
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Create New Event
                  </CardTitle>
                  <CardDescription>Fill in the details to create a new event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input 
                      id="event-name" 
                      placeholder="Enter event name" 
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Event Description</Label>
                    <Textarea 
                      id="event-description" 
                      placeholder="Enter event description" 
                      rows={4}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleCreateEvent} className="w-full">
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-events" className="space-y-6">
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <ListChecks className="w-6 h-6 text-primary" />
                    My Events
                  </CardTitle>
                  <CardDescription>Events you have created</CardDescription>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                      <p className="text-muted-foreground">No events created yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <Card key={event.id} className="overflow-hidden border border-border/50 hover:border-border transition-all duration-200">
                          <CardContent className="p-0">
                            <div className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{event.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                      {event.date}
                                    </Badge>
                                    <Badge variant="outline" className="bg-accent/10 text-accent">
                                      {event.registrationsCount} Registrations
                                    </Badge>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => handleViewRegistrations(event.id)} 
                                  variant="outline"
                                  className="shrink-0"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Registrations
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="registrations" className="space-y-6">
              {eventContext && (
                <RegistrationTable 
                  registrations={eventContext.getClubEventRegistrations(user.id)}
                  title="Event Registrations"
                  description="Students who have registered for your events"
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Toaster />
    </div>
  )
}