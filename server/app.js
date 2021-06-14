/**
 * @file app.js
 * @breif main file
 */

const express = require('express')
const path = require('path')
const os = require('os')
const mongoose = require('mongoose')
const https = require('./middleware/https.middleware')
const startWSS = require('./socket/wss')
require('dotenv').config()

//подключение переменных среды
const devMode = process.env.NODE_ENV === "dev"
const PORT = process.env.PORT || 5000
const mongoUri = process.env.mongoUri
const httpsRedirect = process.env.httpsRedirect || false
const WS_PORT = process.env.WS_PORT || 3030

const app = express()

app.use(express.json({ extended: true }))

app.get('/getIp', (req, res) => {
    const ip = getIp()
    res.status(200).json({ ip })
})

/**
 * подключение роутов
 */
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/notes', require('./routes/notes.routes'))


if (httpsRedirect) app.use(https)

/**
 * подключение статической библиотеки клиента
 */
if (!devMode) {
    const clientPath = '../client/build'
    app.use('/', express.static(path.join(__dirname, clientPath)))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, clientPath, 'index.html'))
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
        startWSS(WS_PORT)
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
    const [logName, sBef, sAft] = devMode ? ['Express server', ' ', ':'] : ['React Notes App', '-', '']
    console.log(`\n${logName} has been started`)
    console.log(`${sBef} Local${sAft}            http://localhost:${PORT}`)
    console.log(`${sBef} On Your Network${sAft}  http://${getIp()}:${PORT}`, '\n')
}

/**
 * Получение ip сервера
 */
function getIp() {
    for (let key in os.networkInterfaces()) {
        const addr = os.networkInterfaces()[key][1].address
        if (addr != undefined) return addr
    }
}
