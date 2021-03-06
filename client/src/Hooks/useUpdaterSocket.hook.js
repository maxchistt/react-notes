/**@file useUpdaterSocket.hook.js */
import { useCallback } from "react"
import useWebSocket from 'react-use-websocket'
import useDebouncedFunction from "./useDebouncedFunction.hook"
import { useHttp } from "./http.hook"

/**
 * Хук веб-сокета обновления данных
 * @param {void} updateData 
 * @param {{}} auth 
 */
function useUpdaterSocket(updateData, auth) {
    const { request } = useHttp()

    /**дебонсированный обработчик входящего обновления */
    const debouncedUpdate = useDebouncedFunction(() => { if (auth.isAuthenticated) updateData() }, 200)

    /**колбек для получения url сокета */
    const getSocketUrl = useCallback(async () => {
        return new Promise(resolve => {
            request("/getSocketAddress")
                .then(data => resolve(data.socketAddress))
                .catch(err => console.error("getSocketAddress err", err))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**опции обработки событий сокета */
    const socketOptions = {
        onOpen: e => {
            sendRegisterMsg()
            console.info("ws open")
        },
        onClose: e => {
            console.info("ws close")
        },
        onMessage: e => {
            console.log("ws update message")
            debouncedUpdate()
        },
        onError: e => {
            console.error("ws error", e)
        },
    }

    /**подключение WebSocket */
    const { sendMessage } = useWebSocket(getSocketUrl, socketOptions)

    /**дебонсированный обработчик отсылаемого обновления */
    const sendUpdateMsgDebounced = useDebouncedFunction(sendUpdateMsg, 200)

    /** отпрака сообщения сокета */
    function sendMsg(target) {
        const msg = JSON.stringify({
            userId: auth.userId,
            target
        })
        sendMessage(msg)
    }

    /**отправка отсылаемого обновления */
    function sendUpdateMsg() {
        sendMsg("update")
    }

    /**отпрака сообщения регистрации сокета */
    function sendRegisterMsg() {
        sendMsg("register")
    }

    return [sendUpdateMsgDebounced]
}

export default useUpdaterSocket