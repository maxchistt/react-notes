/**
 * @file AboutPage.js
 */
import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { PageContext } from '../Context/PageContext'
import { NavLink } from 'react-router-dom'
import './AboutPage.css'

/**
 * Страница инфо
 */
function AboutPage() {
    /**подключение контекстов */
    const auth = useContext(AuthContext)
    const page = useContext(PageContext)

    /**
     * Обновление навбара при переходе на эту страницу и изменениях
     */
    React.useEffect(() => {
        /**Установка кнопки возврата */
        page.setNav(
            <NavLink to="/auth" className="btn btn-light m-1">
                <span>Назад</span>
            </NavLink>
        )
        return page.setNav
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.isAuthenticated, auth.token])

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