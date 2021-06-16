import React from 'react'
import { render, screen } from '@testing-library/react'
import NotesPage from './NotesPage'

test('renders NotesPage', () => {
    render(<NotesPage />)
    const addnote = screen.getByPlaceholderText(/Note name/i)
    expect(addnote).toBeInTheDocument()
})
