import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import CardsPage from './Pages/CardsPage'
import AuthPage from './Pages/AuthPage'

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      /**Набор роутов в случае авторизации */
      <Switch>
        <Route path="/authpage" exact>
          <AuthPage />
        </Route>
        <Route path="/notes" exact>
          <CardsPage />
        </Route>
        <Redirect to="/notes" />
      </Switch>
    )
  }

  return (
    /**Набор роутов в случае неавторизации */
    <Switch>
      <Route path="/authpage" exact>
        <AuthPage />
      </Route>
      <Redirect to="/authpage" />
    </Switch>
  )
}
