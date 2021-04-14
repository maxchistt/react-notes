import React from 'react'

function StackGridItem({ children, updItemHeight, style, className }) {
    const ref = React.useRef(null)
    React.useEffect(() => { if (ref && ref.current) updItemHeight(ref.current.offsetHeight) })
    return (
        <span ref={ref} className={className} style={style}>
            {children}
        </span>
    )
}

export default StackGridItem
