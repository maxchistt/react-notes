/**
 * @file media.routes.js
 */
const { Router } = require('express')
const db = require('../database/mongoOperations')
const auth = require('../middleware/auth.middleware')
const storage = require('../middleware/storage.middleware')
const router = Router()

/**
 * Добавление и редактирование media
 * /api/media/set
 */
router.post('/set', auth, storage, async (req, res) => {
    try {
        /**получение данных о media и запись в бд */
        const media = tryParce(req.body.media)
        const userId = req.user.userId
        await db.postMedia(media, userId)
        res.status(201).json({ media })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

/**
 * Добавление и редактирование media
 * /api/media/delete
 */
router.post('/delete', auth, async (req, res) => {
    try {
        /**получение данных о media и запись в бд */
        const media = tryParce(req.body.media)
        const userId = req.user.userId
        await db.deleteMedia(media, userId)
        res.status(201).json({ media })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

/**
 * Получение массива media
 * /api/media/
 */
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.userId
        /**Нахождение пользовательских media в бд */
        const media = await db.getMedia(userId)
        res.status(200).json(media)
        /**Проверка и удаление старых медиа */
        if (Array.isArray(media)) media.forEach(mediaVal => {
            db.deleteUnactualMedia(mediaVal)
        })
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