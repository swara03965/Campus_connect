"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Switch } from "@/components/ui/switch"
import {
  Users, Settings, BarChart3, Shield, Plus, Trash2, Edit, LogOut, Activity,
  TrendingUp, Calendar, Megaphone, X, ChevronRight, Crown, UserCheck, UserX, User, RefreshCw
} from "lucide-react"
import { NotificationCenter } from "@/components/notification-center"

// Interface to match the PR Admin data from the backend
interface PRAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Interface to match the Student data from the backend
interface Student {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface MainAdminDashboardProps {
  user: { name: string; email: string; role?: string }
  onLogout: () => void
}

export function MainAdminDashboard({ user, onLogout }: MainAdminDashboardProps) {
  const { toast } = useToast()
  
  // States for real data, initialized as empty arrays
  const [prAdmins, setPrAdmins] = useState<PRAdmin[]>([]);
  const [pendingUsers, setPendingUsers] = useState<Student[]>([]);
  const [allUsers, setAllUsers] = useState<Student[]>([]);
  
  // UI and form states
  const [newPRAdmin, setNewPRAdmin] = useState({ name: "", email: "", password: "" });
  const [isAddingPRAdmin, setIsAddingPRAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedAllUsers, setHasFetchedAllUsers] = useState(false);

  // --- Reusable Data Fetching Functions ---
  const fetchPrAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://campus-connect-1-mkae.onrender.com/api/admin/pr-admins');
      if (!response.ok) throw new Error("Failed to fetch PR Admins");
      const data = await response.json();
      setPrAdmins(data);
    } catch (error) {
      toast({ title: "Error", description: "Could not load PR Admins.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchPendingUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://campus-connect-1-mkae.onrender.com/api/admin/pending-students');
      if (!response.ok) throw new Error('Failed to fetch pending users');
      const data: Student[] = await response.json();
      setPendingUsers(data);
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch pending approvals.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://campus-connect-1-mkae.onrender.com/api/admin/all-students');
      if (!response.ok) throw new Error('Failed to fetch all users');
      const data: Student[] = await response.json();
      setAllUsers(data);
      setHasFetchedAllUsers(true);
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch all users.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial data fetch on component load
  useEffect(() => {
    fetchPrAdmins();
    fetchPendingUsers();
  }, [fetchPrAdmins, fetchPendingUsers]);

  // --- API Action Handlers ---
  const handleAddPRAdmin = async () => {
    if (!newPRAdmin.name || !newPRAdmin.email || !newPRAdmin.password) {
      toast({ title: "Error", description: "Name, email, and password are required.", variant: "destructive" });
      return;
    }
    try {
      const response = await fetch('https://campus-connect-1-mkae.onrender.com/api/admin/pr-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPRAdmin),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add PR Admin.");
      }
      toast({ title: "Success", description: `${newPRAdmin.name} has been added.` });
      setNewPRAdmin({ name: "", email: "", password: "" });
      setIsAddingPRAdmin(false);
      await fetchPrAdmins(); // Refresh the list
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleApproveUser = async (id: number) => {
    const userToProcess = pendingUsers.find(user => user.id === id);
    if (!userToProcess) return;
    try {
      const response = await fetch(`https://campus-connect-1-mkae.onrender.com/api/admin/students/${id}/approve`, { method: 'POST' });
      if (!response.ok) throw new Error("Approval failed");
      toast({ title: "User Approved", description: `${userToProcess.name} has been approved.` });
      await fetchPendingUsers();
      if (hasFetchedAllUsers) await fetchAllUsers();
    } catch (error) {
      toast({ title: "Error", description: "Approval failed.", variant: "destructive" });
    }
  };

  const handleRejectUser = async (id: number) => {
    const userToProcess = pendingUsers.find(user => user.id === id);
    if (!userToProcess) return;
    try {
      const response = await fetch(`https://campus-connect-1-mkae.onrender.com/api/admin/students/${id}/reject`, { method: 'POST' });
      if (!response.ok) throw new Error("Rejection failed");
      toast({ title: "User Rejected", description: `${userToProcess.name} has been rejected.`, variant: "destructive" });
      await fetchPendingUsers();
    } catch (error) {
      toast({ title: "Error", description: "Rejection failed.", variant: "destructive" });
    }
  };

  // *** NEWLY ADDED FUNCTION ***
  const handleDeletePRAdmin = async (id: number) => {
    // Find the admin's name for a nicer confirmation message
    const adminToDelete = prAdmins.find(admin => admin.id === id);
    const adminName = adminToDelete ? adminToDelete.name : "this user";

    // Good practice: Confirm before deleting
    if (!window.confirm(`Are you sure you want to delete ${adminName}? This action cannot be undone.`)) {
      return; // Stop if the user clicks "Cancel"
    }

    try {
      const response = await fetch(`https://campus-connect-1-mkae.onrender.com/api/admin/pr-admins/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Try to get a specific error message from the backend
        let errorMessage = "Failed to delete PR Admin.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Response wasn't JSON, use the default message
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "Success",
        description: `${adminName} has been deleted.`,
      });

      // Refresh the PR admin list to show the change
      await fetchPrAdmins();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not delete PR Admin.",
        variant: "destructive",
      });
    }
  };
  // *** END OF NEWLY ADDED FUNCTION ***


  const onTabChange = (value: string) => {
    if (value === 'all-users' && !hasFetchedAllUsers) {
      fetchAllUsers();
    }
  };

  const stats = {
    totalPRAdmins: prAdmins.length,
    activePRAdmins: prAdmins.length,
    totalStudents: allUsers.length > 0 ? allUsers.length : 1247,
    totalEvents: 23,
    totalAnnouncements: 45,
    pendingApprovals: pendingUsers.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <header className="relative z-40 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-20 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Administrator Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">System management and oversight</p>
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
                <Button onClick={onLogout} variant="outline" size="sm" className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 bg-transparent">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm font-medium text-muted-foreground">PR Admins</p><p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalPRAdmins}</p></div><div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors"><Users className="w-5 h-5 text-primary" /></div></div></CardContent></Card>
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-sm"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Approvals</p><p className="text-xl sm:text-2xl font-bold text-accent">{stats.pendingApprovals}</p></div><div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors"><UserCheck className="w-5 h-5 text-accent" /></div></div></CardContent></Card>
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-sm"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Admins</p><p className="text-xl sm:text-2xl font-bold text-accent">{stats.activePRAdmins}</p></div><div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors"><Shield className="w-5 h-5 text-accent" /></div></div></CardContent></Card>
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-muted/50 to-muted backdrop-blur-sm"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm font-medium text-muted-foreground">Students</p><p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalStudents}</p></div><div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center group-hover:bg-foreground/20 transition-colors"><Users className="w-5 h-5 text-foreground" /></div></div></CardContent></Card>
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm font-medium text-muted-foreground">Events</p><p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalEvents}</p></div><div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors"><Calendar className="w-5 h-5 text-primary" /></div></div></CardContent></Card>
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm font-medium text-muted-foreground">Announcements</p><p className="text-xl sm:text-2xl font-bold text-accent">{stats.totalAnnouncements}</p></div><div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors"><Megaphone className="w-5 h-5 text-accent" /></div></div></CardContent></Card>
        </div>

        <Tabs defaultValue="pr-admins" className="space-y-6" onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="pr-admins" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">PR Admin Management</TabsTrigger>
            <TabsTrigger value="pending-approvals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pending Approvals</TabsTrigger>
            <TabsTrigger value="all-users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Users</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">System Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="pr-admins" className="space-y-6">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2"><Users className="w-6 h-6 text-primary" /> PR Admin Management</CardTitle>
                    <CardDescription className="text-base">Manage PR Admin accounts and permissions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchPrAdmins} disabled={isLoading}><RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />{isLoading ? 'Refreshing...' : 'Refresh'}</Button>
                    <Button onClick={() => setIsAddingPRAdmin(true)} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg"><Plus className="h-4 w-4 mr-2" />Add PR Admin</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isAddingPRAdmin && (
                  <Card className="mb-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Add New PR Admin</CardTitle>
                        <Button onClick={() => setIsAddingPRAdmin(false)} variant="ghost" size="sm" className="hover:bg-muted"><X className="h-4 w-4" /></Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                          <Input id="name" value={newPRAdmin.name} onChange={(e) => setNewPRAdmin({ ...newPRAdmin, name: e.target.value })} placeholder="Enter full name" className="h-11 mt-2"/>
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                          <Input id="email" type="email" value={newPRAdmin.email} onChange={(e) => setNewPRAdmin({ ...newPRAdmin, email: e.target.value })} placeholder="Enter email" className="h-11 mt-2"/>
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" value={newPRAdmin.password} onChange={(e) => setNewPRAdmin({ ...newPRAdmin, password: e.target.value })} placeholder="Enter temporary password" className="h-11 mt-2"/>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleAddPRAdmin}>Add PR Admin</Button>
                        <Button variant="outline" onClick={() => setIsAddingPRAdmin(false)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <div className="space-y-4">
                  {prAdmins.map((admin) => (
                    <Card key={admin.id} className="group hover:shadow-lg transition-all duration-200 border border-border/50">
                      <CardContent className="p-6">
                        {/* --- UPDATED BLOCK with Delete Button --- */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-primary" /></div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{admin.name}</h3>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                          
                          {/* --- NEW ACTION BUTTONS --- */}
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              onClick={() => handleDeletePRAdmin(admin.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                         {/* --- END OF UPDATED BLOCK --- */}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending-approvals" className="space-y-6">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2"><UserCheck className="w-6 h-6 text-accent" /> Pending Approvals</CardTitle>
                            <CardDescription>Manage user registration approvals</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchPendingUsers} disabled={isLoading}><RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />{isLoading ? 'Refreshing...' : 'Refresh'}</Button>
                    </div>
                </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg"><p className="text-muted-foreground">No pending approvals</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-right py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4"><Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">{user.status}</Badge></td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700" onClick={() => handleApproveUser(user.id)}>Approve</Button>
                                <Button size="sm" variant="outline" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700" onClick={() => handleRejectUser(user.id)}>Reject</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-users" className="space-y-6">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2"><User className="w-6 h-6 text-primary" /> All Users</CardTitle>
                        <CardDescription>Manage all registered users in the system</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchAllUsers} disabled={isLoading}><RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />{isLoading ? 'Refreshing...' : 'Refresh'}</Button>
                </div>
              </CardHeader>
              <CardContent>
                {allUsers.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                    <p className="text-muted-foreground">{hasFetchedAllUsers ? 'No users found' : 'Data will load when this tab is active'}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Role</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">{user.role}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className={user.status === "APPROVED" ? "bg-green-100 text-green-800" : user.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}>
                                {user.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" /> System Analytics
                </CardTitle>
                <CardDescription>View system-wide usage and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-muted/30 border-border/50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent" /> User Registrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">[Chart for registrations over time]</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30 border-border/50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-accent" /> Platform Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">[Chart for user activity]</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-muted/30 border-border/50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-accent" /> User Demographics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">[Demographics breakdown chart]</p>
                      </div>
                    </CardContent>
                  </Card>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" /> System Settings
                </CardTitle>
                <CardDescription>Manage global system configuration and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* --- Registration Settings --- */}
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Registration & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
                      <div>
                        <Label htmlFor="allow-registration" className="font-medium">Allow New User Registrations</Label>
                        <p className="text-sm text-muted-foreground">If disabled, new users cannot create accounts.</p>
                      </div>
                      <Switch id="allow-registration" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="60" className="max-w-xs" />
                      <p className="text-sm text-muted-foreground">Time before an inactive user is logged out.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* --- Danger Zone --- */}
                <Card className="bg-muted/30 border-destructive/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Be careful with these settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-background">
                      <div>
                        <Label htmlFor="maintenance-mode" className="font-medium text-destructive">Enable Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Disables the entire application for all non-admins.</p>
                      </div>
                      <Switch id="maintenance-mode" className="data-[state=checked]:bg-destructive" />
                    </div>
                  </CardContent>
                </Card>

                {/* --- Save Button --- */}
                <div className="flex justify-start pt-4">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}
