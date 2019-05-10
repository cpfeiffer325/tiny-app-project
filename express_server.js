//npm install express
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// ---------------------------- Functions --------------------------------
// ***********************************************************************

function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toString();
}

function emailLookup (email) {
  for (let id in users) {
    console.log(id);
    if (email === users[id].email) {
    return users[id];
    }
  }
}

// ---------------------------- Objects ----------------------------------
// ***********************************************************************


const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};

const users = {
  "userRandomID": {id: "userRandomID", email: "user@example.com", password: "purple-monkey-dinosaur"},
  "user2RandomID": {id: "user2RandomID", email: "user2@example.com", password: "dishwasher-funk"}
};

// ---------------------------- Get Requests -----------------------------
// ***********************************************************************


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// urls page
app.get("/urls", (req, res) => {


  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

// page for adding new urls
app.get("/urls/new", (req, res) => {

  if (!req.cookies.user_id) {
    res.redirect("/login");
  } else {
    console.log("I am creating a new URL");
    let templateVars = {
      urls: urlDatabase,
      username: req.cookies["username"],
      user: users[req.cookies.user_id]
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// single url page
app.get("/urls/:shortURL", (req, res) => {
  console.log('I am showing the new URL');

  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

// registration page for entering email and password
app.get("/register", (req, res) => {
  console.log('User is registering a new email and password');

  let templateVars = {
    email: req.params.email,
    password: req.params.password,
    username: req.cookies["username"],
    user: users[req.cookies.user_id]
  };
  res.render("urls_registration", templateVars);
});

app.get("/login", (req, res) => {
  console.log('User is logging in');

  let templateVars = {
    email: req.params.email,
    password: req.params.password,
    username: req.cookies["username"],
    user: users[req.cookies.user_id]
  };
  res.render("urls_login", templateVars);
});

// ---------------------------- Pull Requests ----------------------------
// ***********************************************************************


// edit an existing url long form
app.post("/urls/:shortURL", (req, res) => {
  console.log('I am editing a URL');

  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;

  res.redirect("/urls");
});

// delete a url from index
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log('I am deleting a URL');
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]; // delete from the database

  res.redirect("/urls");
});

// create a new URL
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;  // Log the POST request body to the console
  console.log(urlDatabase);
  res.redirect("/urls/" + shortURL);
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let user = emailLookup(email);
  // let test = user.email;
  console.log(user);
  // console.log(test);

  if (!req.body.email || !req.body.password) {
    res.send("400 Bad Request");
  } else if (user) {
    res.send("You are already registered");

  } else {
    const userRandomID = generateRandomString();
    users[userRandomID] = {id: userRandomID, email: req.body.email, password: req.body.password};
    res.cookie('user_id', users[userRandomID].id);
    console.log(users);

    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let user = emailLookup(email);
  // let test = user.email;
  console.log(user);
  // console.log(test);

  if (!user) {
    res.send("Error 403...........You are not registered");
  } else if (req.body.password !== user.password) {
    res.send("Error 403...........Ahhhhhhhhhhhh Wrong Password!");
  } else {
    const userRandomID = generateRandomString();
    users[userRandomID] = {id: userRandomID, email: req.body.email, password: req.body.password};
    res.cookie('user_id', users[userRandomID].id);
    console.log(users);

    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  console.log('user is logging out');
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// ---------------------------- Listening Port ---------------------------
// ***********************************************************************

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




//   if (!loggedInUser) {
//     res.sent("Not logged in")
//   }

// }

//   res.json({email, password})
// });
