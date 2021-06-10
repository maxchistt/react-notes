import { useState, useCallback } from 'react'

/**
 * Хук обработки Http запросов
 * Позволяет выводить результаты, ошибки и статус запроса, удобно совершать параметрические запросы
 *  
 */
export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
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
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError }
}
