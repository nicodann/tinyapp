const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine","ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

//////////// ROUTING BELOW

app.get("/", (_req,res) => {
  res.send("Hello!");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie("username");
  res.redirect("urls");
});

app.get("/urls", (req,res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  // res.send("ok");
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
})


app.get("/urls/:shortURL", (req,res) => {
  const templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] 
  }
  res.render("urls_show", templateVars);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

app.post("/urls/:shortURL/update", (req,res) => {
  urlDatabase[req.params.shortURL] = req.body.newLongURL;
  res.redirect("/urls");
})

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});