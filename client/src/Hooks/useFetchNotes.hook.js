/**@file useFetchNotes.hook.js */
import { useHttp } from "./http.hook"

/**
 * Хук для обращения к бд с заметками
 * @param {string} token 
 */
function useFetchNotes(token) {
    /**подключение хука http запросов */
    const { loading, request, error, clearError } = useHttp()

    /**
     * Функция для работы с базой данных заметок
     * @param {string} url 
     * @param {string} method 
     * @param {object} body 
     * @param {void} resCallback 
     */
    async function fetchNotes(url = "", method = "GET", body = null, resCallback = () => { }) {
        try {
            /**запрос к серверу о заметках с определенными параметрами*/
            const fetched = await request(`/api/notes${url ? ("/" + url) : ""}`, method, body, { Authorization: `Bearer ${token}` })
            resCallback(tryParce(fetched))
        } catch (e) { }
    }

    async function fetchMedia(url = "", method = "GET", body = null, resCallback = () => { }) {
        try {
            /**запрос к серверу о медиа с определенными параметрами*/
            const fetched = await request(`/api/media${url ? ("/" + url) : ""}`, method, body, { Authorization: `Bearer ${token}` })
            resCallback(tryParce(fetched))
        } catch (e) { }
    }

    function tryParce(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return str;
        }
    }

    return { loading, fetchNotes, fetchMedia, error, clearError }
}

export default useFetchNotes