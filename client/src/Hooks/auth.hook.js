/** @file auth.hook.js */
import { useState, useEffect } from 'react'
import cookieServiceInit from '../Shared/cookieService'

const cookieName = 'userData'
/** интерфейс для работы с cookies */
const cookieService = cookieServiceInit()

/**
 * Хук авторизации
 */
export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState(null)

  /**обновление данных авторизации */
  const login = (jwtToken, id, email, expiresHours = 1, dontRewriteCookie = false) => {
    setToken(jwtToken)
    setUserId(id)
    setEmail(email)

    /**запись данных в кэш */
    if (!dontRewriteCookie) cookieService.setItem(cookieName, JSON.stringify({
      userId: id, token: jwtToken, email: email
    }), expiresHours)
  }

  /**очистка данных авторизации */
  const logout = () => {
    setToken(null)
    setUserId(null)
    setEmail(null)
    /**удаление данных из кэша */
    cookieService.removeItem(cookieName)
  }

  /**считывание данных из кэша */
  useEffect(() => {
    /**данные из кэша */
    const data = tryParce(cookieService.getItem(cookieName))
    if (data && data.token) {
      login(data.token, data.userId, data.email, data.expiresHours || 1, true)
    }
    setReady(true)
  }, [])

  return { login, logout, token, userId, email, ready }
}

function tryParce(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}