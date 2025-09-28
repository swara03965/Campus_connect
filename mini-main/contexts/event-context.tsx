"use client"

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"
import { demoEvents, demoStudentRegistrations } from "../lib/demo-data"

interface StudentRegistration {
  id: string
  name: string
  rollNo: string
  email: string
  eventId: string
  eventName: string
  registrationDate: string
}

interface Event {
  id: string
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
  registeredUsers?: string[]
  registrations?: StudentRegistration[]
}

interface EventState {
  events: Event[]
  registrations: StudentRegistration[]
}

type EventAction =
  | { type: "ADD_EVENT"; payload: Event }
  | { type: "PUBLISH_EVENT"; payload: string }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "REGISTER_USER"; payload: { eventId: string; userEmail: string } }
  | { type: "UNREGISTER_USER"; payload: { eventId: string; userEmail: string } }
  | { type: "ADD_STUDENT_REGISTRATION"; payload: StudentRegistration }

interface EventContextType {
  state: EventState
  addEvent: (event: Omit<Event, "id">) => void
  publishEvent: (eventId: string) => void
  deleteEvent: (eventId: string) => void
  registerForEvent: (eventId: string, userEmail: string) => boolean
  unregisterFromEvent: (eventId: string, userEmail: string) => void
  isUserRegistered: (eventId: string, userEmail: string) => boolean
  getUserRegistrations: (userEmail: string) => Event[]
  addStudentRegistration: (registration: Omit<StudentRegistration, "id" | "registrationDate">) => void
  getEventRegistrations: (eventId: string) => StudentRegistration[]
  getClubEventRegistrations: (clubHeadId: string) => StudentRegistration[]
}

export const EventContext = createContext<EventContextType | undefined>(undefined)

const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case "ADD_EVENT":
      return {
        ...state,
        events: [...state.events, { ...action.payload, id: Date.now().toString() }],
      }
    case "PUBLISH_EVENT":
      return {
        ...state,
        events: state.events.map((event) => (event.id === action.payload ? { ...event, status: "published" } : event)),
      }
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      }
    case "REGISTER_USER":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                attendees: event.attendees + 1,
                registeredUsers: [...(event.registeredUsers || []), action.payload.userEmail],
              }
            : event,
        ),
      }
    case "UNREGISTER_USER":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                attendees: Math.max(0, event.attendees - 1),
                registeredUsers: (event.registeredUsers || []).filter((email) => email !== action.payload.userEmail),
              }
            : event,
        ),
      }
    case "ADD_STUDENT_REGISTRATION":
      return {
        ...state,
        registrations: [...state.registrations, action.payload],
        events: state.events.map((event) =>
          event.id === action.payload.eventId
            ? {
                ...event,
                attendees: event.attendees + 1,
                registeredUsers: [...(event.registeredUsers || []), action.payload.email],
                registrations: [...(event.registrations || []), action.payload],
              }
            : event
        ),
      }
    default:
      return state
  }
}

const loadInitialState = (): EventState => {
  if (typeof window === 'undefined') {
    return {
      events: demoEvents,
      registrations: demoStudentRegistrations
    }
  }
  
  try {
    const savedState = localStorage.getItem('eventState')
    return savedState ? JSON.parse(savedState) : {
      events: demoEvents,
      registrations: demoStudentRegistrations
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
    return {
      events: demoEvents,
      registrations: demoStudentRegistrations
    }
  }
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(eventReducer, loadInitialState())
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eventState', JSON.stringify(state))
    }
  }, [state])

  const addEvent = (event: Omit<Event, "id">) => {
    dispatch({ type: "ADD_EVENT", payload: event as Event })
  }

  const publishEvent = (eventId: string) => {
    dispatch({ type: "PUBLISH_EVENT", payload: eventId })
  }

  const deleteEvent = (eventId: string) => {
    dispatch({ type: "DELETE_EVENT", payload: eventId })
  }

  const registerForEvent = (eventId: string, userEmail: string): boolean => {
    const event = state.events.find((e) => e.id === eventId)
    if (!event || event.attendees >= event.maxAttendees) {
      return false
    }
    if (event.registeredUsers?.includes(userEmail)) {
      return false
    }
    dispatch({ type: "REGISTER_USER", payload: { eventId, userEmail } })
    return true
  }

  const unregisterFromEvent = (eventId: string, userEmail: string) => {
    dispatch({ type: "UNREGISTER_USER", payload: { eventId, userEmail } })
  }

  const isUserRegistered = (eventId: string, userEmail: string): boolean => {
    const event = state.events.find((e) => e.id === eventId)
    return event?.registeredUsers?.includes(userEmail) || false
  }

  const getUserRegistrations = (userEmail: string): Event[] => {
    return state.events.filter((event) => event.registeredUsers?.includes(userEmail))
  }

  const addStudentRegistration = (registration: Omit<StudentRegistration, "id" | "registrationDate">) => {
    const event = state.events.find((e) => e.id === registration.eventId)
    if (!event) return

    const newRegistration: StudentRegistration = {
      ...registration,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString(),
      eventName: event.title
    }

    dispatch({ type: "ADD_STUDENT_REGISTRATION", payload: newRegistration })
  }

  const getEventRegistrations = (eventId: string): StudentRegistration[] => {
    return state.registrations.filter((reg) => reg.eventId === eventId)
  }

  const getClubEventRegistrations = (clubHeadId: string): StudentRegistration[] => {
    // Get all events created by this club head
    const clubEvents = state.events.filter((event) => event.createdBy === clubHeadId)
    const clubEventIds = clubEvents.map((event) => event.id)
    
    // Return all registrations for these events
    return state.registrations.filter((reg) => clubEventIds.includes(reg.eventId))
  }

  const value: EventContextType = {
    state,
    addEvent,
    publishEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    isUserRegistered,
    getUserRegistrations,
    addStudentRegistration,
    getEventRegistrations,
    getClubEventRegistrations
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

export function useEvents(): EventContextType {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}
