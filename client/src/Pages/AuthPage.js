import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../Hooks/http.hook'

import { AuthContext } from '../Context/AuthContext'
import { PageContext } from '../Context/PageContext'

import { NavLink, useHistory } from 'react-router-dom'
import './AuthPage.css'

function AuthPage() {
  const auth = useContext(AuthContext)
  const page = useContext(PageContext)
  const history = useHistory()

  const { loading, request, error, clearError } = useHttp()
  const [form, setForm] = useState({
    email: '', password: ''
  })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (error) setMessage([error, false])
    clearError()
  }, [error, clearError])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form })
      if (data.message) setMessage([data.message, true])
    } catch (e) { }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form })
      auth.login(data.token, data.userId, data.email)
      history.push("/")
    } catch (e) { }
  }

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
  }

  React.useEffect(() => {
    page.setNav(auth.isAuthenticated &&
      <NavLink to="/notes" className="btn btn-light m-1">
        <span><i className="bi bi-x d-inline d-sm-none"></i> К заметкам</span>
      </NavLink>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, auth.token])

  return (
    <div className="AuthPage">


      <div className="p-1 pb-3 mb-3 container" >
        <div className=" form-body mx-auto ">
          <h1 className="text-center">Авторизация</h1>
          <div className="container p-3 bg-light">

            <div className='bg-light form-group mb-2'>
              <div className='mb-1'>
                <span className={auth.isAuthenticated ? `badge badge-success` : `badge badge-secondary`}>
                  {auth.isAuthenticated ? <span><i className="bi bi-key"> </i>AUTORISED</span> : 'UNAUTORISED'}
                </span>
                {auth.email ? <span> {auth.email} </span> : ``}
              </div>
            </div>

            <div className='bg-light form-group'>
              {
                message &&
                <div className={`alert alert-${message[1] ? "info" : "danger"} my-1`} role="alert">
                  <span className={`badge badge-${message[1] ? "info" : "danger"} d-inline mr-2`}>{message[1] ? "Инфо" : "Ошибка"}</span>
                  <span>{String(message[0])}</span>
                </div>
              }

              <label htmlFor="email">Email</label>
              <input
                placeholder="Введите email"
                id="email"
                type="text"
                name="email"
                className="form-control"
                value={form.email}
                onChange={changeHandler}
                readOnly={auth.isAuthenticated}
                onKeyPress={e => e.key === 'Enter' && loginHandler()}
              />

              <label htmlFor="email">Пароль</label>
              <input
                placeholder="Введите пароль"
                id="password"
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={changeHandler}
                readOnly={auth.isAuthenticated}
                onKeyPress={e => e.key === 'Enter' && loginHandler()}
              />
            </div>

            <div className='bg-light form-group form-row'>
              {!auth.isAuthenticated ? (
                <React.Fragment>

                  <div className="col-12 col-sm-4 col-md-5 p-1">
                    <button className="btn btn-primary col" disabled={loading} onClick={loginHandler}><i className="bi bi-person-check"></i> Войти</button>
                  </div>

                  <div className="col p-1">
                    <button className="btn btn-outline-primary col" disabled={loading} onClick={registerHandler}><i className="bi bi-person-plus"></i> Регистрация</button>
                  </div>

                </React.Fragment>
              ) : (
                <React.Fragment>

                  <div className="col-12 p-1">
                    <button className="btn btn-danger col" disabled={loading} onClick={logoutHandler}><i className="bi bi-person-x"></i> Выйти</button>
                  </div>

                </React.Fragment>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage