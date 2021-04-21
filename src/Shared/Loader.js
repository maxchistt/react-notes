import React from 'react'

export default function Loader({ className }) {
    return (
        <i className={className}>
            <span className={`lds-dual-ring`} ></span>
        </i>
    )
}
