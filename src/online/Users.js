import React, {useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { gql, useQuery, useMutation } from '@apollo/client'
import { useMessageDispatch, useMessageState } from '../context/message'

const GET_USERS = gql`
  query users {
    users {
        id
        name
        email
        isOnline
    }
  }
`


const ADD_USER_TO_CHAT = gql`
  mutation addUserToChat($idChat: Int!, $idUser: Int!) {
    addUserToChat(idChat: $idChat, idUser: $idUser) {
        id
        users {
          id
          name
          email
        }
        messages{
          id
          content
          user{
            id
            name
            email
          }
          createdAt
        }
    }
  }
`

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Users() {
  const classes = useStyles();
  const dispatch = useMessageDispatch()
  const { users, isNewChat } = useMessageState()
  const selectedUser = users?.find((u) => u.selected === true)?.id

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) => dispatch({ type: 'SET_USERS', payload: data.users }),
    onError: (err) => console.log(err),
  })
  const [addUSerToChat] = useMutation(ADD_USER_TO_CHAT, {
    onError: (err) => console.log(err),
    onCompleted: (data) => dispatch({ type: 'ADD_CONVERSATION', payload: data.addUserToChat }),
  })
  useEffect(() => {
    if (isNewChat) {
      addUSerToChat({ variables: { idChat: 0, idUser: selectedUser} })
    }
  }, [isNewChat])

  return (
    <List dense className={classes.root}>
      {users?.map((user) => {
        const labelId = `checkbox-list-secondary-label-${user.id}`;
        const selected = selectedUser === user.id
        return (
          <ListItem key={user.id} button
          onClick={() =>
            dispatch({ type: 'SET_SELECTED_USER', payload: user.id })
          }
          selected={selected}>
            
            <ListItemAvatar>
            <Badge badgeContent={''} color="primary" variant="dot" invisible={!user.isOnline} >
              <Avatar
                alt={`Avatar n°${user.id + 1}`}
                src=""
              />
              </Badge>
            </ListItemAvatar>
            <ListItemText id={labelId} primary={`${user.name || 'User chat'}`} />
          </ListItem>
        );
      })}
    </List>
  );
}