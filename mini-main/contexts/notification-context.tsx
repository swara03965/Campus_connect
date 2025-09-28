"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  category: string
  priority: "low" | "medium" | "high"
  timestamp: Date
  isRead: boolean
}

interface NotificationState {
  notifications: Notification[]
}

type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Omit<Notification, "id" | "timestamp" | "isRead"> }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "DELETE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_ALL_NOTIFICATIONS" }

interface NotificationContextType {
  state: NotificationState
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  deleteNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  getUnreadCount: () => number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: new Date(),
            isRead: false,
          },
          ...state.notifications,
        ],
      }
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification,
        ),
      }
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      }
    case "DELETE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload),
      }
    case "CLEAR_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      }
    default:
      return state
  }
}

const initialState: NotificationState = {
  notifications: [],
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification })
  }

  const markAsRead = (notificationId: string) => {
    dispatch({ type: "MARK_AS_READ", payload: notificationId })
  }

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_AS_READ" })
  }

  const deleteNotification = (notificationId: string) => {
    dispatch({ type: "DELETE_NOTIFICATION", payload: notificationId })
  }

  const clearAllNotifications = () => {
    dispatch({ type: "CLEAR_ALL_NOTIFICATIONS" })
  }

  const getUnreadCount = (): number => {
    return state.notifications.filter((notification) => !notification.isRead).length
  }

  const value: NotificationContextType = {
    state,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
