/** @file swConfig.js */

/** Конфигурация serviceWorker */
const swConfig = {
    onUpdate: updater,
    onSuccess: reghandler
}

export default swConfig

/**
 * Обновление кэша PWA
 * @param {*} registration 
 */
function updater(registration) {
    if (registration && registration.waiting) {
        registration.waiting.addEventListener("statechange", event => {
            if (event.target.state === "activated") {
                alert('New version available!  Ready to update?')
                window.location.reload()
                console.info('service worker updated')
            }
        })
        registration.waiting.postMessage({ type: "SKIP_WAITING" })
    }
}

/**
 * Обработка успешной регистрации сокета
 * @param {*} registration 
 */
function reghandler() {
    console.info('service worker on success state')
}