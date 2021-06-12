/**@file useDataLoadingController.hook.js */
import { useEffect, useRef } from 'react'
import useUpdater from './useUpdater.hook'

/**
 * хук обновления данных с сервера
 * флаг updatingEnable позволяет избежать взаимодействия с устаревшей unmount версией компонента
 * @param {void} loaderWithClb 
 * @param {void} setter 
 * @param {object} auth 
 * @param {Number} autoupdateInterval 
 */
function useDataLoadingController(loaderWithClb, setter, auth, autoupdateInterval = 60) {
    const { isAuthenticated, token } = auth
    const [updaterVal] = useUpdater(autoupdateInterval)
    /**Флаг допстимости обновления загруженных данных */
    const updatingEnableRef = useRef(true)
    /** Обновление данных с серевера */
    function updater() {
        const checkedSetter = (notes) => { if (updatingEnableRef.current) setter(notes) }
        loaderWithClb(checkedSetter)
    }
    /**защищенный вызов обновления */
    useEffect(() => {
        updatingEnableRef.current = true
        updater()
        return () => updatingEnableRef.current = false
    }, [isAuthenticated, token, updaterVal]) // eslint-disable-line react-hooks/exhaustive-deps

    return [updater]
}

export default useDataLoadingController