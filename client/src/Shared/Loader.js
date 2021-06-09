import React from 'react'

/**просто вращающееся колесико загрузки */
export default function Loader({ className }) {
    return (
        <i className={className}>
            <span className={`lds-dual-ring`} ></span>
        </i>
    )
}
