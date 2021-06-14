/** @file useDebouncedFunction.hook.js */
import { useEffect, useReducer } from 'react';

/**
 * Хук Debounced Function
 * @param {void} callback 
 * @param {number} delayms 
 */
function useDebouncedFunction(callback, delayms) {
    const [state, debounced] = useReducer(() => {
        return { count: state.count++, args: arguments }
    }, { count: 0, args: undefined })
    useEffect(() => {
        const handler = setTimeout(() => callback(state.arguments), delayms)
        return () => clearTimeout(handler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])
    return debounced
}

export default useDebouncedFunction