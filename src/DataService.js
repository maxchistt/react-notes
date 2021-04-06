import $ from "jquery";
export default function DataService() {
    ////////////////////////////////////////////////////////////
    var user = null
    const deploy = true
    const url = deploy ? 'http://php-server-notes.std-1033.ist.mospolytech.ru/' : 'http://php-server-notes/'
    //let recuestCount = 1;

    ////////////////////////////////////////////////////////////
    function setLogin(login) {
        if (login && typeof login === "string") {
            user = login
            return Promise.resolve(user)
        } else return Promise.reject(login)
    }
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
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
            return JSON.parse(str, reviver);
        } catch (e) {
            return str;
        }
    }
    function reviver(key, value) {
        if (typeof value == 'string' && (Boolean(value) !== undefined)) {
            if (value === "false") return false;
            if (value === "true") return true;
        }
        return value;
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
                        res(data || [])
                    }, rej)
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
                    }, rej)
                    .catch(rej)
            } catch (e) {
                rej(e)
                console.error(e)
            }
        })
    }
    ////////////////////////////////////////////////////////////

    return { loadData, postData, setLogin }
}
