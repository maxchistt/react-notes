/**@file useUpdater.hook.js */
import { useState, useRef, useEffect } from 'react'
/**
* Хук-таймер для обновления данных с очисткой счетчика при ререндере 
*/
function useUpdater(secInterval = 60) {
    const [updaterVal, setUpdaterVal] = useState(null)
    const timer = useRef()
    useEffect(() => {
        if (timer.current) clearTimeout(timer.current) // сброс при переопределении таймера
        timer.current = setTimeout(() => {
            console.log("Timed update")
            setUpdaterVal(Date.now())
        }, secInterval * 1000) // обновяем через минуту
        return () => clearTimeout(timer.current) // сброс при ререндере
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    return [updaterVal]
}

export default useUpdater