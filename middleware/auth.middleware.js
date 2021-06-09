const jwt = require('jsonwebtoken')
require('dotenv').config()

/**
 * Функция-Middleware для проверки авторизации пользователя
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {
  //проверка работы сервера
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    /**получение токена */
    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

    /**проверка отсутствия токена */
    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    /**верификация токена */
    const decoded = jwt.verify(token, process.env.jwtSecret)
    req.user = decoded
    next()

  } catch (e) {
    res.status(401).json({ message: 'Нет авторизации' })
  }
}
