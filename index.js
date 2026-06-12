const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const user = require('./model/database')


//connect database
mongoose.connect('mongodb://127.0.0.1:27017/contactList')
    .then(() => console.log('Database Connected!'))
    .catch((err) => console.log(err))

//session
app.use(session({
    secret:'mysecret',
    resave:false,
    saveUninitialized:false
}))

//all middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
//my middleware(isLogin)
let isLogin =(req,res,next)=>{
    if (req.session.key) {
        return next();
    }

    res.redirect('/login');
}


//all routes
app.get('/registration', (req, res) => { res.render('registration', { msg: null }) })
app.get('/login', (req, res) => { res.render('login', { msg: null }) })
app.get('/',isLogin, (req, res) => { res.send('hello <br> <a href="/logout">Logout</a>') })

app.post('/registration', async (req, res) => {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    await user.create({ email, password: hashedPassword })
     res.render('registration', {
        msg: 'Registration Successful'
    });
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user1 = await user.findOne({ email })
    if (!user1) return res.render('login', { msg: 'User name not found' })
    const isMatch = await bcrypt.compare( password , user1.password)
    if (!isMatch) return res.render('login', { msg: 'wrong password' })
    req.session.key =  email
        res.redirect('/')
})

app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
})

//connect to server
app.listen(3000, () => {
    console.log('connected to port: 3000')
})