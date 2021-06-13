/**
 * @file notes.routes.js
 */
const { Router } = require('express')

const Note = require('../models/Note')
const auth = require('../middleware/auth.middleware')
const router = Router()

const { checkNote } = require('../validation/NoteCheck')

/**
 * Добавление и редактирование заметки
 * /api/notes/set
 */
router.post('/set', auth, async (req, res) => {
    try {
        /**получение данных о заметке и запись в бд */
        const note = tryParce(req.body.note)
        if (checkNote(note)) {
            postNote(note)
            res.status(201).json({ note })
        } else {
            res.status(500).json({ message: 'Неверный формат данных заметки' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }

    /**Добавление или редактирование заметки в бд */
    async function postNote(noteToSave) {

        noteToSave.owner = req.user.userId

        /**проверка существования заметки */
        const existing = await Note.findOne({ id: noteToSave.id })

        if (existing) {
            /**Выполнится если такая заметка уже есть */
            existing.overwrite(noteToSave)
            existing.save()
        } else {
            /**Выполнится если нет такой заметки */
            const note = new Note(noteToSave)
            await note.save()
        }

    }
})


/**
 * Удаление заметки
 * /api/notes/delete
 */
router.post('/delete', auth, async (req, res) => {
    try {
        /**получение данных о заметке и удаление */
        const note = tryParce(req.body.note)
        if (checkNote(note)) {
            deleteNote(note)
            res.status(201).json({ note })
        } else {
            res.status(500).json({ message: 'Неверный формат данных заметки' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }

    /**Удаление заметки в бд */
    async function deleteNote(noteToSave) {
        noteToSave.owner = req.user.userId

        const existing = await Note.findOne({ id: noteToSave.id })

        if (existing) {
            existing.remove()
        } else res.status(500).json({ message: 'уже удален' })
    }
})

/**
 * Получение массива заметок
 * /api/notes/
 */
router.get('/', auth, async (req, res) => {
    try {
        /**Нахождение пользовательских заметок в бд */
        const notes = await Note.find({ owner: req.user.userId })
        res.status(200).json(notes)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
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