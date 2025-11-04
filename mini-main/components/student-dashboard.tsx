"use client"

import { useState, useEffect, useContext ,useCallback } from "react" // <-- Added useEffect and useContext
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useRegistration } from "@/lib/registration"
import { EventContext } from "@/contexts/event-context"
import {
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Bell,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  LogOut,
  User,
  RefreshCw,
} from "lucide-react"
import { NotificationCenter } from "@/components/notification-center"
// import { useNotifications } from "@/contexts/notification-context"
// Note: The useEvents context is removed as we are now using direct API calls.

// Define the base URL for your backend API
const API_BASE_URL = "https://campus-connect-1-mkae.onrender.com/api"

interface StudentDashboardProps {
  user: {
    email: string
    role: string
    name: string
  }
  onLogout: () => void
}

// Interfaces updated to match backend
interface Announcement {
  id: number
  title: string
  content: string
  priority: string
  isRead: boolean // This will be managed on the client-side
}

interface Event {
  id: number
  title: string
  description?: string
  date: string
  time?: string
  location: string
  category: string
  attendees: number
  maxAttendees: number
  registeredUsers: string[] // This is crucial for registration logic
}

interface Stats {
  upcomingEvents: number
  registeredEvents: number
  unreadAnnouncements: number
  totalEvents: number
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const { toast } = useToast()
  const eventContext = useContext(EventContext)
  const { registerStudent } = useRegistration()
  // const { addNotification } = useNotifications()

  // Master lists of data fetched from the API
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [registering, setRegistering] = useState(false)

