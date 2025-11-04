"use client"

import { useState, useEffect, useCallback} from "react" // <-- Added useEffect
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Megaphone,
  X,
  Plus,
  Calendar,
  Users,
  Eye,
  Trash2,
  Send,
  Clock,
  MapPin,
  Activity,
  LogOut,
  User,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { NotificationCenter } from "@/components/notification-center"
// import { useNotifications } from "@/contexts/notification-context"
// Note: The useEvents context is removed as we are now using direct API calls.

// Define the base URL for your backend API
const API_BASE_URL = "https://campus-connect-1-mkae.onrender.com/api"

interface PRAdminDashboardProps {
  user: { name: string; email: string; role?: string }
  onLogout: () => void
}

// Interfaces updated to match backend (id is number)
interface Announcement {
  id: number
  title: string
  content: string
  priority: string
  status: string
  targetAudience: string
  createdAt: string
  publishedAt?: string
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxAttendees: number
  priority: string
  status: string
  attendees: number
  createdBy?: string
}
// --- ADD THIS INTERFACE (around line 55) ---
interface Registration {
  id: number;
  name: string;
  rollNo: string;
  email: string;
  eventName: string;
  registrationDate: string;
}
interface NewEvent {
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxAttendees: number
  priority: string
}

interface NewAnnouncement {
  title: string
  content: string
  priority: string
  targetAudience: string
}

interface Stats {
  totalEvents: number
  publishedEvents: number
  totalAnnouncements: number
  publishedAnnouncements: number
  totalAttendees: number
}

