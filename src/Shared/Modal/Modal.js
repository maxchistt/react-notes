import React from 'react'
import PropTypes from 'prop-types'
import './Modal.css'

const classes = {
    modalWrapper: 'modal-window-wrapper modal',
    modalBody: 'modal-window-body'
}

function Modal(props) {
    const { isOpen, setOpenState, openButton, sideClose, onSideClick } = props

    const wrapperRef = React.useRef(null)

    function open() {
        setOpenState(true)
    }

    function close() {
        setOpenState(false)
        if (typeof onSideClick === "function") onSideClick()
    }

    function handleOpenButtonClick() {
        open()
    }

    function handleWrapperClick(e) {
        if (wrapperRef.current && wrapperRef.current === e.target) {
            if (sideClose) close()
        }
    }

    return (
        <React.Fragment>
            {openButton &&
                <div className="container p-1">
                    <button className="btn" onClick={handleOpenButtonClick}>Open modal</button>
                </div>
            }

            {isOpen &&
                <div
                    style={{ display: "flex" }}
                    className={classes.modalWrapper}
                    ref={wrapperRef}
                    onClick={handleWrapperClick}
                >
                    <div className={classes.modalBody}>
                        <div className="rounded container p-3 bg-light">
                            {props.children}
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

class ModalProps {
    constructor() {
        this.isOpen = false
        this.setOpenState = null
        this.openButton = false
        this.sideClose = false
        this.onSideClick = null
    }

    bind() {
        return {
            isOpen: this.isOpen,
            setOpenState: this.setOpenState,
            openButton: this.openButton,
            sideClose: this.sideClose,
            onSideClick: this.onSideClick
        }
    }
}

Modal.propTypes = {
    children: PropTypes.object,

    isOpen: PropTypes.bool,
    setOpenState: PropTypes.func,
    openButton: PropTypes.bool,
    sideClose: PropTypes.bool,
    onSideClick: PropTypes.func
}

export default Modal
export { Modal, ModalProps }
