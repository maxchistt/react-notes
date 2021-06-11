/**
 * @file AuthPage.js
 */
import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../Hooks/http.hook'
import { AuthContext } from '../Context/AuthContext'
import { PageContext } from '../Context/PageContext'
import { NavLink, useHistory } from 'react-router-dom'
import './AuthPage.css'

/**
 * Страница авторизации
 */
function AuthPage() {
  /**подключение контекстов */
  const auth = useContext(AuthContext)
  const page = useContext(PageContext)

  const history = useHistory()

  /**подключение хука http запросов */
  const { loading, request, error, clearError } = useHttp()

  /**состояние формы */
  const [form, setForm] = useState({
    email: '', password: ''
  })

  /**хук сообщений от сервера */
  const [message, setMessage] = useState(null)

  /** очистка оштбок хука запросов и запись ошибки в сообщение*/
  useEffect(() => {
    if (error) setMessage([error, false])
    clearError()
  }, [error, clearError])

  /**
   * обработчик ввода данных в форму
   * @param {*} event 
   */
  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  /**
   * обработчик регистрации
   */
  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form })
      if (data.message) setMessage([data.message, true])
    } catch (e) { }
  }

  /**
   * Обработчик входа в систему
   */
  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form })
      auth.login(data.token, data.userId, data.email)
      history.push("/")
    } catch (e) { }
  }

  /**
   * Обработчик выхода
   */
  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
  }

  /**
   * Обновление навбара при переходе на эту страницу и изменениях
   */
  React.useEffect(() => {
    /**Установка кнопок возврата к странице заметок и инфо*/
    page.setNav(
      <React.Fragment>
        <NavLink to="/about" className="btn btn-light m-1">
          <span>Инфо</span>
        </NavLink>
        {auth.isAuthenticated &&
          <NavLink to="/notes" className="btn btn-light m-1">
            <span>К заметкам</span>
          </NavLink>}
      </React.Fragment>
    )
    return page.setNav
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, auth.token])

  /**рендер */
  return (
    /**Здесь отрисовываются меню регистрации и авторизации */
    <div className="AuthPage">
      <div className="p-1 py-5 mt-3 container" >
        <div className="form-body px-5 py-4 mx-auto">
          {/**Индикатор авторизации */}
          <div className='form-group mb-2'>
            <div className='mb-1'>
              <span className={auth.isAuthenticated ? `badge badge-success` : `badge badge-secondary`}>
                {auth.isAuthenticated ? <span><i className="bi bi-key"> </i>AUTORISED</span> : 'UNAUTORISED'}
              </span>
              {auth.email ? <span> {auth.email} </span> : ``}
            </div>
          </div>
          {/**Надпись */}
          <div className='form-group mb-3'>
            <h1 className="text-center">Авторизация</h1>
          </div>
          {/**Форма авторизации */}
          <div className='form-group'>
            {message &&
              /**Уведомление */
              <div className={`alert alert-${message[1] ? "info" : "danger"} my-1`} role="alert">
                <span className={`badge badge-${message[1] ? "info" : "danger"} d-inline mr-2`}>{message[1] ? "Инфо" : "Ошибка"}</span>
                <span>{String(message[0])}</span>
              </div>}
            {/**Поле email */}
            <label htmlFor="email">Email</label>
            <input
              placeholder="Введите email"
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              className="form-control mb-1"
              value={form.email}
              onChange={changeHandler}
              readOnly={auth.isAuthenticated}
              onKeyPress={e => e.key === 'Enter' && loginHandler()}
            />
            {/**Поле с паролем */}
            <label htmlFor="password">Пароль</label>
            <input
              placeholder="Введите пароль"
              id="password"
              type="password"
              name="password"
              className="form-control mb-1"
              value={form.password}
              onChange={changeHandler}
              readOnly={auth.isAuthenticated}
              onKeyPress={e => e.key === 'Enter' && loginHandler()}
            />
          </div>
          {/**Кнопки действия */}
          <div className='form-group form-row'>
            {!auth.isAuthenticated ? (
              /**Вход и регистрация если не авторизирован */
              <React.Fragment>
                <div className="col-12 col-sm-4 col-md-5 p-1">
                  <button className="btn btn-primary col" disabled={loading} onClick={loginHandler}><i className="bi bi-person-check"></i> Войти</button>
                </div>
                <div className="col p-1">
                  <button className="btn btn-outline-primary col" disabled={loading} onClick={registerHandler}><i className="bi bi-person-plus"></i> Регистрация</button>
                </div>
              </React.Fragment>
            ) : (
              /**Выход если авторизирован */
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
  )
}

export default AuthPage