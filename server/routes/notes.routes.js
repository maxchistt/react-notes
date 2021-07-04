/**
 * @file notes.routes.js
 */
const { Router } = require('express')
const db = require('../database/mongoOperations')
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
        const userId = req.user.userId
        if (checkNote(note)) {
            await db.postNote(note, userId)
            res.status(201).json({ note })
        } else {
            res.status(500).json({ message: 'Неверный формат данных заметки' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
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
        const userId = req.user.userId
        if (checkNote(note)) {
            await db.deleteNote(note, userId)
            res.status(201).json({ note })
        } else {
            res.status(500).json({ message: 'Неверный формат данных заметки' })
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

/**
 * Получение массива заметок
 * /api/notes/
 */
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.userId
        /**Нахождение пользовательских заметок в бд */
        const notes = await db.getNotes(userId)
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