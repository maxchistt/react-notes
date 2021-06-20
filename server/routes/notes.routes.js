/**
 * @file notes.routes.js
 */
const { Router } = require('express')

const Note = require('../models/Note')
const Media = require('../models/Media')
const auth = require('../middleware/auth.middleware')
const storage = require('../middleware/storage.middleware')
const router = Router()

const { checkNote } = require('../validation/NoteCheck')

/**
 * Добавление и редактирование заметки
 * /api/notes/set
 */
router.post('/set', auth, storage, async (req, res) => {
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
            const media = existing.media
            if (Array.isArray(media)) media.forEach(mediaId => deleteMedia({ id: mediaId }))
            existing.remove()
        } else res.status(500).json({ message: 'уже удален' })
    }

    /**Удаление media связанных с заметкой в бд */
    async function deleteMedia(mediaToDelete) {
        mediaToDelete.owner = req.user.userId

        /**проверка существования media */
        const existing = await Media.findOne({ id: mediaToDelete.id })

        if (existing) {
            existing.remove()
        }
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