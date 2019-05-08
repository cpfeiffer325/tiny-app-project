//npm install express
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

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

var urlDatabase = {
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

//messing with the code added an extra fun endpoint for practice
app.get("/turkey", (req, res) => {
  res.send("Dinner time, I am hungry for turkey!!!!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// urls page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// page for adding new urls
app.get("/urls/new", (req, res) => {
  console.log("I am creating a new URL");
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// single url page
app.get("/urls/:shortURL", (req, res) => {
  console.log('I am showing the new URL');

  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
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


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});