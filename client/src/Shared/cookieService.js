/** @file cookieService.js */
/** инициализация интерфейса для работы с cookies */
function cookieServiceInit() {
    const service = navigator.cookieEnabled ? {
        /**
         * получение куки
         * @param {*} name  
         */
        getItem(name) {
            const matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)" // eslint-disable-line no-useless-escape
            ))
            const res = matches ? decodeURIComponent(matches[1]) : undefined
            return res
        },
        /**
         * устанока куки
         * @param {*} name 
         * @param {*} value 
         * @param {*} hours 
         */
        setItem(name, value, hours = 1) {
            var cookie_date = new Date()
            cookie_date.setHours(cookie_date.getHours() + Number(hours))
            document.cookie = `${name}=${value};expires=` + cookie_date.toUTCString()
        },
        /**
         * удаление куки
         * @param {*} name 
         */
        removeItem(name) {
            document.cookie = `${name}=;max-age=-1`
        }
    } : null
    if (!service) console.error("CookiesDisabled!")
    return service
}

export default cookieServiceInit