import React from 'react'
import { render, screen } from '@testing-library/react'
import AboutPage from './AboutPage'

test('renders AboutPage', () => {
    render(<AboutPage />)

    const docs = screen.getByText(/Документация/i)
    const github = screen.getByText(/GitHub/i)

    expect(docs).toBeInTheDocument()
    expect(github).toBeInTheDocument()
})