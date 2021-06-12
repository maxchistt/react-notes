/**
 * @file Loader.js
 */
import React from 'react'

/**просто вращающееся колесико загрузки */
function Loader({ className }) {
    return (
        <i className={className}>
            <span className={`lds-dual-ring`} ></span>
        </i>
    )
}

export default Loader