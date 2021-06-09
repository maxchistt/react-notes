import { createContext } from 'react'

function noop() { }

/**контекст данных страницы */
export const PageContext = createContext({ setNav: noop })
