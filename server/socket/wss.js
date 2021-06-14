/**@file wss.js */
const WebSocket = require('ws')

/**
 * Подключение WebSocket сервера
 * @param {*} port 
 */
function startWSS(port) {
    let wsCount = 0
    const wsServer = new WebSocket.Server({ port })
    const wsCollection = {}
    wsServer.on('connection', (wsClient) => {
        wsClient.num = ++wsCount

        wsClient.on("message", (data) => {
            try {
                const { userId, target } = tryParce(data)

                if (target == "register") {
                    wsClient.userId = userId
                    let clients = getClients(userId)
                    clients.push({
                        num: wsClient.num,
                        send: msg => wsClient.send(msg)
                    })
                    wsCollection[userId] = clients
                }

                if (target == "update") {
                    getClients(wsClient.userId).forEach((wsc) => {
                        if ((wsClient.num === undefined) || (wsClient.num !== wsc.num)) {
                            wsc.send(data)
                        }
                    })
                }

            } catch (e) { }
        })

        wsClient.on("close", () => {
            wsCollection[wsClient.userId] = getClients(wsClient.userId).filter((wsc) => {
                return (wsClient.num === undefined) || (wsClient.num !== wsc.num)
            })
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

    function tryParce(str) {
        try { return JSON.parse(str) }
        catch (e) { return str }
    }
}

module.exports = startWSS