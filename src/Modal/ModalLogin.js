import React from "react"
import Modal, { ModalProps } from "./Modal"
import PropTypes from 'prop-types'

function checkUsername(str) {
    return str && typeof str === 'string' && str.length > 3 && str.length < 20 && str === validateUsername(str)
}

function validateUsername(str) {
    return String(str).replace(/@|;|:|\.|,|\/|\\|\||\$|\?|!|#|%|\*|\^|\+|=|\[|\]| |\\ |«|<|>/gi, "").trim()
}

function useInputValue(defaultValue) {
    const [value, setValue] = React.useState(defaultValue)

    return {
        bind: {
            value: value,
            onChange: event => setValue(event.target.value)
        },
        clear: () => setValue(""),
        value: value
    }
}

function ModalLogin(props) {
    const { login, logout, logged, userName, isOpen, setOpenState } = props

    const input = useInputValue("")

    const modalProps = new ModalProps()
    modalProps.isOpen = isOpen
    modalProps.setOpenState = setOpenState
    modalProps.sideClose = true

    const [labelAlert, setLabelAlert] = React.useState("");

    // eslint-disable-next-line no-unused-vars
    function open() {
        setOpenState(true)
    }

    function close() {
        clearInput()
        setOpenState(false)
    }

    function clearInput() {
        input.clear()
        setLabelAlert("")
    }

    function tryLogin() {
        if (checkUsername(input.value)) {
            login(input.value.trim())
                .then((name) => {
                    close()
                    console.log('Login:', name)
                })
                .catch((err) => {
                    console.log("Не удалось залогиниться")
                    console.log(err)
                    setLabelAlert(<div className="alert alert-danger my-1" role="alert">
                        Не удалось залогиниться {err && <span className={`badge badge-danger`}>{String(err)}</span>}
                    </div>)
                })
        } else if (input.value) {
            setLabelAlert(<div className="alert alert-warning my-1" role="alert">{input.value.length > 3 ? "Исправьте логин" : "Слишком короткий логин"}</div>)
        } else {
            setLabelAlert(<div className="alert alert-info my-1" role="alert">Поле "Username" не должно быть пустым</div>)
        }
    }

    function tryLogout() {
        //close()
        logout()
        console.log('Logged out')
    }

    function tryClose() {
        setLabelAlert("")
        close()
    }

    return (
        <Modal {...modalProps.bind()}>
            <div className="container p-3 bg-light">
                <div className='bg-light form-group mb-2'>
                    <div className='mb-1'>
                        <span className={logged ? `badge badge-success` : `badge badge-secondary`}>
                            {logged ? <span><i className="bi bi-key"> </i>AUTORISED</span> : 'UNAUTORISED'}
                        </span>
                        {userName ? <span> {userName} </span> : ``}
                    </div>
                </div>

                <div className='bg-light form-group'>
                    {labelAlert}
                    <label htmlFor="login">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Введите логин"
                        id="login"
                        onKeyPress={e => e.key === 'Enter' && tryLogin()}
                        {...input.bind}
                    />
                </div>

                <div className='bg-light form-group form-row'>
                    <div className="col-12 col-sm-4 col-md-5 p-1">
                        <button className="btn btn-primary col" onClick={tryLogin}><i className="bi bi-person-check"></i> Log in</button>
                    </div>
                    <div className="col col-sm-4 col-md-4 p-1">
                        <button disabled={!logged} className="btn btn-danger col" onClick={tryLogout}><i className="bi bi-person-x"></i> Logout</button>
                    </div>
                    <div className="col-4 col-sm-4 col-md-3 p-1">
                        <button className="btn btn-secondary col" onClick={tryClose}><i className="bi bi-x d-inline d-sm-none"></i><span className="d-none d-sm-inline">Close</span></button>
                    </div>
                </div>

            </div>
        </Modal>
    )
}

ModalLogin.propTypes = {
    logged: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    userName: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    login: PropTypes.func,
    logout: PropTypes.func,

    isOpen: PropTypes.bool,
    setOpenState: PropTypes.func
}

export default ModalLogin
