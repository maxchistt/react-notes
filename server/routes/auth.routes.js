/**
 * @file auth.routes.js
 */
const { Router } = require('express')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const db = require('../database/mongoOperations')
const router = Router()

/**
 * Регистрация
 * /api/auth/register
 */
router.post(
  '/register',
  [
    /**валидация */
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      /**проверка данных */
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }

      const { email, password } = req.body

      /**Проверка существования пользователя */
      const candidate = await db.findUserByEmail(email)
      if (candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' })
      }

      /**Хеширование пароля и сохранение пользователя */
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await db.addUser(email, hashedPassword)

      res.status(201).json({ message: `Пользователь ${user.email} создан` })

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

/**
 * Вход
 * /api/auth/login
 */
router.post(
  '/login',
  [
    /**валидация */
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {
      /**проверка данных */
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при входе в систему'
        })
      }

      const { email, password } = req.body

      /**Поиск пользователя в бд */
      const user = await db.findUserByEmail(email)
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      /**Проверка пароля */
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }

      const expiresHours = 1

      /**Создание токена */
      const token = jwt.sign(
        { userId: user.id },
        process.env.jwtSecret,
        { expiresIn: `${expiresHours}h` }
      )

      res.json({ token, userId: user.id, email: user.email, expiresHours })

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

module.exports = router
