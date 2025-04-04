const express = require("express");
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/user.models");
const Quote = require("./models/quote.models")
const jwt = require("jsonwebtoken")
const Chance = require("chance")
const nodemailer = require('nodemailer');
const patientRoutes = require('./routers/patient.routes');
let chance = new Chance();
let code = chance.zip()
app.use(cors())

app.use(express.json())
app.use('/api/patient', patientRoutes);
let connectionStatus = false;
let user_email = "jadu";

const uri = "mongodb+srv://DSANEXUS:DSANEXUS@cluster0.lwismb9.mongodb.net/ems?retryWrites=true&w=majority";

async function connect() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}

connect();

app.post('/api/register', async (req, resp) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password })
        console.log("passed")
        resp.json({ status: "ok", user: "ok" })
    }
    catch (err) {
        // resp.json({status:"error",error:{err}})
        if (err.code == 11000) {
            resp.json({ status: "duplicate email" })
        }
    }
})
// console.log(user_email)
app.post('/api/login', async (req, resp) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            const token = jwt.sign(
                {
                    email: user.email,
                    name: user.name,
                },
                "secret1234"
            );

            resp.json({
                status: "ok",
                user: token,       // ✅ JWT token
                userId: user._id,  // ✅ MongoDB user ID
            });
        } else {
            resp.json({ status: "error", user: "false" });
        }
    } catch (err) {
        console.error("Login error:", err);
        resp.status(500).json({ status: "error", message: "Internal server error" });
    }
});
app.post('/api/sendCode', async (req, resp) => {
    const { email } = req.body
    const user = await User.findOne({ email: email })
    if (user) {
        code = chance.zip()
        console.log(code)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            pool: true,
            auth: {
                user: "gdxr.reset@gmail.com",
                pass: "isvc llwg zbuq wovw",
            },
        });
        const mailOptions = {
            from: 'gdxr.reset@gmail.com',
            to: email,
            subject: `Password Reset!!`,
            text: `Reset code is ${code}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        transporter.close()
        resp.json({ status: "ok" })
    }
    else {
        resp.json({ status: "invalid" })
    }

})
app.get('/api/admin', async (req, resp) => {
    const token = req.headers["x-access-token"];

    try {
        const decoded = jwt.verify(token, "secret1234");

        // Check if the user is an admin (you can replace this condition with your actual logic)
        if (decoded && decoded.isAdmin) {
            resp.json({ status: "ok", message: "Welcome, Admin!" });
        } else {
            resp.status(403).json({ status: "error", error: "Forbidden" });
        }
    } catch (err) {
        console.log(err);
        resp.json({ status: "error", error: "invalid-token" });
    }
});
port  = process.env.PORT || 4000 ;
app.listen(4000, () => {
    console.log(`running on port ${4000}`)
}) 