import $ from "jquery";
export default function DataService() {
    ////////////////////////////////////////////////////////////
    let user = null
    const deploy = true
    const url = deploy ? 'http://php-server-notes.std-1033.ist.mospolytech.ru/' : 'http://php-server-notes/'
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
    function requestUser() {
        return request('ip', null).then(prom => {
            user = String(prom) || "default"
            console.log("user ", user)
        })
    }

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
            (user === null
                ? requestUser(null)
                : Promise.resolve(null))
                .then(() => requestGetData(null))
                .then((d) => {
                    let data = tryParce(d)//here we parce json
                    //console.log("[DATA] from loadData(): ", data)
                    res(data || [])
                })
                .catch(rej)
        })
    }

    function postData(postData) {
        (user === null
            ? loadData(null)
            : Promise.resolve(null))
            .then((data) => {
                let pDat = postData === null ? (data || []) : postData
                requestPostData(pDat)
            })
    }
    ////////////////////////////////////////////////////////////

    return { loadData, postData, tryParce }
}
