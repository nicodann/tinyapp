const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine","ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const generateRandomString = (length) => {
  let ranString = "";
  const alphNumChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    ranString += alphNumChars.charAt(Math.round(Math.random() * alphNumChars.length));
  }
  return ranString;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  }
}

const findEmail = (emailAddress) => {
  for (const user in users) {
    if (users[user].email === emailAddress) {
      return true
    }
  }

  return false;
}
////////////////////////////////////
//////////// ROUTING BELOW//////////
////////////////////////////////////

app.get("/", (_req,res) => {
  res.send("Hello!");
});

app.get("/urls", (req,res) => {
  const user = users[req.cookies.user_id];
  const templateVars = {
    user,
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const user = users[req.cookies.user_id];
  const templateVars = {
    user
  };
  res.render("urls_new", templateVars);
});


app.get("/register", (req,res) => {
  const user = users[req.cookies.user_id];
  const templateVars = { user };
  res.render("registration_form", templateVars);
})

app.get("/login", (req, res) => {
  const user = users[req.cookies.user_id];
  const templateVars = { user };
  res.render("login_form", templateVars);
})


app.get("/urls/:shortURL", (req,res) => {
  const user = users[req.cookies.user_id];
  const templateVars = { 
    user,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] 
  }
  res.render("urls_show", templateVars);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

/////////////////////////
/////POST REQUESTS///////
/////////////////////////

app.post("/urls", (req, res) => {
  // res.send("ok");
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
})

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req,res) => {
  if (req.body.email === '') {
  res.status(400).send("Error: email field is empty");
  } else if (req.body.password === '') {
    res.status(400).send("Error: password field is empty");
  } else if (findEmail(req.body.email)) {
    res.status(400).send("Error: this email is already registered");
  } else {
  const user = generateRandomString(7);
  const email = req.body.email;
  const password = req.body.password;
  users[user] = { "id": user, "email": email, "password": password };
  res.cookie("user_id", user);
  res.redirect("/urls");
  }
});

app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

app.post("/urls/:shortURL/update", (req,res) => {
  console.log("req.body",req.body)
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect("/urls");
})

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});