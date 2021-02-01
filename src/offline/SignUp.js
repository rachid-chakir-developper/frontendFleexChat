import React , { useState }from 'react';
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const REGISTER_USER = gql`
  mutation register(
    $name: String!
    $email: String!
    $password: String!
  ) {
    register(input: {
        name: $name
        email: $email
        password: $password
      }
    ) {
      name
      email
    }
  }
`

export default function SignUp(props) {
  const classes = useStyles();
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => props.history.push('/login'),
    onError: (err) => setErrors(err?.graphQLErrors[0]?.extensions?.errors),
  })

  const submitRegisterForm = (e) => {
    e.preventDefault()
    registerUser({ variables : registerForm })
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Inscription
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitRegisterForm}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Votre nom"
                autoFocus
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Adresse mail"
                name="email"
                autoComplete="email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            S'inscrire
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
                <LinkRoute to="/login">
                    <Link variant="body2">
                        Vous avez déjà un compte ? Connectez vous
                    </Link>
                </LinkRoute>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}