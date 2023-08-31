const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');

const path = require('path');
const router = require ('./router');

const nodemailer = require ('nodemailer')
const uuid = require ('uuid')

const app = express();

const port = process.env.PORT || 3000;

//for the access token part, paste your own access token provided on the OAuth playground
//also make sure to use the gmail account you used when you accessed the OAuth playground
const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user: 'oshisoffline@gmail.com',
        accessToken: 'ya29.a0AfB_byDTNS3Mj3hkYfrcyIwA29p5nCLXBatSBS9U6rezAnr73s9axDYJR1McGBnJCzJ1zlVGv6Ti53FTbrZxkVNUil-qp4bX5h8zvhw6txFH0Xo0kMVL9h0--jgWU4ebmgDc85L18BcvC0fe005wudTSb75KREXs6Gp5MgaCgYKAfwSARISFQHsvYlsSDlKtjxdB5Mvn2M4fR-sUw0173'
    }
})

//for this part, as of now naka-indicate muna 'yong emails kung saan s-send 'yong email na may magic link solely for testing, but i will edit this
//you can add your email, just change the id number
const users = [
    {
        id:1,email:'acernliya@gmail.com',magicCode:null

    },
    {
        id:2,email:'mlaoseo@tip.edu.ph',magicCode:null
        
    },
    {
        id:2,email:'magrubaldo@tip.edu.ph',magicCode:null
        
    },
    {
        id:2,email:'maesanjose@tip.edu.ph',magicCode:null
        
    }
]

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

app.post('/login',async (req,res) => {
    const {email} = req.body
    const user = users.find((u) => u.email === email)

    if(!user){
        return res.send("User not found!")
    }

    const magicCode = uuid.v4().substr(0,8)
    user.magicCode = magicCode

    const mailOptions = {
        from:'vsmpofficial@gmail.com',
        to:email,
        subject:'Magic Auth Link',
        html: `
        <p>Click link below to access VSMP Official Web Page.<p>
        <a href="http://localhost:3000/homepage?email=${encodeURIComponent(
            email
        )}&code=${encodeURIComponent(magicCode)}">VSMP Official</a>
        `,
    };
    try{
        await transport.sendMail(mailOptions)
        res.send("Magic Auth Link has been sent to your gmail.")
    }catch(err){
        console.log(err)
        res.send("Error sending email...")
    }
});

//the purpose of this code is to make sure isang beses lang available or pwede ma-access 'yong link
app.get('/homepage',(req,res) => {
    const {email,code} = req.query
    const user = users.find((u) => u.email === email && u.magicCode === code);

    if(!user){
        res.send("Invalid link!")
    }

    user.magicCode = null;
    res.redirect('/')
});

app.listen(port, ()=>{ console.log("Listening to the server on http://localhost:3000")});
