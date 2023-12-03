const express = require("express");
const router = express.Router();

const authenticatedUsers = [];

//middleware to check authentication
const isAuthenticated = (req, res, next) => {
    const { email, code } = req.query;
    const userIndex = authenticatedUsers.findIndex((u) => u.email === email && u.magicCode === code);

    if (userIndex !== -1) {
        req.isAuthenticated = true;
        next();
    } else {
        return res.send("Invalid link!");
    }
};

router.get('/homepage', isAuthenticated, (req, res) => {
    if (req.isAuthenticated) {
        res.render('homepage');
    } else {
        res.send("Invalid link!");
    }
});

router.get('/welcomepage', (req, res) => {
    res.render('welcomepage');
});

router.get('/email', isAuthenticated, (req, res) => {
    if (req.isAuthenticated) {
        res.render('email');
    } else {
        res.send("Invalid link!");
    }
});

module.exports = {
    router,
    authenticatedUsers
};
