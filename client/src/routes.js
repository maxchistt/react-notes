/**
 * @file routes.js
 */
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import NotesPage from './Pages/NotesPage'
import AuthPage from './Pages/AuthPage'

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      /**Набор роутов в случае авторизации */
      <Switch>
        <Route path="/auth" exact>
          <AuthPage />
        </Route>
        <Route path="/notes" exact>
          <NotesPage />
        </Route>
        <Redirect to="/notes" />
      </Switch>
    )
  }

  return (
    /**Набор роутов в случае неавторизации */
    <Switch>
      <Route path="/auth" exact>
        <AuthPage />
      </Route>
      <Redirect to="/auth" />
    </Switch>
  )
}
