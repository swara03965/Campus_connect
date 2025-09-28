"use client"

import { createContext, useContext, useReducer } from "react"

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case "LOGIN_FAILURE":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "LOGOUT":
      return initialState
    default:
      return state
  }
}

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
