import React, { createContext, useReducer, useContext } from 'react'

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

let user = null
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null
if (currentUser) {
    user = currentUser
} else console.log('No currentUser found')

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('currentUser', JSON.stringify(action.payload))
      return {
        ...state,
        user: action.payload,
      }
    case 'LOGOUT':
      localStorage.removeItem('currentUser')
      return {
        ...state,
        user: null,
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user })

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)