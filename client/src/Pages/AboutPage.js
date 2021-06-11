/**
 * @file AboutPage.js
 */
import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { NavLink } from 'react-router-dom'
import './AboutPage.css'
import useNavbarEffect from '../Hooks/useNavbarEffect.hook'

/**
 * Страница инфо
 */
function AboutPage() {
    /**подключение контекста авторизации */
    const auth = useContext(AuthContext)

    /**
     * Обновление навбара при переходе на эту страницу и изменениях
     */
    useNavbarEffect(
        /**Установка кнопки возврата */
        <NavLink to="/auth" className="btn btn-light m-1">
            <span>Назад</span>
        </NavLink>,
        [auth.isAuthenticated, auth.token]
    )

    /**рендер */
    return (
        <div className="AboutPage">
            <div className="p-1 py-3 my-3" >
                <section className="container">
                    <h5>О проекте</h5>
                    <p>Веб-приложение "Заметки" на стеке MERN</p>
                    <a href="https://github.com/maxchistt/react-notes" target="blank">GitHub</a>
                </section>
            </div>
        </div>
    )
}

export default AboutPage