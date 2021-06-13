/**
 * @file app.js
 * @breif main file
 */

const express = require('express')
const path = require('path')
const dns = require('dns')
const os = require('os')
const mongoose = require('mongoose')
require('dotenv').config()

/**
 * подключение переменных среды
 */
const devMode = process.env.NODE_ENV === "dev"
const PORT = process.env.PORT || 5000
const mongoUri = process.env.mongoUri
const httpsRedirect = process.env.httpsRedirect || false

const app = express()

app.use(express.json({ extended: true }))

/**
 * подключение роутов
 */
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/notes', require('./routes/notes.routes'))

if (httpsRedirect) app.use(httpToHttps)

/**
 * подключение статической библиотеки клиента
 */
if (!devMode) {
    app.use('/', express.static(path.join(__dirname, '../client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
    })
} else {
    app.get('*', (req, res) => {
        res.send("[Backend] NODE_ENV is 'dev'")
    })
}

/**
 * запуск сервера
 */
async function start() {
    try {
        connectMongo(mongoUri)
        app.listen(PORT, logServerStart)
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

/**
 * подключение к MongoDb
 * @param {*} mongoUri 
 */
async function connectMongo(mongoUri) {
    if (mongoUri) {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } else {
        console.log("\n!!!NO MONGO URI!!!")
    }
}

/**
 * Вывод информации о сервере
 */
function logServerStart() {
    dns.lookup(os.hostname(), (err, address) => {
        const [logName, sBef, sAft] = devMode ? ['Express server', ' ', ':'] : ['React Notes App', '-', '']
        console.log(`\n${logName} has been started`)
        console.log(`${sBef} Local${sAft}            http://localhost:${PORT}`)
        console.log(`${sBef} On Your Network${sAft}  http://${address}:${PORT}`)
        if (err) console.log(err)
    })
}

/**
 * перенаправление с http на https для PWA 
 */
function httpToHttps(req, res, next) {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
        next()
    }
}