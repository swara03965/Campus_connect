// Demo data for events and registered students

export const demoEvents = [
  {
    id: "1",
    title: "Annual Tech Symposium",
    description: "Join us for a day of tech talks, workshops, and networking opportunities with industry professionals.",
    date: "2023-11-15",
    time: "10:00 AM",
    location: "Main Auditorium",
    category: "Technology",
    maxAttendees: 200,
    priority: "high",
    status: "published",
    attendees: 45,
    createdBy: "club1",
    registeredUsers: [
      "john.doe@example.com",
      "jane.smith@example.com",
      "alex.wong@example.com",
      "sarah.johnson@example.com",
      "mike.brown@example.com"
    ]
  },
  {
    id: "2",
    title: "Cultural Fest 2023",
    description: "A celebration of diverse cultures through music, dance, food, and art exhibitions.",
    date: "2023-12-05",
    time: "11:00 AM",
    location: "College Grounds",
    category: "Cultural",
    maxAttendees: 500,
    priority: "high",
    status: "published",
    attendees: 120,
    createdBy: "club2",
    registeredUsers: [
      "emma.davis@example.com",
      "ryan.wilson@example.com",
      "olivia.martin@example.com",
      "james.taylor@example.com"
    ]
  },
  {
    id: "3",
    title: "Entrepreneurship Workshop",
    description: "Learn from successful entrepreneurs about starting your own business and securing funding.",
    date: "2023-11-20",
    time: "2:00 PM",
    location: "Business School, Room 101",
    category: "Business",
    maxAttendees: 100,
    priority: "medium",
    status: "published",
    attendees: 78,
    createdBy: "club3",
    registeredUsers: [
      "david.clark@example.com",
      "sophia.lee@example.com",
      "ethan.rodriguez@example.com"
    ]
  },
  {
    id: "4",
    title: "Hackathon 2023",
    description: "A 24-hour coding competition to solve real-world problems with innovative solutions.",
    date: "2023-12-15",
    time: "9:00 AM",
    location: "Computer Science Building",
    category: "Technology",
    maxAttendees: 150,
    priority: "high",
    status: "published",
    attendees: 98,
    createdBy: "club1",
    registeredUsers: [
      "john.doe@example.com",
      "alex.wong@example.com",
      "david.clark@example.com",
      "ryan.wilson@example.com"
    ]
  },
  {
    id: "5",
    title: "Career Fair",
    description: "Connect with recruiters from top companies and explore internship and job opportunities.",
    date: "2023-11-30",
    time: "10:00 AM",
    location: "University Center",
    category: "Career",
    maxAttendees: 300,
    priority: "high",
    status: "published",
    attendees: 210,
    createdBy: "club2",
    registeredUsers: [
      "jane.smith@example.com",
      "sarah.johnson@example.com",
      "emma.davis@example.com",
      "olivia.martin@example.com",
      "sophia.lee@example.com"
    ]
  }
];