  // State for UI controls and derived data
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  // Function to handle event registration
  const handleRegisterForEvent = async (event: Event) => {
    if (registering) return;
    
    setRegistering(true);
    try {
      // Check if the user is already registered
      const isRegistered = event.registeredUsers.includes(user.email);
      if (isRegistered) {
        toast({
          title: "Already Registered",
          description: "You are already registered for this event.",
          variant: "destructive",
        });
        setRegistering(false);
        return;
      }
      
      // Register the student
      const success = await registerStudent({
        eventId: event.id.toString(),
        eventName: event.title,
        studentName: user.name,
        studentEmail: user.email,
        studentRollNo: user.email.split('@')[0] // Using email prefix as roll number for demo
      });
      
      if (success) {
        // Update the UI to reflect the new registration
        setAllEvents(prevEvents => 
          prevEvents.map(e => 
            e.id === event.id 
              ? { 
                  ...e, 
                  attendees: e.attendees + 1,
                  registeredUsers: [...e.registeredUsers, user.email]
                }
              : e
          )
        );
        
        toast({
           title: "Registration Successful",
           description: `You have successfully registered for "${event.title}".`,
           variant: "default",
         });
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

 // --- REPLACE the old fetchData with this new version (around line 145) ---
 const fetchData = useCallback(async () => {
  setIsLoading(true); // Start loading
  try {
    const [eventsRes, announcementsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/events`), // Assuming this gets published events
      fetch(`${API_BASE_URL}/announcements`), // Assuming this gets published announcements
    ]);
    if (!eventsRes.ok || !announcementsRes.ok) {
      throw new Error("Failed to fetch data from the server.");
    }
    const eventsData = await eventsRes.json();
    const announcementsData = (await announcementsRes.json()).map((ann: Omit<Announcement, 'isRead'>) => ({
      ...ann,
      isRead: false,
    }));
    setAllEvents(eventsData);
    setAnnouncements(announcementsData);
  } catch (error: any) {
    console.error(error);
    toast({ title: "Error", description: error.message, variant: "destructive" });
  } finally {
      setIsLoading(false); // Stop loading, even if there's an error
  }
}, [toast]); // Dependencies for useCallback

  // Fetch initial data on component mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Effect for filtering events whenever the master list or filters change
  useEffect(() => {
    let filtered = allEvents
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(event => event.category.toLowerCase() === selectedCategory.toLowerCase())
    }
    setFilteredEvents(filtered)
  }, [searchTerm, selectedCategory, allEvents])

  // Helper to check registration status
  const isUserRegistered = (event: Event): boolean => {
    // Check if event and registeredUsers exist before calling includes
    return event && event.registeredUsers ? event.registeredUsers.includes(user.email) : false
  }

  const handleEventRegistration = async (eventId: number) => {
    const event = allEvents.find(e => e.id === eventId)
    if (!event) return

    const registered = isUserRegistered(event)
    const action = registered ? 'unregister' : 'register'
    
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Action failed. The event might be full.")
      }

      fetchData() // Refresh all data to get latest registration status
      toast({
        title: registered ? "Unregistered" : "Registration Successful",
        description: `You have ${registered ? 'unregistered from' : 'registered for'} "${event.title}".`,
      })
    } catch (error) {
      toast({ title: "Action Failed", description: (error as Error).message, variant: "destructive" })
    }
  }

  // This remains a client-side action
  const handleMarkAsRead = (announcementId: number) => {
    setAnnouncements(
      announcements.map(ann => (ann.id === announcementId ? { ...ann, isRead: true } : ann)),
    )
  }

  // Stats are now derived from live data
  const stats: Stats = {
    totalEvents: allEvents.length,
    upcomingEvents: allEvents.filter(e => new Date(e.date) >= new Date()).length,
    registeredEvents: allEvents.filter(isUserRegistered).length,
    unreadAnnouncements: announcements.filter(a => !a.isRead).length,
  }

  // Derived state for UI lists
  const upcomingEvents = allEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 3)
  const unreadAnnouncements = announcements.filter(a => !a.isRead)

  // --- YOUR ORIGINAL UI IS PRESERVED BELOW ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <header className="relative z-40 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-20 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Student Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Discover events and stay connected</p>
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

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
       {/* --- ADD this block right after the <main> tag (around line 302) --- */}
    <div className="flex justify-end mb-8">
        <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
    </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Upcoming Events</p>
                  <p className="text-xl sm:text-3xl font-bold text-primary">{stats.upcomingEvents}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">My Registrations</p>
                  <p className="text-xl sm:text-3xl font-bold text-accent">{stats.registeredEvents}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Star className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-destructive/5 to-destructive/10 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-xl sm:text-3xl font-bold text-destructive">{stats.unreadAnnouncements}</p>
                </div>
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                  <Bell className="w-5 h-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-muted/50 to-muted backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-xl sm:text-3xl font-bold text-foreground">{stats.totalEvents}</p>
                </div>
                <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                  <TrendingUp className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Events
                </CardTitle>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {upcomingEvents.length} events
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No upcoming events available.</p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="group hover:shadow-lg transition-all duration-200 border border-border/50"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </span>
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant="outline" className="text-xs">
                                {event.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.attendees}/{event.maxAttendees}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleEventRegistration(event.id)}
                            size="sm"
                            variant={isUserRegistered(event) ? "destructive" : "default"}
                            disabled={event.attendees >= event.maxAttendees && !isUserRegistered(event)}
                            className="flex-shrink-0 transition-all duration-200"
                          >
                            {isUserRegistered(event)
                              ? "Unregister"
                              : event.attendees >= event.maxAttendees
                                ? "Full"
                                : "Register"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent" />
                  Recent Announcements
                </CardTitle>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  {unreadAnnouncements.length} unread
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.slice(0, 3).map((announcement) => (
                  <Card
                    key={announcement.id}
                    className="group hover:shadow-lg transition-all duration-200 border border-border/50"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge
                              variant={announcement.priority === "high" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {announcement.priority}
                            </Badge>
                            {!announcement.isRead && (
                              <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        {!announcement.isRead && (
                          <Button
                            onClick={() => handleMarkAsRead(announcement.id)}
                            size="sm"
                            variant="outline"
                            className="flex-shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200"
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                All Events
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary w-fit">
                {filteredEvents.length} events found
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-background/50 border-border/50 focus:bg-background transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 pl-10 h-11 bg-background/50 border-border/50">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {allEvents.length === 0 ? "No Events Available" : "No Matching Events"}
                </h3>
                <p className="text-muted-foreground">
                  {allEvents.length === 0
                    ? "No events available yet. Check back later!"
                    : "Try adjusting your search criteria or browse all categories."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-muted/20"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                              {event.date} at {event.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-accent" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            <span>
                              {event.attendees}/{event.maxAttendees} registered
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/20">
                            {event.category}
                          </Badge>
                          <Button
                            onClick={() => handleEventRegistration(event.id)}
                            size="sm"
                            variant={isUserRegistered(event) ? "destructive" : "default"}
                            disabled={event.attendees >= event.maxAttendees && !isUserRegistered(event)}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            {isUserRegistered(event)
                              ? "Unregister"
                              : event.attendees >= event.maxAttendees
                                ? "Full"
                                : "Register"}
                            <ChevronRight className="w-3 h-3 ml-1" />
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
      </main>

      <Toaster />
    </div>
  )
}
