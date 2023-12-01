const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');

const path = require('path');
const router = require('./router');

const nodemailer = require('nodemailer')
const uuid = require('uuid');
const multer = require('multer');

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
const port = process.env.PORT || 3000;

//database connection
// async function connectToDatabase() {
//     try {
//       await prisma.$connect();
//       console.log('Connected to the database');
//     } catch (error) {
//       console.error('Error connecting to the database:', error);
//     }
//   }

//   connectToDatabase();

//transporter for gmail authentication link, change accessToken after expriration 
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'soundsendofficial@gmail.com',
        accessToken: 'ya29.a0AfB_byBodpxcG6yMTr7dV1Iex0Ur6wl9lhu2sqzdSxHUJ1ERa3TeOJKbuBPNGaWvLkoHpihdJBYEwIY2H1ZgWT43jBLsPY7tey21hmUPCivm8_fw3cckVXDU-3rOPMXblwMd1zChIqy6WPl5aClR7x7xcnLYjEiCQrJCaCgYKASUSARESFQGOcNnClejYgPyGm_sEYbtlTtC0eA0171'
    }
})

//this can be use for companies or organization
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'oshisoffline@gmail.com',
        pass: 'txxdvicihtvcgevy'
    }
})

//declare the file path and root directory folder for attaching files
const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

const upload = multer({
    storage: Storage
}).single('attachment');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}))

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public/scripts')))

app.use('/', router);

app.get('/', (req, res) => {
    res.render('welcomepage', {
        title: "SoundSend"
    });
})

//function for sending queries
app.post('/', (req, res) => {
    console.log(req.body);

    const queriesOptions = {
        from: req.body.address,
        to: 'soundsendofficial@gmail.com',
        subject: `Feedback from ${req.body.name} at SoundSend Website`,
        text: `The feedback from ${req.body.address}\nSubject: ${req.body.subject}\nQueries: ${req.body.queries}`
    }

    transporter.sendMail(queriesOptions, (error, info) => {
        try {
            console.log('Email sent: ' + info.response);
            res.send('success');
        } catch (error) {
            console.log(error);
            res.send('error');
        }
    });
});

//passwordless authentication link
app.post('/login', async (req, res) => {
    const {
        email
    } = req.body;

    try {
        const magicCode = uuid.v4().substr(0, 8);

        await prisma.emails.create({
            data: {
                email,
                magicCode,
            }
        });

        const mailOptions = {
            from: 'soundsendofficial@gmail.com',
            to: email,
            subject: 'Magic Auth Link',
            html: `
        <p>Click link below to access SoundSend Official Web Page.<p>
        <a href="http://localhost:3000/homepage?email=${encodeURIComponent(
            email
        )}&code=${encodeURIComponent(magicCode)}">SoundSend Official</a>
        `,
        };

        await transport.sendMail(mailOptions);
        res.status(200).json({
            message: "Magic Auth Link has been sent to your Gmail."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error sending email..."
        });
    }
})

//the purpose of this code is to make sure isang beses lang available or pwede ma-access 'yong link
app.get('/homepage', async (req, res) => {
    const {
        email,
        code
    } = req.query
    const user = users.find((u) => u.email === email && u.magicCode === code);

    if (!user) {
        res.send("Invalid link!")
    }

    user.magicCode = null;
    res.redirect('/')
});

//sending emails, to be edit, gagawing dynamic 'yong userEmailAddress
app.post('/send-email', async (req, res) => {

    upload(req, res, async function (err) {
        if (err) {
            console.log(err);
            return res.end("Something went wrong!");
        }

        const attachment = req.file ? [{
            path: req.file.path
        }] : [];

        const {
            userEmailAddress,
            recipientEmailAddress,
            subjectEmail,
            bodyEmail
        } = req.body;

        const mailOptions = {
            from: userEmailAddress,
            to: recipientEmailAddress,
            subject: subjectEmail,
            text: bodyEmail,
            attachments: attachment,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).json({
                    status: 'error',
                    message: 'Error sending email'
                });
            } else {
                console.log('Email sent: ' + info.response);
                req.body.userEmailAddress = '';
                req.body.recipientEmailAddress = '';
                req.body.subjectEmail = '';
                req.body.bodyEmail = '';
                req.file = null;
                res.status(200).json({
                    status: 'success',
                    message: 'Email sent successfully!'
                });
            }
        });
    })
})

app.listen(port, () => {
    console.log("Listening to the server on http://localhost:3000")
});
