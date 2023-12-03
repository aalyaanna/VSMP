const express = require("express");
const router = express.Router();

const authenticatedUsers = [];

//middleware to check authentication
const isAuthenticated = (req, res, next) => {
    const { email, code } = req.query;
    const userIndex = authenticatedUsers.findIndex((u) => u.email === email && u.magicCode === code);

    if (userIndex !== -1) {
        authenticatedUsers.splice(userIndex, 1);
        next();
    } else {
        return res.send("Invalid link!");
    }
};

router.get('/homepage', isAuthenticated, (req, res) => {
    res.render('homepage');
});

router.get('/welcomepage', (req, res) => {
    res.render('welcomepage');
});

router.get('/email', isAuthenticated, (req, res) => {
    res.render('email');
});

module.exports = {
    router,
    authenticatedUsers
};
