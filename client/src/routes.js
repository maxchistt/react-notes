/**
 * @file routes.js
 */
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

const NotesPage = React.lazy(() => import('./Pages/NotesPage'))
const AuthPage = React.lazy(() => import('./Pages/AuthPage'))
const AboutPage = React.lazy(() => import('./Pages/AboutPage'))

/**
 * Хук маршрутизации, содержаший в себе роуты
 * @param {*} isAuthenticated 
 */
export const useRoutes = isAuthenticated => {
  return (
    <React.Suspense>
      {isAuthenticated ? (
        /**Набор роутов в случае авторизации */
        <Switch>
          <Route path="/auth" exact>
            <AuthPage />
          </Route>
          <Route path="/about" exact>
            <AboutPage />
          </Route>
          <Route path="/notes" exact>
            <NotesPage />
          </Route>
          <Redirect to="/notes" />
        </Switch>
      ) : (
        /**Набор роутов в случае неавторизации */
        <Switch>
          <Route path="/auth" exact>
            <AuthPage />
          </Route>
          <Route path="/about" exact>
            <AboutPage />
          </Route>
          <Redirect to="/auth" />
        </Switch>
      )}
    </React.Suspense>
  )
}
