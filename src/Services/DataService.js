import $ from "jquery"
import { checkCardsArr } from '../Cards/class/Card'

export default function DataService() {
    ////////////////////////////////////////////////////////////
    var user = null
    const deploy = true
    const url = deploy ? 'http://php-server-notes.std-1033.ist.mospolytech.ru/' : 'http://php-server-notes/'

    ////////////////////////////////////////////////////////////
    function updDataServLogin(login) {
        return new Promise((res, rej) => {
            if (login && typeof login === "string") {
                user = login
                //console.log("data serv login set")
                res(user)
            } else if (login === null) {
                user = null
                //console.log("data serv login unset")
                res()
            } else {
                //console.log("data serv cant set login", login)
                rej(login)
            }
        })
    }
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
    //let recuestCount = 1;
    function request(target, data) {
        //const rc = recuestCount++
        //console.log(` \nrequest ${rc} - "${target}" started \n params - user:"${user}" data:"${data}"`)
        return new Promise((res, rej) => {
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: {
                    user: user,
                    target: target,
                    data: data,
                },
            })
                .done(data => res(data))
                .fail(data => rej(data))
            /*.always(() => console.log(
                `requested - newUser:"${user}" resolveData:"${data}" \n
                 request ${rc} - "${target}" ended \n `
            ))*/
        })
    }
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
    function requestGetData() {
        return request('getData', null)
    }

    function requestPostData(data) {
        return request('setData', data || [])
    }
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
    function tryParce(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return str;
        }
    }

    function checkData(data) {
        //console.log('start check data')
        try {
            return data === null || data === [] || checkCardsArr(data)
        } catch {
            return false
        }

    }
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
    function loadData() {
        return new Promise((res, rej) => {
            try {
                (user === null
                    ? Promise.reject(rej())
                    : requestGetData())
                    .then((d) => {
                        let data = tryParce(d)//here we parce json
                        //console.log("[DATA] from loadData(): ", data)
                        if (!checkData(data)) {
                            console.error("[loadData] Bad data format")
                            console.log(data)
                            if (user !== null) {
                                console.log('clear data')
                                requestPostData([{ id: 0, completed: false, text: "Данные были очищены из за ошибки" }]).then(() => loadData().then(res, rej), rej)//очистка данных
                            } else rej("Not format data & unlogged")
                        } else {
                            res(data || [])
                        }
                    })
                    .catch(rej)
            } catch (e) {
                rej(e)
                console.error(e)
            }
        })
    }

    function postData(data) {
        return new Promise((res, rej) => {
            try {
                (user === null
                    ? Promise.reject(rej())
                    : loadData())
                    .then((d) => {
                        let pDat = data === null ? (d || []) : data
                        requestPostData(pDat).then(res, rej)
                    })
                    .catch(rej)
            } catch (e) {
                rej(e)
                console.error(e)
            }
        })
    }
    ////////////////////////////////////////////////////////////

    return { loadData, postData, updDataServLogin }
}
