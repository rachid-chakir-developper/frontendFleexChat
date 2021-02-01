import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { gql, useQuery } from '@apollo/client'
import { useMessageDispatch, useMessageState } from '../context/message'

const GET_CONVERSATIONS = gql`
  query chats {
    chats {
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

export default function Conversations() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([1]);
  const dispatch = useMessageDispatch()
  const { conversations } = useMessageState()
  const selectedConversation = conversations?.find((c) => c.selected === true)?.id

  const { loading } = useQuery(GET_CONVERSATIONS, {
    onCompleted: (data) => dispatch({ type: 'SET_CONVERSATIONS', payload: data.chats }),
    onError: (err) => console.log(err),
  })

  return (
    <List dense className={classes.root}>
      {conversations?.map((conversation) => {
        const labelId = `checkbox-list-secondary-label-${conversation.id}`;
        const selected = selectedConversation === conversation.id
        return (
          <ListItem key={conversation.id} button
          onClick={() =>
            dispatch({ type: 'SET_SELECTED_CONVERSATION', payload: conversation.id })
          }
          selected={selected}>
            <ListItemAvatar>
              <Avatar
                alt={`Avatar n°${conversation.id + 1}`}
                src=""
              />
            </ListItemAvatar>
            <Grid container>
              <Grid item xs={12}>
                <ListItemText id={labelId} primary={`${conversation.users[0].name}`} />
              </Grid>
              <Grid item xs={12}>
                <ListItemText id={labelId+'tt'} secondary={`${conversation.messages[conversation.messages?.length - 1]?.content || 'Envoyer un message...'}`} />
              </Grid>
            </Grid>
          </ListItem>
        );
      })}
    </List>
  );
}