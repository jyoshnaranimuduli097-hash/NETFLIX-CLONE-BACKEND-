const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const user = require('./model/database')
require('dotenv').config({ path: './pass.env' })

const fs = require('fs')
const path = require('path')

/* =========================
   TRUST PROXY (RENDER FIX)
========================= */
app.set("trust proxy", 1)

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('public'))

/* =========================
   SESSION CONFIG (FIXED)
========================= */
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: true,        // required for Render HTTPS
        httpOnly: true,
        sameSite: "none"     // required for cross-site cookies
    }
}))

/* =========================
   DB CONNECTION
========================= */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database Connected!'))
    .catch((err) => {
        console.error('DB Connection Failed:', err);
        process.exit(1);
    })

const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const user = require('./model/database')
require('dotenv').config({ path: './pass.env' })

const fs = require('fs')
const path = require('path')

/* =========================
   TRUST PROXY (RENDER FIX)
========================= */
app.set("trust proxy", 1)

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

/* =========================
   STATIC FILES (IMPORTANT FIX)
========================= */
app.use(express.static(path.join(__dirname, 'public')))

/* =========================
   SESSION CONFIG (FIXED)
========================= */
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "none"
    }
}))

/* =========================
   DB CONNECTION
========================= */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database Connected!'))
    .catch((err) => {
        console.error('DB Connection Failed:', err)
        process.exit(1)
    })

/* =========================
   LOGIN CHECK MIDDLEWARE
========================= */
const isLogin = (req, res, next) => {
    if (req.session && req.session.key) {
        return next()
    }
    return res.redirect('/login')
}

/* =========================
   ROUTES
========================= */

// Home page (FIXED)
app.get('/', isLogin, (req, res) => {
    res.sendFile('next.html', { root: path.join(__dirname, 'public') })
})

app.get('/next', isLogin, (req, res) => {
    res.render('next')
})

app.get('/login', (req, res) => {
    res.render('login', { msg: null })
})

app.get('/registration', (req, res) => {
    res.render('registration', { msg: null })
})

/* =========================
   STATIC VIEWER (FIXED)
========================= */
async function listStaticFiles(directory, base = '') {
    const entries = await fs.promises.readdir(directory, { withFileTypes: true })
    let files = []

    for (const entry of entries) {
        const relPath = base ? path.posix.join(base, entry.name) : entry.name
        const fullPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            files = files.concat(await listStaticFiles(fullPath, relPath))
        } else {
            files.push(relPath.replace(/\\/g, '/'))
        }
    }

    return files
}

app.get('/static-viewer', isLogin, async (req, res) => {
    try {
        const fileList = await listStaticFiles(path.join(__dirname, 'public'))
        res.render('static-viewer', { files: fileList })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error loading files')
    }
})

/* =========================
   REGISTER
========================= */
app.post('/registration', async (req, res) => {
    try {
        const { email, password } = req.body

        const existing = await user.findOne({ email })
        if (existing) {
            return res.render('registration', { msg: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await user.create({
            email,
            password: hashedPassword
        })

        res.render('registration', { msg: 'Registration Successful' })

    } catch (err) {
        console.error(err)
        res.render('registration', { msg: 'Error occurred' })
    }
})

/* =========================
   LOGIN
========================= */
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user1 = await user.findOne({ email })

        if (!user1) {
            return res.render('login', { msg: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user1.password)

        if (!isMatch) {
            return res.render('login', { msg: 'Wrong password' })
        }

        // SESSION SET
        req.session.key = user1._id.toString()

        // FIXED REDIRECT (this prevents "Not Found")
        res.redirect('/')

    } catch (err) {
        console.error(err)
        res.render('login', { msg: 'Error occurred' })
    }
})

/* =========================
   LOGOUT
========================= */
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})