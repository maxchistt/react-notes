/** @file useDebouncedFunction.hook.js */
import { useEffect, useReducer } from 'react';

/**
 * @callback voidCallback
 * @param arg
 */
/**
 * Хук Debounced Function
 * @param {voidCallback} callback 
 * @param {number} delayms 
 */
function useDebouncedFunction(callback, delayms) {
    const [state, debounced] = useReducer((state, arg) => {
        return { count: state.count + 1, arg: arg }
    }, { count: 0, arg: undefined })
    useEffect(() => {
        const handler = setTimeout(() => {
            if (state.count) callback(state.arg)
        }, delayms)
        return () => clearTimeout(handler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])
    return debounced
}

export default useDebouncedFunction