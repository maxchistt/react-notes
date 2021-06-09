import { createContext } from 'react'

function noop() { }

export const PageContext = createContext({ setNav: noop })
