/** @file storage.middleware.js */
const Note = require('../models/Note')
const Media = require('../models/Media')
require('dotenv').config()
const STORAGE_LIMIT = process.env.STORAGE_LIMIT || 5024000

/**
 * Функция-Middleware для проверки занятого пространства
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = async (req, res, next) => {
    //проверка работы сервера
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        /**Нахождение пользовательских заметок в бд */
        const notes = await Note.find({ owner: req.user.userId })
        /**Нахождение пользовательских media в бд */
        const media = await Media.find({ owner: req.user.userId })
        /**Вычисление обьема данных */
        const dataLength = JSON.stringify([...notes, ...media]).length

        const leftPercent = ~~(((STORAGE_LIMIT - dataLength) / STORAGE_LIMIT) * 100)
        //console.log("data left: ", leftPercent, "%")
        if (!(leftPercent > 0)) return res.status(409).json({ message: "Привышен лимит данных" })

        next()
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }

}
