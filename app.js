const express = require('express')
const path = require('path')
const dns = require('dns')
const os = require('os')
const mongoose = require('mongoose')
require('dotenv').config()

const devMode = process.env.NODE_ENV === "dev"
const PORT = process.env.PORT || 5000
const mongoUri = process.env.mongoUri
const httpsRedirect = process.env.httpsRedirect || false

//temporary backend url
const phpBaseUrl = 'https://php-server-notes.herokuapp.com/'

const app = express()

app.use(express.json({ extended: true }))

//app.use('/api/auth', require('./routes/auth.routes'))

app.post('/server', function (req, res) {
    //console.log("backend redirect", req.url)
    res.redirect(307, phpBaseUrl)
})

if (!devMode) {
    if (httpsRedirect) app.use(httpToHttps)
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
} else {
    app.get('*', (req, res) => {
        res.send("[Backend] NODE_ENV is 'dev'")
    })
}

async function start() {
    try {
        if (mongoUri) {
            await mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            })
        } else {
            console.log("\n!!!NO MONGO URI!!!")
        }
        app.listen(PORT, () => logServerStart(PORT))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

function logServerStart(PORT) {
    dns.lookup(os.hostname(), (err, address, fam) => {
        const [logN, bef, af] = devMode ? ['Express server', ' ', ':'] : ['React Notes App', '-', '']
        console.log(`\n${logN} has been started`)
        console.log(`${bef} Local${af}            http://localhost:${PORT}`)
        console.log(`${bef} On Your Network${af}  http://${address}:${PORT}`)
    })
}

function httpToHttps(req, res, next) {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
        next()
    }
}