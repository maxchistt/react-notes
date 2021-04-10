export default function DataService() {

    var user = null

    ////////////////////////////////////////////////////////////

    function logIn(login) {
        return new Promise((res, rej) => {
            if (login && typeof login === "string") {
                user = login
                //console.log("login serv login set")
                res(user)
            } else {
                //console.log("login serv cant set login", login)
                rej(login)
            }
        })
    }

    function logOut() {
        return new Promise((res, rej) => {
            user = null
            //console.log("login serv dislogin")
            res()
        })
    }

    ////////////////////////////////////////////////////////////

    return { logIn, logOut }
}
