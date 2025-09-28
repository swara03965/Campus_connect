"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Activity,
  TrendingUp,
  Calendar,
  Megaphone,
  X,
  ChevronRight,
  Crown,
  UserCheck,
  UserX,
  User,
} from "lucide-react"
import { NotificationCenter } from "@/components/notification-center"

interface PRAdmin {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  createdAt: string
  lastLogin: string
}

interface MainAdminDashboardProps {
  user: { name: string; email: string; role?: string }
  onLogout: () => void
}

export function MainAdminDashboard({ user, onLogout }: MainAdminDashboardProps) {
  const { toast } = useToast()
  const [prAdmins, setPrAdmins] = useState<PRAdmin[]>([
    {
      id: "1",
      name: "PR Team Lead",
      email: "pr@college.edu",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20",
    },
    {
      id: "2",
      name: "Marketing Coordinator",
      email: "marketing@college.edu",
      status: "active",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-19",
    },
    {
      id: "3",
      name: "Events Manager",
      email: "events@college.edu",
      status: "inactive",
      createdAt: "2024-01-05",
      lastLogin: "2024-01-15",
    },
  ])

  const [newPRAdmin, setNewPRAdmin] = useState({
    name: "",
    email: "",
  })

  const [isAddingPRAdmin, setIsAddingPRAdmin] = useState(false)

  const handleAddPRAdmin = () => {
    if (!newPRAdmin.name || !newPRAdmin.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    const newAdmin = {
      id: Date.now().toString(),
      name: newPRAdmin.name,
      email: newPRAdmin.email,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
    }

    setPrAdmins([...prAdmins, newAdmin as PRAdmin])
    setNewPRAdmin({ name: "", email: "" })
    setIsAddingPRAdmin(false)

    toast({
      title: "PR Admin Added",
      description: `${newPRAdmin.name} has been added successfully.`,
    })
  }

  const handleToggleStatus = (id: string) => {
    setPrAdmins(
      prAdmins.map((admin) =>
        admin.id === id ? { ...admin, status: admin.status === "active" ? "inactive" : "active" } : admin,
      ),
    )

    toast({
      title: "Status Updated",
      description: "PR Admin status has been updated.",
    })
  }

  const handleDeletePRAdmin = (id: string) => {
    setPrAdmins(prAdmins.filter((admin) => admin.id !== id))
    toast({
      title: "PR Admin Deleted",
      description: "PR Admin has been removed from the system.",
    })
  }

  // Mock user data
  const [pendingUsers, setPendingUsers] = useState([
    { id: "p1", username: "student1", role: "Student", status: "Pending" },
    { id: "p2", username: "faculty1", role: "Faculty", status: "Pending" },
    { id: "p3", username: "staff1", role: "Staff", status: "Pending" }
  ]);

  const [allUsers, setAllUsers] = useState([
    { id: "u1", username: "admin", role: "Admin", status: "Active" },
    { id: "u2", username: "student2", role: "Student", status: "Active" },
    { id: "u3", username: "faculty2", role: "Faculty", status: "Active" },
    { id: "u4", username: "staff2", role: "Staff", status: "Active" },
    { id: "u5", username: "student3", role: "Student", status: "Inactive" }
  ]);

  // Handle user approval
  const handleApproveUser = (id: string) => {
    // In a real app, this would call the API endpoint: /users/{id}/approve
    const approvedUser = pendingUsers.find(user => user.id === id);
    if (approvedUser) {
      // Update the user status and move to all users
      const updatedUser = { ...approvedUser, status: "Active" };
      setAllUsers([...allUsers, updatedUser]);
      // Remove from pending users
      setPendingUsers(pendingUsers.filter(user => user.id !== id));
      
      toast({
        title: "User Approved",
        description: `${approvedUser.username} has been approved successfully.`,
      });
    }
  };

  // Handle user rejection
  const handleRejectUser = (id: string) => {
    // In a real app, this would call the API endpoint: /users/{id}/reject
    const rejectedUser = pendingUsers.find(user => user.id === id);
    if (rejectedUser) {
      // Remove from pending users
      setPendingUsers(pendingUsers.filter(user => user.id !== id));
      
      toast({
        title: "User Rejected",
        description: `${rejectedUser.username}'s application has been rejected.`,
        variant: "destructive"
      });
    }
  };

  const stats = {
    totalPRAdmins: prAdmins.length,
    activePRAdmins: prAdmins.filter((admin) => admin.status === "active").length,
    totalStudents: 1247,
    totalEvents: 23,
    totalAnnouncements: 45,
    pendingApprovals: pendingUsers.length
  }

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">PR Admins</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalPRAdmins}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{stats.pendingApprovals}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <UserCheck className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Admins</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{stats.activePRAdmins}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-muted/50 to-muted backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                </div>
                <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Events</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalEvents}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Announcements</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{stats.totalAnnouncements}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Megaphone className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pr-admins" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger
              value="pr-admins"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              PR Admin Management
            </TabsTrigger>
            <TabsTrigger
              value="pending-approvals"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Pending Approvals
            </TabsTrigger>
            <TabsTrigger
              value="all-users"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All Users
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              System Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pr-admins" className="space-y-6">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Users className="w-6 h-6 text-primary" />
                      PR Admin Management
                    </CardTitle>
                    <CardDescription className="text-base">Manage PR Admin accounts and permissions</CardDescription>
                  </div>
                  <Button
                    onClick={() => setIsAddingPRAdmin(true)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add PR Admin
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isAddingPRAdmin && (
                  <Card className="mb-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Plus className="w-5 h-5 text-primary" />
                          Add New PR Admin
                        </CardTitle>
                        <Button
                          onClick={() => setIsAddingPRAdmin(false)}
                          variant="ghost"
                          size="sm"
                          className="hover:bg-muted"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium text-foreground">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={newPRAdmin.name}
                            onChange={(e) => setNewPRAdmin({ ...newPRAdmin, name: e.target.value })}
                            placeholder="Enter full name"
                            className="h-11 mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={newPRAdmin.email}
                            onChange={(e) => setNewPRAdmin({ ...newPRAdmin, email: e.target.value })}
                            placeholder="Enter email address"
                            className="h-11 mt-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleAddPRAdmin}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                        >
                          Add PR Admin
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingPRAdmin(false)}
                          className="hover:bg-muted transition-all duration-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {prAdmins.map((admin) => (
                    <Card
                      key={admin.id}
                      className="group hover:shadow-lg transition-all duration-200 border border-border/50"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {admin.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{admin.email}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge
                                  variant={admin.status === "active" ? "default" : "secondary"}
                                  className={
                                    admin.status === "active"
                                      ? "bg-accent text-accent-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }
                                >
                                  <div className="flex items-center gap-1">
                                    {admin.status === "active" ? (
                                      <UserCheck className="w-3 h-3" />
                                    ) : (
                                      <UserX className="w-3 h-3" />
                                    )}
                                    {admin.status}
                                  </div>
                                </Badge>
                                <span className="text-xs text-muted-foreground">Created: {admin.createdAt}</span>
                                <span className="text-xs text-muted-foreground">Last Login: {admin.lastLogin}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(admin.id)}
                              className="hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              {admin.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePRAdmin(admin.id)}
                              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
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
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-accent" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Manage user registration approvals</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No pending approvals</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Username</th>
                          <th className="text-left py-3 px-4 font-medium">Role</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-right py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{user.username}</td>
                            <td className="py-3 px-4">{user.role}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                                  onClick={() => handleApproveUser(user.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                                  onClick={() => handleRejectUser(user.id)}
                                >
                                  Reject
                                </Button>
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
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  All Users
                </CardTitle>
                <CardDescription>Manage all registered users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {allUsers.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Username</th>
                          <th className="text-left py-3 px-4 font-medium">Role</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{user.username}</td>
                            <td className="py-3 px-4">{user.role}</td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant="outline" 
                                className={user.status === "Active" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              >
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
                  <BarChart3 className="w-6 h-6 text-accent" />
                  System Analytics
                </CardTitle>
                <CardDescription>Overview of system performance and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Growth</p>
                          <p className="text-2xl font-bold text-primary">+12.5%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Sessions</p>
                          <p className="text-2xl font-bold text-accent">847</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Events This Month</p>
                          <p className="text-2xl font-bold text-primary">15</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">Configure how notifications are sent to users</p>
                    <Button variant="outline" className="hover:bg-primary/10 hover:text-primary bg-transparent">
                      Configure Notifications
                    </Button>
                  </div>
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Security Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage security policies and access controls</p>
                    <Button variant="outline" className="hover:bg-primary/10 hover:text-primary bg-transparent">
                      Security Settings
                    </Button>
                  </div>
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">System Maintenance</h3>
                    <p className="text-sm text-muted-foreground mb-4">Schedule maintenance and system updates</p>
                    <Button variant="outline" className="hover:bg-primary/10 hover:text-primary bg-transparent">
                      Maintenance Schedule
                    </Button>
                  </div>
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
