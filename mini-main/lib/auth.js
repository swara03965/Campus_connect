// Mock data for demonstration
export const mockUsers = {
  "admin@college.edu": {
    id: "1",
    password: "admin123",
    role: "main_admin",
    name: "Main Administrator",
  },
  "pr@college.edu": {
    id: "2",
    password: "pr123",
    role: "pr_admin",
    name: "PR Team Lead",
  },
  "student@college.edu": {
    id: "3",
    password: "student123",
    role: "student",
    name: "John Student",
  },
}

export const authenticateUser = async (email, password, role) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockUser = mockUsers[email]

  if (mockUser && mockUser.password === password && mockUser.role === role) {
    return {
      id: mockUser.id,
      email,
      role: mockUser.role,
      name: mockUser.name,
      createdAt: new Date(),
    }
  }

  return null
}

export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    main_admin: 3,
    pr_admin: 2,
    student: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
