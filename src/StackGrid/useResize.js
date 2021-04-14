import React from 'react'

export default function useResize(ref) {
    const [d, setD] = React.useState({ w: 0, h: 0 })

    React.useEffect(() => {
        if (ref && ref.current) {
            const comp = ref.current
            const handler = () => {
                console.log(comp.clientWidth)
                setD({
                    w: comp.clientWidth,
                    h: comp.clientHeight
                })
            }

            window.addEventListener("resize", handler)
            return () => {
                window.removeEventListener("resize", handler)
            }
        }
    }, [ref])

    return [d.w, d.h];
}