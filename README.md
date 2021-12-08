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
