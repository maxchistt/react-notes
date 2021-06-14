/**@file wss.js */
const WebSocket = require('ws')

/**
 * Подключение WebSocket сервера
 * @param {*} port 
 */
function startWSS(port) {
    let wsCount = 0
    const wsServer = new WebSocket.Server({ port })
    const wsCollection = { test: [] }
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
                        send: wsClient.send
                    })
                    wsCollection[userId] = clients

                    console.log("\ncollection \n", wsCollection, '\n')
                }

                if (target == "update") {
                    getClients(wsClient.userId).forEach((wsc) => {
                        if ((wsClient.num === undefined) || (wsClient.num !== wsc.num)) wsc.send(data)
                    })
                }

                console.log("wsClient", wsClient.num, "messaged", target)
            } catch (e) {
                console.log("wsClient", wsClient.num, "error on messsage", e)
            }
        })
        wsClient.on("open", () => console.log("wsClient", wsClient.num, "opened"))
        wsClient.on("close", () => {
            wsCollection[wsClient.userId] = getClients(wsClient.userId).filter((wsc) => {
                return (wsClient.num === undefined) || (wsClient.num !== wsc.num)
            })
            console.log("wsClient", wsClient.num, "closed")
        })
        wsClient.on("error", () => console.log("wsClient", wsClient.num, "error"))

        console.log("WSS connection", wsClient.num)
    });
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