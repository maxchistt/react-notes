import { useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

/**
 * Хук авторизации
 *  
 */
export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState(null)

  /**обновление данных авторизации */
  const login = useCallback((jwtToken, id, email) => {
    setToken(jwtToken)
    setUserId(id)
    setEmail(email)
    /**запись данных в кэш */
    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken, email: email
    }))
  }, [])

  /**очистка данных авторизации */
  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setEmail(null)
    /**удаление данных из кэша */
    localStorage.removeItem(storageName)
  }, [])

  /**считывание данных из кэша */
  useEffect(() => {
    /**данные из кэша */
    const data = JSON.parse(localStorage.getItem(storageName))
    if (data && data.token) {
      login(data.token, data.userId, data.email)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, userId, email, ready }
}
