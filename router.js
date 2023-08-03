const express = require("express");
const router = express.Router();

//routes for homepage, welcomepage and email

router.get('/homepage', (req, res) => {
    res.render('homepage');
});

router.get('/welcomepage', (req, res) => {
    res.render('welcomepage');
});

router.get('/email', (req, res) => {
    res.render('email');
});

module.exports = router;