export function PRAdminDashboard({ user, onLogout }: PRAdminDashboardProps) {
  const { toast } = useToast()
  // const { addNotification } = useNotifications()

  // State to hold data fetched from the API
  const [events, setEvents] = useState<Event[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  // State for new item forms
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "academic",
    maxAttendees: 100,
    priority: "medium",
  })
  const [newAnnouncement, setNewAnnouncement] = useState<NewAnnouncement>({
    title: "",
    content: "",
    priority: "medium",
    targetAudience: "all",
  })


  // --- ADD THESE LINES (around line 112) ---
  const [isViewingAttendees, setIsViewingAttendees] = useState(false);
  const [attendeesList, setAttendeesList] = useState<Registration[]>([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false); // To show loading state

  
  // State for managing modals
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false)

  // Function to fetch all data from the backend
 // --- REPLACE the old fetchData with this new version (around line 124) ---
 const fetchData = useCallback(async () => {
  setIsLoading(true); // Start loading
  try {
    const [eventsRes, announcementsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/events/all`),
      fetch(`${API_BASE_URL}/announcements/all`),
    ])
    if (!eventsRes.ok || !announcementsRes.ok) {
      throw new Error("Failed to fetch data from the server.")
    }
    const eventsData = await eventsRes.json()
    const announcementsData = await announcementsRes.json()
    setEvents(eventsData)
    setAnnouncements(announcementsData)
  } catch (error: any) {
    console.error(error)
    toast({ title: "Error", description: error.message, variant: "destructive" })
  } finally {
      setIsLoading(false); // Stop loading, even if there's an error
  }
}, [toast]); // Dependencies for useCallback

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- Event Handlers ---
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEvent, createdBy: user.email }),
      })
      if (!response.ok) throw new Error("Failed to create the event.")
      setNewEvent({ title: "", description: "", date: "", time: "", location: "", category: "academic", maxAttendees: 100, priority: "medium" })
      setIsCreatingEvent(false)
      fetchData() // Refresh data
      toast({ title: "Event Created", description: "Your event draft has been saved." })
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handlePublishEvent = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/events/${id}/publish`, { method: "PUT" })
      fetchData() // Refresh data
      toast({ title: "Event Published", description: "The event is now live for students." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to publish event.", variant: "destructive" })
    }
  }

  // --- ADD THIS ENTIRE FUNCTION (around line 200) ---
  const handleViewRegistrations = async (eventId: number, eventTitle: string) => {
    setIsLoading(true);
    setSelectedEventTitle(eventTitle);
    try {
        const response = await fetch(`${API_BASE_URL}/registrations/event/${eventId}`);
        if (!response.ok) throw new Error("Could not fetch registrations for this event.");
        const data: Registration[] = await response.json();
        setAttendeesList(data);
        setIsViewingAttendees(true); // This will open the modal
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/events/${id}`, { method: "DELETE" })
      fetchData() // Refresh data
      toast({ title: "Event Deleted", description: "The event has been removed." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" })
    }
  }

  // --- Announcement Handlers ---
  // --- REPLACE the three announcement handlers with these (around line 220) ---
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({ title: "Error", description: "Title and content are required.", variant: "destructive" });
      return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/announcements`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAnnouncement),
        });
        if (!response.ok) throw new Error("Failed to create announcement.");
        setNewAnnouncement({ title: "", content: "", priority: "medium", targetAudience: "all" });
        setIsCreatingAnnouncement(false);
        await fetchData();
        toast({ title: "Announcement Created", description: "Your announcement draft has been saved." });
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handlePublishAnnouncement = async (id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements/${id}/publish`, { method: "PUT" });
        if (!response.ok) throw new Error("Failed to publish announcement.");
        await fetchData();
        toast({ title: "Announcement Published", description: "The announcement is now visible." });
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete announcement.");
        await fetchData();
        toast({ title: "Announcement Deleted", description: "The announcement has been removed." });
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };
  
  // Stats are now derived from the state which is fetched from the API
  const stats: Stats = {
    totalEvents: events.length,
    publishedEvents: events.filter((e) => e.status === "published").length,
    totalAnnouncements: announcements.length,
    publishedAnnouncements: announcements.filter((a) => a.status === "published").length,
    totalAttendees: events.reduce((sum, event) => sum + (event.attendees || 0), 0),
  }

  // --- YOUR ORIGINAL UI IS PRESERVED BELOW ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <header className="relative z-40 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-20 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Club Head Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Manage events and announcements</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <NotificationCenter />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
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
       {/* --- ADD this block right after the <main> tag (around line 241) --- */}
    <div className="flex justify-end mb-8">
        <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
    </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalEvents}</p>
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
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Published Events</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{stats.publishedEvents}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Eye className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-muted/50 to-muted backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Announcements</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalAnnouncements}</p>
                </div>
                <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                  <Megaphone className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{stats.publishedAnnouncements}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Send className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Attendees</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{stats.totalAttendees}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Users className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setIsCreatingEvent(true)}
                className="w-full justify-start bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-3" />
                Create New Event
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button
                onClick={() => setIsCreatingAnnouncement(true)}
                variant="outline"
                className="w-full justify-start hover:bg-accent/10 hover:text-accent hover:border-accent/20 transition-all duration-300 transform hover:scale-[1.02] bg-transparent"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-3" />
                Create New Announcement
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Recent Activity
                </CardTitle>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {events.length} events
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <p className="text-sm text-foreground">Event "Tech Workshop" published</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p className="text-sm text-foreground">Announcement "Library Hours" updated</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <p className="text-sm text-foreground">15 new event registrations today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Event Management
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {events.length} events
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Events Created</h3>
                  <p className="text-muted-foreground mb-6">Create your first event to get started!</p>
                  <Button
                    onClick={() => setIsCreatingEvent(true)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              ) : (
                events.map((event: Event) => (
                  <Card
                    key={event.id}
                    className="group hover:shadow-lg transition-all duration-200 border border-border/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                            <button onClick={() => handleViewRegistrations(event.id, event.title)} className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <Users className="w-3 h-3" />
                                    {event.attendees} attendees
                                  </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={event.status === "published" ? "default" : "secondary"}
                              className={
                                event.status === "published"
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {event.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {event.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {event.status === "DRAFT" && (
                            <Button
                              onClick={() => handlePublishEvent(event.id)}
                              size="sm"
                              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Publish
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteEvent(event.id)}
                            size="sm"
                            variant="destructive"
                            className="hover:bg-destructive/90 transition-all duration-200"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-accent" />
                Announcement Management
              </CardTitle>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                {announcements.length} announcements
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-16">
                  <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Announcements Created</h3>
                  <p className="text-muted-foreground mb-6">Create your first announcement to get started!</p>
                  <Button
                    onClick={() => setIsCreatingAnnouncement(true)}
                    className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <Card
                    key={announcement.id}
                    className="group hover:shadow-lg transition-all duration-200 border border-border/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {announcement.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={announcement.status === "published" ? "default" : "secondary"}
                              className={
                                announcement.status === "published"
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {announcement.status}
                            </Badge>
                            <Badge
                              variant={announcement.priority === "high" ? "destructive" : "outline"}
                              className={
                                announcement.priority === "high" ? "" : "bg-primary/10 text-primary border-primary/20"
                              }
                            >
                              {announcement.priority} priority
                            </Badge>
                            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                              {announcement.targetAudience}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {announcement.status === "DRAFT" && (
                            <Button
                              onClick={() => handlePublishAnnouncement(announcement.id)}
                              size="sm"
                              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transition-all duration-200"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Publish
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            size="sm"
                            variant="destructive"
                            className="hover:bg-destructive/90 transition-all duration-200"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {isCreatingEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-in zoom-in-95 duration-300">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Create New Event
                </CardTitle>
                <Button onClick={() => setIsCreatingEvent(false)} variant="ghost" size="sm" className="hover:bg-muted">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Event Title *</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Description *</label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Date *</label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Time *</label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Location *</label>
                <Input
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter event location"
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
                  <Select
                    value={newEvent.category}
                    onValueChange={(value: string) => setNewEvent({ ...newEvent, category: value })}
                  >
                    <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Max Attendees</label>
                  <Input
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: Number.parseInt(e.target.value) || 100 })}
                    min="1"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <Button
                  onClick={handleCreateEvent}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 h-11"
                >
                  Create Event
                </Button>
                <Button
                  onClick={() => setIsCreatingEvent(false)}
                  variant="outline"
                  className="flex-1 hover:bg-muted transition-all duration-200 h-11"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isCreatingAnnouncement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-in zoom-in-95 duration-300">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-accent" />
                  Create New Announcement
                </CardTitle>
                <Button
                  onClick={() => setIsCreatingAnnouncement(false)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Title *</label>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title"
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Content *</label>
                <Textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Enter announcement content"
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Priority</label>
                  <Select
                    value={newAnnouncement.priority}
                    onValueChange={(value: string) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                  >
                    <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Target Audience</label>
                  <Select
                    value={newAnnouncement.targetAudience}
                    onValueChange={(value: string) => setNewAnnouncement({ ...newAnnouncement, targetAudience: value })}
                  >
                    <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-accent/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="faculty">Faculty Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <Button
                  onClick={handleCreateAnnouncement}
                  className="flex-1 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transition-all duration-300 h-11"
                >
                  Create Announcement
                </Button>
                <Button
                  onClick={() => setIsCreatingAnnouncement(false)}
                  variant="outline"
                  className="flex-1 hover:bg-muted transition-all duration-200 h-11"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


{/* --- ADD THIS ENTIRE MODAL JSX BLOCK (around line 499) --- */}
{isViewingAttendees && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border-0 bg-card/95">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Registrations for "{selectedEventTitle}"
                </CardTitle>
                <Button onClick={() => setIsViewingAttendees(false)} variant="ghost" size="sm" className="hover:bg-muted">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                    <p>Loading attendees...</p>
                </div>
              ) : attendeesList.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground">No students have registered for this event yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium">Name</th>
                                <th className="text-left py-3 px-4 font-medium">Email</th>
                                {/* <th className="text-left py-3 px-4 font-medium">Roll No</th> */}
                                <th className="text-left py-3 px-4 font-medium">Registered On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendeesList.map((reg) => (
                                <tr key={reg.id} className="border-b hover:bg-muted/50">
                                    <td className="py-3 px-4">{reg.name}</td>
                                    <td className="py-3 px-4">{reg.email}</td>
                                    {/* <td className="py-3 px-4">{reg.rollNo}</td> */}
                                    <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(reg.registrationDate).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      

      {/* --- ADD THIS ENTIRE MODAL JSX BLOCK (around line 499) --- */}
{isViewingAttendees && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border-0 bg-card/95">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Registrations for "{selectedEventTitle}"
            </CardTitle>
            <Button onClick={() => setIsViewingAttendees(false)} variant="ghost" size="sm" className="hover:bg-muted">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="h-[200px] flex items-center justify-center"><p>Loading attendees...</p></div>
          ) : attendeesList.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center"><p className="text-muted-foreground">No students have registered for this event yet.</p></div>
          ) : (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead><tr className="border-b"><th className="text-left py-3 px-4 font-medium">Name</th><th className="text-left py-3 px-4 font-medium">Email</th><th className="text-left py-3 px-4 font-medium">Registered On</th></tr></thead>
                    <tbody>
                        {attendeesList.map((reg) => (
                            <tr key={reg.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">{reg.name}</td>
                                <td className="py-3 px-4">{reg.email}</td>
                                {/* <td className="py-3 px-4">{reg.rollNo}</td> */}
                                <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(reg.registrationDate).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
)}

      <Toaster />
    </div>
  )
}
