import React from 'react'
import { render, screen } from '@testing-library/react'
import AuthPage from './AuthPage'

test('renders AuthPage', () => {
    render(<AuthPage />)
    const email = screen.getByText(/Email/i)
    const password = screen.getByText(/Пароль/i)
    const log = screen.getByText(/Войти/i)
    const reg = screen.getByText(/Регистрация/i)

    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
    expect(log).toBeInTheDocument()
    expect(reg).toBeInTheDocument()
})
