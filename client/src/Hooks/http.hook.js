/**
 * @file http.hook.js
 */
import { useState } from 'react'

/**
 * Хук обработки Http запросов
 * Позволяет выводить результаты, ошибки и статус запроса, удобно совершать параметрические запросы
 */
export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  /**
   * асинхронный запрос к серверу
   * @param {string} url 
   * @param {string} method 
   * @param {object} body 
   * @param {object} headers 
   */
  const request = async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true)
    try {
      /**составление запроса */
      if (body) {
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
      }
      /**отправка запроса */
      const response = await fetch(url, { method, body, headers })
      /**получение ответа */
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так')
      }
      setLoading(false)
      return data
    } catch (e) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }

  const clearError = () => setError(null)

  return { loading, request, error, clearError }
}
