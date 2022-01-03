const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const { generateRandomString, getUserByEmail, urlsForUser, addNewUser } = require('./helpers.js');

const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2":{
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID"
  },
  "tT7m4K": {
    longURL: "http://www.blargle.com",
    userID: "user3RandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "user3RandomID",
    email: "user3@example.com",
    password: "dishwasher"
  }
};

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({ name: 'session', secret: 'monkey madness'}));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

/// HASH DEFAULT USER PASSWORDS

for (const user in users) {
  users[user].password = bcrypt.hashSync(users[user].password, 10);
}

////////////////////////////
//////// GET REQUESTS //////
////////////////////////////

app.get("/", (_req,res) => {
  res.send("Hello!");
});


app.get("/urls", (req,res) => {
  const user = users[req.session.userID];
  const templateVars = { user, urls: {} };

  if (user) {
    templateVars.urls = urlsForUser(user.id, urlDatabase);
  }

  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const user = users[req.session.userID];
  const templateVars = { user, urls: {} };

  if (user) {
    templateVars.urls = urlsForUser(user.id, urlDatabase);
    res.render("urls_new", templateVars);
  } else {
    res.render("login_form", templateVars);
  }

});

app.get("/register", (req,res) => {
  const user = users[req.session.userID];
  const templateVars = { user };
  res.render("registration_form", templateVars);
});

app.get("/login", (req, res) => {
  const user = users[req.session.userID];
  const templateVars = { user };
  res.render("login_form", templateVars);
});


app.get("/urls/:shortURL", (req,res) => {
  const user = users[req.session.userID];
  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

/////////////////////////
/////POST REQUESTS///////
/////////////////////////

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { "longURL": req.body.longURL, "userID": req.session.userID };
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  const currentUser = getUserByEmail(req.body.email, users);
  if (!currentUser) {
    res.status(403).send("Error: this email is not registered.");
  } else if (!bcrypt.compareSync(req.body.password, currentUser.password)) {
    res.status(403).send("Error: the password is incorrect.");
  } else {
    req.session.userID = currentUser.id;
    res.redirect("/urls");
  }
});

app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req,res) => {
  if (req.body.email === '') {
    res.status(400).send("Error: email field is empty");
  } else if (req.body.password === '') {
    res.status(400).send("Error: password field is empty");
  } else if (getUserByEmail(req.body.email, users)) {
    res.status(400).send("Error: this email is already registered");
  } else {
    const user = addNewUser(req);
    users[user.id] = user;
    req.session.userID = user.id;
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const user = users[req.session.userID];

  if (user) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.post("/urls/:shortURL/update", (req,res) => {
  const user = users[req.session.userID];

  if (user) {
    urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
    res.redirect("/urls");
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/hello", (_req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});