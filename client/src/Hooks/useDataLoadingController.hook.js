/**@file useDataLoadingController.hook.js */
import { useContext, useEffect, useRef } from 'react'
import useUpdater from './useUpdater.hook'
/**
 * хук обновления данных с сервера
 * флаг updatingEnable позволяет избежать взаимодействия с устаревшей unmount версией компонента
 * @param {void} loader 
 * @param {React.Context} authContext 
 * @param {Number} interval 
 */
function useDataLoadingController(loader, authContext, interval = 60) {
    const { isAuthenticated, token } = useContext(authContext)
    const [updaterVal] = useUpdater(interval)
    const updatingEnableRef = useRef(true)

    useEffect(() => {
        updatingEnableRef.current = true
        loader()
        return () => updatingEnableRef.current = false
    }, [isAuthenticated, token, updaterVal]) // eslint-disable-line react-hooks/exhaustive-deps

    return [updatingEnableRef]
}

export default useDataLoadingController