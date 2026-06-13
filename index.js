const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const user = require('./model/database')
require('dotenv').config({ path: './pass.env' })

// IMPORTANT FOR RENDER (fixes session issue)
app.set("trust proxy", 1)

// connect database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database Connected!'))
    .catch((err) => {
        console.error('DB Connection Failed:', err);
        process.exit(1);
    })

// session (FIXED FOR RENDER)
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,        // MUST be true on Render (HTTPS)
        httpOnly: true,
        sameSite: "none"     // MUST be none for cross-site cookies
    }
}))

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public'),{index:false}))
// login middleware
let isLogin = (req, res, next) => {
    if (req.session.key) {
        return next();
    }
    res.redirect('/login');
}

// routes
app.get('/registration', (req, res) => {
    res.render('registration', { msg: null })
})

app.get('/login', (req, res) => {
    res.render('login', { msg: null })
})

// home route
app.get('/', isLogin, (req, res) => {
    res.sendFile(path.join(__dirname,'public','next.html'))
})

// static file viewer route
async function listStaticFiles(directory, base = '') {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    const files = []

    for (const entry of entries) {
        const relPath = base ? path.posix.join(base, entry.name) : entry.name
        const fullPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            files.push(...await listStaticFiles(fullPath, relPath))
        } else if (entry.isFile()) {
            files.push(relPath.replace(/\\/g, '/'))
        }
    }

    return files
}

app.get('/static-viewer', isLogin, async (req, res) => {
    try {
        const fileList = await listStaticFiles(path.join(__dirname, 'pubic'))
        res.render('static-viewer', { files: fileList })
    } catch (err) {
        console.error('Static viewer error:', err)
        res.status(500).send('Unable to load static file viewer')
    }
})

// registration
app.post('/registration', async (req, res) => {
    try {
        const { email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        await user.create({ email, password: hashedPassword })

        res.render('registration', {
            msg: 'Registration Successful'
        })
    } catch (err) {
        console.log(err)
        res.render('registration', {
            msg: 'User already exists or error occurred'
        })
    }
})

// login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user1 = await user.findOne({ email })

        if (!user1)
            return res.render('login', { msg: 'User not found' })

        const isMatch = await bcrypt.compare(password, user1.password)

        if (!isMatch)
            return res.render('login', { msg: 'Wrong password' })

        //  SESSION SET
        req.session.key = email

        res.redirect('/')
    } catch (err) {
        console.error(err)
        res.send(err.message)
    }
})

// logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

app.get('/next',(req,res)=>{
    res.render('next')
})

// server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})