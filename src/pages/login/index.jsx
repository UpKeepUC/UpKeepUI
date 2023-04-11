import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import jwtDecode from "jwt-decode";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        UpKeep
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}



const SignIn = ({ setAuthenticated }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useEffect(() => {
    let token = localStorage.getItem("token");

    if(token !== null){
      let decodedToken = jwtDecode(token);
      console.log("Decoded Token", decodedToken);
      let currentDate = new Date();
    
      // JWT exp is in seconds
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log("Token expired.");
      } else {
        console.log("Valid token");   
        setAuthenticated(true);
        navigate("/home");
      }
    }

  },[]);


  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetchSignIn(data);
  };


  async function fetchSignIn(data) {
    const apiURL = process.env.REACT_APP_API_URL;
      console.log("attempting login");

        //make post call to save
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.get("email"),
            password: data.get("password"),
          }),
        };
        fetch(apiURL + "/Accounts/Login/Login", requestOptions)
          .then((response) => response.text())
          .then((data) => {

            console.log(data);

              setAuthenticated(true);
              localStorage.setItem('token', data);
              navigate("/home");

          });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              variant="filled"
              color="grey"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              variant="filled"
              color="grey"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="UpKeepUI#/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
