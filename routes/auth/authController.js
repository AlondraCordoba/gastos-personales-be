const { auth } = require("express-openid-connect");
const express = require("express");
const app = express();

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  //res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

  //If we are already logged in, it will show the dashboard.

  //If we are not logged in, it´ll redirect us to the /login path.
});

app.get("/login", (req, res) => {
  //res.send(JSON.stringify(req.oidc.user));
  //It´ll show the login form
  res.send("Bienvenido")
});

app.post("/login", (req, res) => {
    //res.send(JSON.stringify(req.oidc.user));
    //It´ll receive the credentials
    res.send("Bienvenido")
});
app.listen(80808, () => console.log("Server started"));