export const demoStudentRegistrations = [
  {
    id: "reg1",
    name: "John Doe",
    rollNo: "CS2001",
    email: "john.doe@example.com",
    eventId: "1",
    eventName: "Annual Tech Symposium",
    registrationDate: "2023-10-15T09:30:00Z"
  },
  {
    id: "reg2",
    name: "Jane Smith",
    rollNo: "CS2002",
    email: "jane.smith@example.com",
    eventId: "1",
    eventName: "Annual Tech Symposium",
    registrationDate: "2023-10-16T14:20:00Z"
  },
  {
    id: "reg3",
    name: "Alex Wong",
    rollNo: "CS2003",
    email: "alex.wong@example.com",
    eventId: "1",
    eventName: "Annual Tech Symposium",
    registrationDate: "2023-10-17T11:45:00Z"
  },
  {
    id: "reg4",
    name: "Sarah Johnson",
    rollNo: "CS2004",
    email: "sarah.johnson@example.com",
    eventId: "1",
    eventName: "Annual Tech Symposium",
    registrationDate: "2023-10-18T10:15:00Z"
  },
  {
    id: "reg5",
    name: "Mike Brown",
    rollNo: "CS2005",
    email: "mike.brown@example.com",
    eventId: "1",
    eventName: "Annual Tech Symposium",
    registrationDate: "2023-10-19T16:30:00Z"
  },
  {
    id: "reg6",
    name: "Emma Davis",
    rollNo: "EC2001",
    email: "emma.davis@example.com",
    eventId: "2",
    eventName: "Cultural Fest 2023",
    registrationDate: "2023-11-01T09:00:00Z"
  },
  {
    id: "reg7",
    name: "Ryan Wilson",
    rollNo: "EC2002",
    email: "ryan.wilson@example.com",
    eventId: "2",
    eventName: "Cultural Fest 2023",
    registrationDate: "2023-11-02T13:45:00Z"
  },
  {
    id: "reg8",
    name: "Olivia Martin",
    rollNo: "EC2003",
    email: "olivia.martin@example.com",
    eventId: "2",
    eventName: "Cultural Fest 2023",
    registrationDate: "2023-11-03T10:30:00Z"
  },
  {
    id: "reg9",
    name: "James Taylor",
    rollNo: "EC2004",
    email: "james.taylor@example.com",
    eventId: "2",
    eventName: "Cultural Fest 2023",
    registrationDate: "2023-11-04T15:20:00Z"
  },
  {
    id: "reg10",
    name: "David Clark",
    rollNo: "BU2001",
    email: "david.clark@example.com",
    eventId: "3",
    eventName: "Entrepreneurship Workshop",
    registrationDate: "2023-11-05T11:00:00Z"
  },
  {
    id: "reg11",
    name: "Sophia Lee",
    rollNo: "BU2002",
    email: "sophia.lee@example.com",
    eventId: "3",
    eventName: "Entrepreneurship Workshop",
    registrationDate: "2023-11-06T14:15:00Z"
  },
  {
    id: "reg12",
    name: "Ethan Rodriguez",
    rollNo: "BU2003",
    email: "ethan.rodriguez@example.com",
    eventId: "3",
    eventName: "Entrepreneurship Workshop",
    registrationDate: "2023-11-07T09:45:00Z"
  },
  {
    id: "reg13",
    name: "John Doe",
    rollNo: "CS2001",
    email: "john.doe@example.com",
    eventId: "4",
    eventName: "Hackathon 2023",
    registrationDate: "2023-11-20T10:00:00Z"
  },
  {
    id: "reg14",
    name: "Alex Wong",
    rollNo: "CS2003",
    email: "alex.wong@example.com",
    eventId: "4",
    eventName: "Hackathon 2023",
    registrationDate: "2023-11-21T13:30:00Z"
  },
  {
    id: "reg15",
    name: "David Clark",
    rollNo: "BU2001",
    email: "david.clark@example.com",
    eventId: "4",
    eventName: "Hackathon 2023",
    registrationDate: "2023-11-22T11:15:00Z"
  },
  {
    id: "reg16",
    name: "Ryan Wilson",
    rollNo: "EC2002",
    email: "ryan.wilson@example.com",
    eventId: "4",
    eventName: "Hackathon 2023",
    registrationDate: "2023-11-23T14:45:00Z"
  },
  {
    id: "reg17",
    name: "Jane Smith",
    rollNo: "CS2002",
    email: "jane.smith@example.com",
    eventId: "5",
    eventName: "Career Fair",
    registrationDate: "2023-11-10T09:15:00Z"
  },
  {
    id: "reg18",
    name: "Sarah Johnson",
    rollNo: "CS2004",
    email: "sarah.johnson@example.com",
    eventId: "5",
    eventName: "Career Fair",
    registrationDate: "2023-11-11T11:30:00Z"
  },
  {
    id: "reg19",
    name: "Emma Davis",
    rollNo: "EC2001",
    email: "emma.davis@example.com",
    eventId: "5",
    eventName: "Career Fair",
    registrationDate: "2023-11-12T14:00:00Z"
  },
  {
    id: "reg20",
    name: "Olivia Martin",
    rollNo: "EC2003",
    email: "olivia.martin@example.com",
    eventId: "5",
    eventName: "Career Fair",
    registrationDate: "2023-11-13T10:45:00Z"
  },
  {
    id: "reg21",
    name: "Sophia Lee",
    rollNo: "BU2002",
    email: "sophia.lee@example.com",
    eventId: "5",
    eventName: "Career Fair",
    registrationDate: "2023-11-14T15:30:00Z"
  }
];