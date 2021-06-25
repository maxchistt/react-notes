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
    if (registration && registration.unregister) {
        registration.unregister()
        alert('New version available! Ready to update?')
        window.location.reload(true)
        console.info('service worker updated')
    }
}

/**
 * Обработка успешной регистрации сокета
 * @param {*} registration 
 */
function reghandler() {
    console.info('service worker on success state')
}