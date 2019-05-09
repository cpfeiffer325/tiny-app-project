//npm install express
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toString();
}

//npm install ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// function to parse the body of the incoming url

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
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

// page for adding new urls
app.get("/urls/new", (req, res) => {
  console.log("I am creating a new URL");
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
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
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

// registration page for entering email and password
app.get("/register", (req, res) => {
  console.log('Registration page');

  let templateVars = {
    email: req.params.email,
    password: req.params.password,
    username: null
  };
  res.render("urls_registration", templateVars);
});

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
  console.log(email, password);
});


//   let loggedInUSer = null
//   for(userID in userDB) {
//   const user = userDB[userID]
//   if (user.username ==== username && user.password === password) {
//   loggedInUSer = user
//   break
//   }

//   if (!loggedInUSer) {
//     res.sent("Not logged in")
//   }

// }

//   res.json({email, password})
// });

app.post("/login", (req, res) => {
  console.log('user is entering a login name');
  res.cookie("username", req.body.username);
  console.log("Username is: " + req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  console.log('user is logging out');
  res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});