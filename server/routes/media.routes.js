/**
 * @file media.routes.js
 */
const { Router } = require('express')

const Media = require('../models/Media')
const Note = require('../models/Note')
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
        postMedia(media)
        res.status(201).json({ media })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }

    /**Добавление или редактирование media в бд */
    async function postMedia(mediaToSave) {
        mediaToSave.owner = req.user.userId

        /**проверка существования media */
        const existing = await Media.findOne({ id: mediaToSave.id })

        if (existing) {
            /**Выполнится если такая media уже есть */
            existing.overwrite(mediaToSave)
            existing.save()
        } else {
            /**Выполнится если нет такой media */
            const media = new Media(mediaToSave)
            await media.save()
        }
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
        deleteMedia(media)
        res.status(201).json({ media })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }

    /**Удаление media в бд */
    async function deleteMedia(mediaToDelete) {
        mediaToDelete.owner = req.user.userId

        /**проверка существования media */
        const existing = await Media.findOne({ id: mediaToDelete.id })

        if (existing) {
            existing.remove()
        } else res.status(500).json({ message: 'уже удален' })
    }
})

/**
 * Получение массива media
 * /api/media/
 */
router.get('/', auth, async (req, res) => {
    try {
        /**Нахождение пользовательских media в бд */
        const media = await Media.find({ owner: req.user.userId })
        res.status(200).json(media)
        if (Array.isArray(media)) media.forEach(mediaVal => {
            deleteUnactualMedia(mediaVal)
        })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }

    /**Удаление старых media в бд */
    async function deleteUnactualMedia(mediaToDelete) {
        try {
            const note = mediaToDelete.note ? await Note.findOne({ id: mediaToDelete.note }) : null
            if (!note) {
                /**проверка существования media */
                const existing = await Media.findOne({ id: mediaToDelete.id })
                if (existing) {
                    existing.remove()
                }
            }
        } catch { }
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