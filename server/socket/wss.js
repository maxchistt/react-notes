/**@file wss.js */
const WebSocket = require('ws')

/**
 * Подключение WebSocket сервера
 * Он принимает сигналы об обновлении от клиента и рассылает остальным для синхронизации
 * @param {*} port 
 */
function startWSS(port) {
    /**сервер ws */
    const wsServer = new WebSocket.Server({ port })
    /**коллекция ws клиентов разделенная по id пользователя */
    const wsCollection = {}
    // обработка событий сервера
    wsServer.on('connection', (wsClient) => {
        // уникальный номер клиента
        const clientNum = Date.now()
        // проверка регистрации
        setTimeout(() => {
            if (!wsClient.userId) wsClient.close()
        }, 60 * 1000)
        // обработка сообщения клиента
        wsClient.on("message", (data) => {
            try {
                // данные с клиента
                const { userId, target } = JSON.parse(data)
                // обработка сообщения регистрации
                if (target == "register") {
                    wsClient.userId = userId
                    wsClient.num = clientNum
                    let clients = getClients(wsClient.userId)
                    let match = false
                    clients.forEach(val => {
                        if (val.num == wsClient.num) match = true
                    })
                    if (!match && wsClient.userId) {
                        clients.push({
                            num: wsClient.num,
                            send: msg => wsClient.send(msg)
                        })
                        wsCollection[wsClient.userId] = clients
                    } else throw new Error("ошибка регистрации сокета")
                }
                // обработка сообщения об обновлении
                if (target == "update" && wsClient.userId) {
                    getClients(wsClient.userId).forEach((wsc) => {
                        if ((wsClient.num !== undefined) && (wsClient.num !== wsc.num)) {
                            wsc.send(data)
                        }
                    })
                }
            } catch (e) { wsClient.close() }
        })
        // обработка закрытия клиента
        wsClient.on("close", () => {
            if (wsClient.userId) wsCollection[wsClient.userId] = getClients(wsClient.userId).filter((wsc) => {
                return (wsClient.num === undefined) || (wsClient.num !== wsc.num)
            })
        })
        // обработка ошибки клиента
        wsClient.on("error", (ws, err) => {
            wsClient.close(undefined, err)
        })
    })
    wsServer.on("close", () => console.log("WSS closed"))
    wsServer.on("error", () => console.log("WSS error"))
    wsServer.on("listening", () => console.log("WSS listening"))

    /**
     * Получение колекции соединений по id
     * @param {string} userId 
     * @returns {Array<WebSocket>}
     */
    function getClients(userId) {
        return wsCollection[userId] || []
    }
}

module.exports = startWSS