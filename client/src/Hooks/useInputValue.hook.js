import { useState } from 'react'

/**
 * Хук для обработки форм
 * @param {*} defaultValue 
 * 
 */
export default function useInputValue(defaultValue) {
    const [value, setValue] = useState(defaultValue)
    return {
        bind: {
            value,
            onChange: event => setValue(event.target.value)
        },
        clear: () => setValue(defaultValue),
        value: value,
        addBreak: () => setValue(value + "\n")
    }
}