const express = require('express')
//const config = require('config')
const path = require('path')
//const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))

//app.use('/api/auth', require('./routes/auth.routes'))
//app.use('/api/link', require('./routes/link.routes'))
//app.use('/t', require('./routes/redirect.routes'))

const phpBaseUrl = 'http://php-server-notes.std-1033.ist.mospolytech.ru/'
app.post('/server', function (req, res) {
    //console.log("backend redirect")
    res.redirect(307, phpBaseUrl)
})

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000

async function start() {
    try {
        /*await mongoose.connect(config.get('mongoUri'), {
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
    require('dns').lookup(require('os').hostname(), (err, add, fam) => {
        console.log(`Express server app has been started`)
        console.log(`- Local            http://localhost:${PORT}`)
        console.log(`- On Your Network  http://${add}:${PORT}`)
    })
}