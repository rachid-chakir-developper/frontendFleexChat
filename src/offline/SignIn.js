import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as LinkRoute } from "react-router-dom";
import { gql, useMutation } from '@apollo/client'
import { useAuthDispatch } from '../context/auth'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LOGIN_USER = gql`
  mutation login($email: String! $password: String!){
    login(input: {email : $email, password: $password}) {
      name
      email
      token
    }
  }
`

export default function SignIn() {
  const classes = useStyles();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const dispatch = useAuthDispatch()

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onError: (err) => setErrors(err?.graphQLErrors[0]?.extensions?.errors),
    onCompleted(data) {
      console.log(data);
      dispatch({ type: 'LOGIN', payload: data.login })
      window.location.href = '/'
    },
  })

  const submitLoginForm = (e) => {
    e.preventDefault()
    console.log(loginForm);
    loginUser({ variables: loginForm })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Connexion
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitLoginForm}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Addresse mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Se connecter
          </Button>
          <Grid container>
            <Grid item>
              <LinkRoute to="/register">
                <Link  variant="body2">
                  {"Vous n'avez pas de compte ? Inscrivez vous"}
                </Link>
              </LinkRoute>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}