import React from 'react'
import PropTypes from 'prop-types'
import './Modal.css'

const classes = {
    modalWrapper: ' modal-window-wrapper ',
    modalBody: ' modal-window-body '
}
export const ModalContext = React.createContext()
function Modal(props) {

    const [isOpen, setOpenState] = React.useState(false)
    const Component = props.component
    const ComponentProps = props.componentProps

    function open() {
        setOpenState(true)
    }

    function close() {
        setOpenState(false)
    }

    return (
        <React.Fragment>
            <div className="container p-1 d-none">
                <button className="btn" onClick={open}>Open modal</button>
            </div>

            <div
                style={{ display: !isOpen ? "none" : "flex" }}
                className={classes.modalWrapper}
                onClick={(e) => { if (e.target.className === classes.modalWrapper) close() }}
            >
                <div className={classes.modalBody + 'bg-light'}>
                    <ModalContext.Provider value={{ open, close, isOpen, classes }}>
                        <Component {...ComponentProps} />
                    </ModalContext.Provider>
                </div>
            </div>

        </React.Fragment>
    )
}

Modal.propTypes = {
    component: PropTypes.func,
    componentProps: PropTypes.object
}

export default Modal
