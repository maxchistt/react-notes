const { Router } = require('express')

const Note = require('../models/Note')
const auth = require('../middleware/auth.middleware')
const router = Router()

const { checkCard } = require('../validation/CardCheck')


router.post('/set', auth, async (req, res) => {
    try {
        const card = tryParce(req.body.card)
        if (checkCard(card)) {
            postNote(card)
            res.status(201).json({ card: card })
        } else {
            res.status(500).json({ message: 'Неверный формат данных заметки' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }

    async function postNote(noteToSave) {

        noteToSave.owner = req.user.userId

        const existing = await Note.findOne({ id: noteToSave.id })

        if (existing) {
            //console.log("EXITING");
            existing.overwrite(noteToSave)
            existing.save()
        } else {
            //console.log("NON EXITING")
            const note = new Note(noteToSave)
            await note.save()
        }

    }
})



router.post('/delete', auth, async (req, res) => {
    try {
        
        const card = tryParce(req.body.card)
        if (checkCard(card)) {
            deleteNote(card)
            res.status(201).json({ card: card })
        } else {
            res.status(500).json({ message: 'Неверный формат данных заметки' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }

    async function deleteNote(noteToSave) {
        noteToSave.owner = req.user.userId

        const existing = await Note.findOne({ id: noteToSave.id })

        if (existing) {
            //console.log("EXITING");
           
            existing.remove()
            console.log("fdsdf");
        } else res.status(500).json({ message: 'уже удален' })
    }
})



router.get('/', auth, async (req, res) => {
    try {
        //console.log(req.user.userId);
        const notes = await Note.find({ owner: req.user.userId })
        //console.log(notes);
        res.json(notes)
    } catch (e) {
        //console.log("\n\n\n   GET");
        //console.log(e);
        res.status(500).json({ message: '[GET] Что-то пошло не так, попробуйте снова' })
    }
})

function tryParce(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}

module.exports = router