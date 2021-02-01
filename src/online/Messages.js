import React, {useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SendForm from './SendForm'
import Message from './Message'
import Members from './Members'
import { gql, useLazyQuery } from '@apollo/client'
import { useMessageDispatch, useMessageState } from '../context/message'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingBottom: '100px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const GET_MESSAGES = gql`
  query messages($idChat: Int!) {
    messages(idChat: $idChat) {
      id
      content
      createdAt
      user{
        id
        name
        email
      }
    }
  }
  `
export default function Messages() {
  const classes = useStyles();

  const { conversations } = useMessageState()
  const dispatch = useMessageDispatch()

  const selectedConversation = conversations?.find((c) => c.selected === true)
  const messages = selectedConversation?.messages
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES)

  useEffect(() => {
    if (selectedConversation) {
      getMessages({ variables: { idChat: selectedConversation.id } })
    }
  }, [selectedConversation])

 
  
  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_CONVERSATION_MESSAGES',
        payload: {
          id: selectedConversation.id,
          messages: messagesData.messages,
        },
      })
    }
  }, [messagesData])

  return (
    <div className={classes.root}>
      <Members members={selectedConversation?.users} />
      {
        messages?.map((message, index) => < Message key={index} message={message} />)
      }
      <SendForm selectedConversation={selectedConversation} />
    </div>
  );
}