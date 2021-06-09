import {createContext} from 'react'

function noop() {}

/**контекст авторизации */
export const AuthContext = createContext({
  token: null,
  userId: null,
  email: null,
  login: noop,
  logout: noop,
  isAuthenticated: false
})
