/**@file useNavbarEffect.hook.js */
import { useEffect, useContext } from 'react'
import { PageContext } from '../Context/PageContext'

/**
 * Обновление навбара при рендере
 * @param {JSX} content 
 * @param {Array} deps 
 */
export default function useNavbarEffect(content, deps) {
    const navSetter = useContext(PageContext).setNav
    useEffect(() => {
        navSetter(content)
        return navSetter
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}