import React from 'react'

export default function useResize(ref, monitH = false) {
    const [d, setD] = React.useState({ w: 0, h: 0 })

    React.useEffect(() => {
        if (ref && ref.current) {
            const comp = ref.current
            const sizeUpdater = () => {
                const newD = {
                    w: comp.clientWidth,
                    h: monitH ? comp.clientHeight : 0
                }
                const equal = d.w === newD.w && d.h === newD.h
                if (!equal) setD(newD)
            }

            window.addEventListener("resize", sizeUpdater)
            return () => {
                window.removeEventListener("resize", sizeUpdater)
            }
        }
    }, [d.h, d.w, monitH, ref])

    return [d.w, d.h];
}