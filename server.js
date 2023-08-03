const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const router = require ('./router');
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

// load static assets
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public/assets')))

app.use('/', router);

// base route
app.get('/', (req, res) =>{
    res.render('welcomepage', { title : "VSMP"});
})

app.get('/homepage', (req, res) =>{
    res.render('homepage', { title : "VSMP"});
})

app.listen(port, ()=>{ console.log("Listening to the server on http://localhost:3000")});
