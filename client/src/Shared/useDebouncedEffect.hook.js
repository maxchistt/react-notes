import { useState, useEffect } from 'react';

function useDebounce(value, delay) {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {

            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);


            return () => {
                clearTimeout(handler);
            };
        },

        [delay, value]
    );

    return debouncedValue;
}

export default function useDebouncedEffect(func, deps, delay) {
    const debounced = useDebounce(deps, delay || 0)
    const debDepsList = Array.isArray(debounced) ? debounced : debounced ? [debounced] : undefined
    useEffect(func, debDepsList) // eslint-disable-line react-hooks/exhaustive-deps
}