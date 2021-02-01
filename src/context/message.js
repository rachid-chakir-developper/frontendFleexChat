import React, { createContext, useReducer, useContext } from 'react'

const MessageStateContext = createContext()
const MessageDispatchContext = createContext()

const messageReducer = (state, action) => {
  let conversationsCopy, conversationIndex,usersCopy
  const { id, messages, message } = action.payload
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload,
      }
      case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      }
    case 'SET_CONVERSATION_MESSAGES':
      conversationsCopy = [...state.conversations]

      conversationIndex = conversationsCopy.findIndex((c) => c.id === id)

      conversationsCopy[conversationIndex] = { ...conversationsCopy[conversationIndex], messages }

      return {
        ...state,
        conversations: conversationsCopy,
      }
    case 'SET_SELECTED_CONVERSATION':
        conversationsCopy = state.conversations.map((conversation) => ({
        ...conversation,
        selected: conversation.id === action.payload,
      }))

      return {
        ...state,
        conversations: conversationsCopy,
      }
      case 'SET_SELECTED_USER':
        usersCopy = state.users.map((user) => ({
        ...user,
        selected: user.id === action.payload,
      }))
      conversationsCopy = [...state.conversations]

      conversationIndex = conversationsCopy.findIndex((c) => c.users.map((u)=> u.id).length <= 2 && c.users.map((u)=> u.id).indexOf(action.payload) >= 0)
      let isHere = conversationsCopy[conversationIndex]?.users.findIndex((u) => u.id == action.payload)
      console.log(action.payload,conversationsCopy[conversationIndex]?.users)
      if(conversationIndex >= 0 && isHere >= 0){
        conversationsCopy = state.conversations.map((conversation) => ({
          ...conversation,
          selected: conversation.id === conversationsCopy[conversationIndex].id,
        }))
  
        state =  {...state, conversations: conversationsCopy}
        state = {...state, isNewChat: false}
      }else{
        state = {...state, isNewChat: true}
        console.log('state',state)
      }
      
      return {
        ...state,
        users: usersCopy,
      }
      case 'ADD_MESSAGE':
        conversationsCopy = [...state.conversations]
        conversationIndex = conversationsCopy.findIndex((c) => c.id === id)
  
        let newConversation = {
          ...conversationsCopy[conversationIndex],
          messages: conversationsCopy[conversationIndex].messages
            ? [...conversationsCopy[conversationIndex].messages, message]
            : null,
          latestMessage: message,
        }
  
        conversationsCopy[conversationIndex] = newConversation
        
        return {
          ...state,
          conversations: conversationsCopy,
        }

        case 'ADD_CONVERSATION':
        action.payload.messages = action.payload.messages ? action.payload.messages : []
        conversationsCopy = [...state.conversations]
        conversationsCopy = [action.payload, ...conversationsCopy]
        
        conversationsCopy = conversationsCopy.map((conversation) => ({
          ...conversation,
          selected: conversation.id === action.payload.id,
        }))

        return {
          ...state,
          conversations: conversationsCopy,
        }

    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { conversations: null, users: null, isNewChat : false })

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  )
}

export const useMessageState = () => useContext(MessageStateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)