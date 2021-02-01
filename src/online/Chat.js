import React, {  useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';


import { gql, useSubscription } from '@apollo/client'
import { useAuthDispatch, useAuthState } from '../context/auth'
import { useMessageDispatch } from '../context/message'

import Conversations from './Conversations';
import Users from './Users';
import Messages from './Messages';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingRight : drawerWidth+20
  },
}));

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      id
      userId
      chatId
      content
      createdAt
      user{
        id
        email
      }
      chat{
        id
      }
    }
  }
`

export default function Chat(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <Conversations />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const authDispatch = useAuthDispatch()
  const messageDispatch = useMessageDispatch()

  const { user } = useAuthState()

  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  )
  
  useEffect(() => {
    if (messageError) console.log('messageError', messageError)

    if (messageData) {
      const message = messageData.newMessage

      messageDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: message.chatId,
          message,
        },
      })
    }
  }, [messageError, messageData])

  const logout = () => {
    authDispatch({ type: 'LOGOUT' })
    window.location.href = '/login'
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Chat
          </Typography>
          <Typography variant="h6" className={classes.title}>
            { user.name }
          </Typography>
            <IconButton color="secondary" aria-label="delete" onClick={logout}>
                <PowerSettingsNewIcon />
            </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="right"
      ><div className={classes.toolbar} />
      
        <Users />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Messages />
      </main>
    </div>
  );
}

