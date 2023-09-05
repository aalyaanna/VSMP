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
        user: 'soundsendofficial@gmail.com',
        accessToken: 'ya29.a0AfB_byAoyCHTVU5h-vy358guj9YRY1XJqLqoKpmRkdiOEu-iZPEzaITSQK4jka_gpdnZqZztJ4H__mVDU-GpiPiDcZ3W_zEzTG5TFIymd-8T51hcmDjvVuWnZNNYcqPUl91asWC-MFcI3f5_hQoxISQ-v9SI0AP0OeS83gaCgYKAbMSARESFQHsvYlsowRNNY8bRLr1wmn70BK_AQ0173'
    }
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'soundsendofficial@gmail.com',
        pass:'qpiwuiimdiosyzck'
    }
})

//for this part, nakaindicate muna 'yong gmail accounts na se-send-an, will edit this to dynamic
const users = [
    {
        id:1,email:'oshisoffline@gmail.com',magicCode:null

    },
    {
        id:2,email:'mlaoseo@tip.edu.ph',magicCode:null
        
    },
    {
        id:3,email:'magrubaldo@tip.edu.ph',magicCode:null
        
    },
    {
        id:4,email:'maesanjose@tip.edu.ph',magicCode:null
        
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
    res.render('welcomepage', { title : "SoundSend"});
})

// sending magic authentication link
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

// sending emails, to be edit, gagawing dynamic 'yong userEmailAddress
app.post('/send-email', async (req, res) => {
    const { userEmailAddress, recipientEmailAddress, subjectEmail, bodyEmail } = req.body;
  
    const mailOptions = {
      from: 'soundsendofficial@gmail.com',
      to: recipientEmailAddress,
      subject: subjectEmail,
      text: bodyEmail,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 'error', message: 'Error sending email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ status: 'success', message: 'Email sent successfully!' });
        }
    });
});

app.listen(port, ()=>{ console.log("Listening to the server on http://localhost:3000")});
