const express = require('express')
const path = require('path')
const dns = require('dns')
const os = require('os')
//const mongoose = require('mongoose')

//temporary backend url
const phpBaseUrl = 'http://php-server-notes.std-1033.ist.mospolytech.ru/'

const app = express()

app.use(express.json({ extended: true }))

//app.use('/api/auth', require('./routes/auth.routes'))

app.post('/server', function (req, res) {
    //console.log("backend redirect", req.url)
    res.redirect(307, phpBaseUrl)
})

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
} else {
    app.get('*', (req, res) => {
        res.send("NODE_ENV is not 'production'")
    })
}

const PORT = process.env.PORT || 5000

async function start() {
    try {
        /*await mongoose.connect(process.env.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })*/
        app.listen(PORT, () => logServerStart(PORT))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

function logServerStart(PORT) {
    dns.lookup(os.hostname(), (err, add, fam) => {
        console.log(`Express server app has been started`)
        console.log(`- Local            http://localhost:${PORT}`)
        console.log(`- On Your Network  http://${add}:${PORT}`)
    })
}