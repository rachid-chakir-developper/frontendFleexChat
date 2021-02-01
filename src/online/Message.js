import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useAuthState } from '../context/auth'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Message({message}) {
  const classes = useStyles();
  const { user } = useAuthState()

  return (
    <div className={classes.root}>
      <Grid container spacing={3} 
      justify={user.email == message.user.email ? "flex-end" : "flex-start"}>
        <Grid item xs={8}>
        <List>
            <ListItem key={message.id}>
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText 
                         align={user.email == message.user.email ? "right" : "left"}
                         primary={
                            <p>{message.content}</p>
                        }></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText 
                        align={user.email == message.user.email ? "right" : "left"}
                        secondary={message.createdAt}></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
        </List>
        </Grid>
      </Grid>
    </div>
  );
}