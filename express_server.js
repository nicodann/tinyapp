const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine","ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  secret: 'monkey madness'
}))

const bcrypt = require('bcrypt');
const getUserByEmail = require('./helpers.js');


const generateRandomString = (length) => {
  let ranString = "";
  const alphNumChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    ranString += alphNumChars.charAt(Math.round(Math.random() * alphNumChars.length));
  }
  return ranString;
}

const urlDatabase = {
  "b2xVn2":{ 
    longURL: "http://www.lighthouselabs.ca", 
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com", 
    userID: "userRandomID"
  },
  "shortURL": {
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
}



const checkLoggedIn = (user) => {
  if (user) {
  return true;
  } else {
    return false;
  }
}

const urlsForUser = (id) => {
  const userURLs = {}
  for (const objectKey in urlDatabase) {
    const objectValue = urlDatabase[objectKey]
    if (objectValue.userID === id) {
      userURLs[objectKey] = objectValue;
    }
  }
  return userURLs;
}


////////////////////////////
//////// GET REQUESTS //////
////////////////////////////

app.get("/", (_req,res) => {
  res.send("Hello!");
});


app.get("/urls", (req,res) => {
  const user = users[req.session.user_id];
  let templateVars = { user, urls: {} };
  if (user) {
    templateVars.urls = urlsForUser(user.id) 
  }; 

  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  
  const user = users[req.session.user_id];
  const templateVars = { user, urls: {} };
  if (user && checkLoggedIn(user)) {
    templateVars.urls = urlsForUser(user.id);
    res.render("urls_new", templateVars);
  } else {
    res.render("login_form", templateVars);
  }
});

app.get("/register", (req,res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  res.render("registration_form", templateVars);
})

app.get("/login", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  res.render("login_form", templateVars);
});


app.get("/urls/:shortURL", (req,res) => {
  const user = users[req.session.user_id];
  const templateVars = { 
    user,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL 
  }
  res.render("urls_show", templateVars);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

/////////////////////////
/////POST REQUESTS///////
/////////////////////////

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { "longURL": req.body.longURL, "userID": req.session.user_id }
  res.redirect(`/urls`);
})

app.post("/login", (req, res) => {
  const currentUser = getUserByEmail(req.body.email, users);
  if (!currentUser) {
    res.status(403).send("Error: this email is not registered.");
    } else if (bcrypt.compareSync(req.body.password, currentUser.password)) {
      res.status(403).send("Error: the password is incorrect.");
    } else { 
      // res.cookie("user_id", currentUser.id);
      req.session.user_id = currentUser.id;
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
  const user = generateRandomString(7);
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[user] = { "id": user, "email": email, "password": hashedPassword };
  // res.cookie("user_id", user);
  req.session.user_id = user;
  res.redirect("/urls");
  }
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const user = users[req.session.user_id];
  if (user && checkLoggedIn(user)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.post("/urls/:shortURL/update", (req,res) => {
  const user = users[req.session.user_id];
  if (user && checkLoggedIn(user)) {
    urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
    res.redirect("/urls");
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});