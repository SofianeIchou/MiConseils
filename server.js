const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
app = express();
app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());



// set a cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');
  } else {

    // yes, cookie was already present 

  }
  next(); // <-- important!
});
const userService = require("./user_service");


app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await userService.addUser(email, password);
    res.redirect("/profile");
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
app.get("/login", function (req, res) {
  res.render("login.html");
});
app.get("/", function (req, res) {
  res.render("login.html");
});
app.get("/signup", function (req, res) {
  res.render("signup.html");
});

app.get("/profile", function (req, res) {
  res.render("profile.html");
});

app.post("/login", async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await userService.authenticate(email, password);

    //res.json(user);
    //res.end();
    //res.status(200).json(user);
    res.redirect("/profile");
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/listusers", async (req, res) => {
  try {
   const test = await userService.listUsers()
    res.json(test);
  } catch (error) {
    console.log(error)
  }
})

app.post("/resetPassword", async (req, res) => {
  try {
    let email = req.body.email
    await userService.resetPassword(email)
  } catch (err) {
    console.log(err)
  }
})


app.post("/add", async (req, res) => {

  const { email } = req.body;
  try {
    var randomstring = Math.random().toString(36).slice(-8);

    await userService.addUsers(email, randomstring);
    res.redirect("/profile")
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));

