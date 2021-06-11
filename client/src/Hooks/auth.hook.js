/**
 * @file auth.hook.js
 */
import { useState, useCallback, useEffect } from 'react'

const cookieName = 'userData'
/** интерфейс для работы с cookies */
const cookieService = navigator.cookieEnabled ? {
  /**
   * получение куки
   * @param {*} name  
   */
  getItem(name) {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)" // eslint-disable-line no-useless-escape
    ))
    const res = matches ? decodeURIComponent(matches[1]) : undefined
    return res
  },
  /**
   * устанока куки
   * @param {*} name 
   * @param {*} value 
   * @param {*} hours 
   */
  setItem(name, value, hours = 1) {
    var cookie_date = new Date()
    cookie_date.setHours(cookie_date.getHours() + Number(hours))
    document.cookie = `${name}=${value};expires=` + cookie_date.toUTCString()
  },
  /**
   * удаление куки
   * @param {*} name 
   */
  removeItem(name) {
    document.cookie = `${name}=;max-age=-1`
  }
} : null

if (!cookieService) console.log("CookiesDisabled!")

/**
 * Хук авторизации
 */
export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState(null)

  /**обновление данных авторизации */
  const login = useCallback((jwtToken, id, email, expiresHours = 1, dontRewriteCookie = false) => {
    setToken(jwtToken)
    setUserId(id)
    setEmail(email)

    /**запись данных в кэш */
    if (!dontRewriteCookie) cookieService.setItem(cookieName, JSON.stringify({
      userId: id, token: jwtToken, email: email
    }), expiresHours)
  }, [])

  /**очистка данных авторизации */
  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setEmail(null)
    /**удаление данных из кэша */
    cookieService.removeItem(cookieName)
  }, [])

  /**считывание данных из кэша */
  useEffect(() => {
    /**данные из кэша */
    const data = tryParce(cookieService.getItem(cookieName))
    if (data && data.token) {
      login(data.token, data.userId, data.email, data.expiresHours || 1, true)
    }
    setReady(true)
  }, [login])

  return { login, logout, token, userId, email, ready }
}

function tryParce(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}