const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const user = require('./model/database')
const admin = require('./model/admin')
require('dotenv').config({ path: './pass.env' })
app.set("trust proxy", 1)


//connect database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database Connected!'))
    .catch((err) => {
        console.error('DB Connection Failed:', err);
        process.exit(1); // Exit if DB fails
    })

//session (FIXED)
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false,
}))

//all middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('pubic'))
//my middleware(isLogin)
let isLogin = (req, res, next) => {
    if (req.session.key) {
        return next();
    }
    res.redirect('/login');
}

//all routes
app.get('/registration', (req, res) => {
    res.render('registration', { msg: null })
})

app.get('/login', (req, res) => {
    res.render('login', { msg: null })
})

app.get('/', isLogin, (req, res) => {
    res.render('next')
})

app.post('/registration', async (req, res) => {
    try {
        const { email, password } = req.body
        await admin.create({ email, password })
        const hashedPassword = await bcrypt.hash(password, 10)
        await user.create({ email, password: hashedPassword })

        res.render('registration', {
            msg: 'Registration Successful'
        });
    } catch (err) {
        console.log(err);
        res.render('registration', {
            msg: 'User already exists or error occurred'
        });
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user1 = await user.findOne({ email })

        if (!user1)
            return res.render('login', { msg: 'User not found' })

        const isMatch = await bcrypt.compare(password, user1.password)

        if (!isMatch)
            return res.render('login', { msg: 'Wrong password' })

        req.session.key = email
        res.redirect('/')
    } catch (err) {
        console.error(err);
        res.send(err.message);
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

app.get('/users', async (req,res)=>{
    const testDatas = await user.find()
    res.render('home',{testDatas})
});

//connect to server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})