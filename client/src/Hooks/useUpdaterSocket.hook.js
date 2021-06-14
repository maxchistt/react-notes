/**@file useUpdaterSocket.hook.js */
import { useCallback } from "react"
import useWebSocket from 'react-use-websocket'
import useDebouncedFunction from "./useDebouncedFunction.hook"
import { useHttp } from "./http.hook"

const WS_PORT = process.env.WS_PORT || 3030

/**
 * Хук веб-сокета обновления данных
 * @param {void} updateData 
 * @param {*} auth 
 */
function useUpdaterSocket(updateData, auth) {
    const { request } = useHttp()
    const getSocketUrl = useCallback(async () => {
        return new Promise(resolve => {
            request("/getIp")
                .then((data) => {
                    const ip = data.ip
                    const socketAddress = "ws://" + (ip || "localhost") + ":" + WS_PORT
                    console.log("socketAddress", socketAddress)
                    resolve(socketAddress)
                })
                .catch((err) => console.log(err))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const debouncedUpdate = useDebouncedFunction(updateData, 200)

    const socketOptions = {
        onOpen: (e) => {
            sendRegisterMsg()
            console.log("ws open", e)
        },
        onClose: (e) => {
            console.log("ws close", e)
        },
        onMessage: (e) => {
            console.log("ws updMessage", e)
            debouncedUpdate()
        },
        onError: (e) => {
            console.error("ws error", e)
        },
    }

    const { sendMessage } = useWebSocket(getSocketUrl, socketOptions)

    const sendMsg = (target) => {
        const msg = JSON.stringify({
            userId: auth.userId,
            target
        })
        sendMessage(msg)
    }

    function sendUpdateMsg() {
        sendMsg("update")
    }

    function sendRegisterMsg() {
        sendMsg("register")
    }

    return [sendUpdateMsg]
}

export default useUpdaterSocket