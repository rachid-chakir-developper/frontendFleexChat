
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import { gql, useMutation } from '@apollo/client'

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  form: {
    width : '50%',
  },
  field: {
    background : '#ffffff',
    width : '100%',
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
}));

const SEND_MESSAGE = gql`
  mutation createMessage($content: String!, $idChat: Int!) {
    createMessage(content: $content, idChat: $idChat) {
      id
      content
      createdAt
    }
  }
`

export default function SendForm({selectedConversation}) {
  const classes = useStyles();
  const [content, setContent] = useState('')
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  })
  const submitMessage = (e) => {
    e.preventDefault()

    if (content.trim() === '' || !selectedConversation) return

    setContent('')

    // mutation for sending the message
    sendMessage({ variables: { content, idChat : selectedConversation?.id} })
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
            <div className={classes.grow} />
          <div className={classes.grow} />
          <div className={classes.grow} />
          {selectedConversation ?
              <form className={classes.form} noValidate autoComplete="off"
              onClick={submitMessage}>
                <TextField
                    className={classes.field}
                    id="outlined-multiline-static"
                    multiline
                    rows={1}
                    variant="outlined"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                
                <IconButton type="submit" color="inherit">
                  <SendIcon />
                </IconButton>
              </form>
              : ''
            }
          
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}