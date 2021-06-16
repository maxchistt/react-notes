/**
 * @file AboutPage.js
 */
import React from 'react'
import { NavLink } from 'react-router-dom'
import './AboutPage.css'
import useNavbarEffect from '../Hooks/useNavbarEffect.hook'

/**
 * Страница инфо
 */
function AboutPage() {
    /**
     * Обновление навбара при переходе на эту страницу и изменениях
     */
    useNavbarEffect(
        /**Установка кнопки возврата */
        <NavLink to="/auth" className="btn btn-light m-1">
            <span>Назад</span>
        </NavLink>,
        []
    )

    /**рендер */
    return (
        <div className="AboutPage">
            <div className="p-1 py-3 my-3" >
                <section className="container">
                    <h5>О проекте</h5>
                    <p>Веб-приложение "Заметки" на стеке MERN с авторизацией, синхронизацией и удобным интерфейсом редактирования</p>
                    <p>
                        <a href="http://react-notes-docs.std-1033.ist.mospolytech.ru" target="blank">Документация</a>
                        <br />
                        <a href="https://github.com/maxchistt/react-notes" target="blank">GitHub</a>
                    </p>
                </section>
            </div>
        </div>
    )
}

export default AboutPage