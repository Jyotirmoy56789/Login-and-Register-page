if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const initializepassport = require("./passport-config");
initializepassport(
    passport,
    email => users.find(user => user.email === email)
)

const users = [];

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());

app.get("/", (req, res) => {
    res.render("index.ejs", { name: "jyotirmoy" });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async(req, res) => {
    try {
        const hasedpassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hasedpassword
        })

        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log(users);
});

app.listen(3000);
