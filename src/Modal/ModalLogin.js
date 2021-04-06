import React from 'react'
import { ModalContext } from "./Modal"
import PropTypes from 'prop-types'

function useInputValue(defaultValue) {
    const [value, setValue] = React.useState(defaultValue)

    return {
        bind: {
            value,
            onChange: event => setValue(event.target.value)
        },
        clear: () => setValue(defaultValue),
        value: () => value
    }
}

function checkLogin(str) {
    try {
        if (str === null) {
            return false
        }
        else {
            let filtered = str.replace(/@|;|:|\.|,|\/|\\|\||\$|\?|!|#|%|\*|\^|\+|=|\[|\]| |\\ |«|<|>/gi, "").trim()
            return (filtered && filtered.length > 3 && filtered.length < 20 && filtered === str)
        }
    } catch {
        return false
    }
}

function ModalLogin(props) {
    const input = useInputValue(props.userName || "")
    const { open, close, isOpen } = React.useContext(ModalContext)
    const [msg, setMsg] = React.useState("Введите логин")
    React.useEffect(() => { if (!props.logged && props.logged !== null && !isOpen) open() }, [props.logged]) // eslint-disable-line react-hooks/exhaustive-deps

    function onClose() {
        closeAndClear()
        onDismiss()
    }

    function closeAndClear() {
        input.clear()
        close()
    }

    function onLogin(username) {
        closeAndClear()
        console.log('Login:', username)
    }

    function onDismiss() {
        props.dislogin()
        console.log('Login dismissed')
    }

    function tryLogin(value) {
        return new Promise((res, rej) => {
            try {
                if (checkLogin(value.trim())) props.login(value.trim()).then(res, rej)
                else rej(value)
            } catch (e) {
                rej(e)
                console.error(e)
            }
        })
    }

    function submitHandler() {
        if (String(input.value()).trim()) {
            tryLogin(String(input.value()).trim()).then(onLogin, () => setMsg("Исправьте логин"))
        } else setMsg("Введите логин")
    }

    return (
        <React.Fragment>
            <div className='bg-light form-group'>
                <label htmlFor="login">{msg}</label>
                <input type="text" className="form-control" placeholder="Login" id="login" {...input.bind} />
            </div>
            <div className='bg-light form-group form-row'>
                <button className="btn btn-primary col m-1" onClick={submitHandler}>Log in</button>
                <button className="btn btn-danger col m-1" onClick={onClose}>Close</button>
            </div>
        </React.Fragment>
    )
}

ModalLogin.propTypes = {
    logged: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    userName: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    login: PropTypes.func,
    dislogin: PropTypes.func
}

export default ModalLogin
