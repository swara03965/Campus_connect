"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MainAdminDashboard } from "@/components/main-admin-dashboard"
import { PRAdminDashboard } from "@/components/pr-admin-dashboard"
import { StudentDashboard } from "@/components/student-dashboard"
import { ClubHeadDashboard } from "@/components/club-head-dashboard"
import { NotificationProvider } from "@/contexts/notification-context"
import { EventProvider } from "@/contexts/event-context"
import { GraduationCap, Users, Calendar, Award, ChevronRight, BookOpen, Trophy, Star } from "lucide-react"

interface User {
  email: string
  role: string
  name: string
}

// --- LOGIC UPDATED ---
// This object now ONLY contains the single static main administrator.
const staticUsers = {
  "admin@college.edu": { password: "admin123", role: "main_admin", name: "Main Administrator" },
};

export default function CollegeManagementApp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const { toast } = useToast()

  // --- FULLY UPDATED LOGIC for handleLogin ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Step 1: Check for the static Main Admin.
    const staticUser = staticUsers[email as keyof typeof staticUsers];
    if (staticUser) {
      if (staticUser.password === password) {
        setUser({ email, role: staticUser.role, name: staticUser.name });
        toast({ title: "Login Successful", description: `Welcome back, ${staticUser.name}!` });
      } else {
        toast({ title: "Login Failed", description: "Invalid credentials.", variant: "destructive" });
      }
      setIsLoading(false);
      return; // Stop here if it's the main admin
    }

    // Step 2: If not the Main Admin, try to log in as a PR Admin.
    try {
      const prAdminResponse = await fetch('https://campus-connect-1-mkae.onrender.com/api/login/pr-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (prAdminResponse.ok) {
        const data = await prAdminResponse.json();
        setUser({ email: data.email, role: data.role, name: data.name });
        toast({ title: "Login Successful", description: `Welcome back, ${data.name}!` });
        setIsLoading(false);
        return; // Success, so stop here
      }
    } catch (error) {
      console.error("PR Admin login attempt failed, trying student next...");
    }

    // Step 3: If not a PR Admin, assume it's a Student and try to log in.
    try {
      const studentResponse = await fetch('https://campus-connect-1-mkae.onrender.com/api/login/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await studentResponse.json();

      if (studentResponse.ok) {
        setUser({ email: data.email, role: data.role, name: data.name });
        toast({ title: "Login Successful", description: `Welcome back, ${data.name}!` });
      } else {
        // This is the final error message if all login attempts fail.
        toast({ title: "Login Failed", description: data.message || "Invalid credentials.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- handleRegister logic remains unchanged ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (password !== confirmPassword) {
      toast({ title: "Registration Failed", description: "Passwords do not match.", variant: "destructive" })
      setIsLoading(false)
      return
    }
    try {
      const response = await fetch('https://campus-connect-1-mkae.onrender.com/api/register/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setRegistrationSuccess(true);
        toast({ title: "Registration Submitted", description: "Your account is pending admin approval." });
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast({ title: "Registration Failed", description: data.message || "An error occurred.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Network Error", description: "Could not connect to the registration service.", variant: "destructive" });
    } finally {
      setIsLoading(false)
    }
  }

  // --- handleLogout logic remains unchanged ---
  const handleLogout = () => {
    setUser(null)
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setRole("student")
    setShowLogin(false)
    setIsRegistering(false)
    setRegistrationSuccess(false)
    toast({ title: "Logged Out", description: "You have been successfully logged out." })
  }

  // --- NO CHANGES to any JSX or rendering logic below this line ---

  if (user) {
    return (
      <NotificationProvider>
        <EventProvider>
          {user.role === "main_admin" && <MainAdminDashboard user={user} onLogout={handleLogout} />}
          {user.role === "pr_admin" && <PRAdminDashboard user={user} onLogout={handleLogout} />}
          {user.role === "student" && <StudentDashboard user={user} onLogout={handleLogout} />}
          {user.role === "club_head" && <ClubHeadDashboard user={{...user, id: user.email}} onLogout={handleLogout} />}
          <Toaster />
        </EventProvider>
      </NotificationProvider>
    )
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-300">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {isRegistering ? "Register to join our community" : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {registrationSuccess ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Registration Submitted</h3>
                  <p className="text-muted-foreground">Your account is pending admin approval.</p>
                </div>
                <Button 
                  onClick={() => {
                    setIsRegistering(false)
                    setRegistrationSuccess(false)
                  }}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <>
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20" required/>
                  </div>
                  {isRegistering && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20" required/>
                    </div>
                  )}
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isRegistering ? "Registering..." : "Signing in..."}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {isRegistering ? "Register" : "Sign In"}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
                <div className="text-center">
                  <Button variant="link" onClick={() => setIsRegistering(!isRegistering)} className="text-primary hover:text-primary/80">
                    {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Register"}
                  </Button>
                </div>
                {!isRegistering && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Login Information</span></div>
                    </div>
                    {/* <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">Administrator:</span>
                        <span className="text-muted-foreground font-mono text-xs">admin@college.edu / admin123</span>
                      </div>
                     
                    </div> */}
                  </>
                )}
              </>
            )}
            <Button variant="ghost" onClick={() => setShowLogin(false)} className="w-full text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Button>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <header className="relative z-10 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Campus Connect</h1>
              <p className="text-xs text-muted-foreground">College Management System</p>
            </div>
          </div>
          <Button onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg">
            Sign In
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </header>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Streamline Your College Experience
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive platform connecting students, clubs, and administrators for seamless event management and campus engagement.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg px-8 py-6">
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => { const el = document.getElementById("features-area"); if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }) } }} className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 text-lg px-8 py-6 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <div id="features-area" className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage college events, clubs, and student engagement in one place.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Student Hub</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Discover events, join clubs, and stay connected with campus activities through an intuitive student dashboard.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Event Management</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Create, manage, and promote events with powerful tools for registration, volunteer coordination, and analytics.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Admin Control</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Comprehensive administrative tools for user management, event oversight, and system-wide analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="relative z-10 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2"><BookOpen className="w-6 h-6 text-primary mr-2" /><span className="text-3xl font-bold text-foreground">500+</span></div>
              <p className="text-muted-foreground">Active Students</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2"><Users className="w-6 h-6 text-accent mr-2" /><span className="text-3xl font-bold text-foreground">50+</span></div>
              <p className="text-muted-foreground">Student Clubs</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2"><Calendar className="w-6 h-6 text-primary mr-2" /><span className="text-3xl font-bold text-foreground">200+</span></div>
              <p className="text-muted-foreground">Events Hosted</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2"><Trophy className="w-6 h-6 text-accent mr-2" /><span className="text-3xl font-bold text-foreground">98%</span></div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students and administrators who are already using Campus Connect to enhance their college experience.
          </p>
          <Button size="lg" onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg px-12 py-6">
            Start Your Journey
            <Star className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
      
      <footer className="relative z-10 border-t border-border/50 bg-card/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Campus Connect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Campus Connect. Empowering college communities through technology.
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}
