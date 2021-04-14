import React from 'react'

function StackGridItem({ children, updItemHeight }) {
    const ref = React.useRef(null)
    React.useEffect(() => { if (ref && ref.current) updItemHeight(ref.current.offsetHeight) })
    return (
        <div ref={ref} className="p-0 m-0">
            {children}
        </div>
    )
}

export default StackGridItem
