# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Home Page](#)
!["Create URL Page"](#)
!["Edit URL Page"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
Default hardcoded users and their corresponding URLs for testing purposes (these objects exist in the server code):

```javascript

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

```
////////
# tinyapp
An app for creating shorter URLs that redirect to longer ones.

Default hardcoded users and their corresponding URLs for testing purposes (these objects exist in the server code):

```javascript

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

```
