import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import CardsPage from './pages/CardsPage'

import AuthPage from './pages/AuthPage'

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
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
    <Switch>
      <Route path="/authpage" exact>
        <AuthPage />
      </Route>
      <Redirect to="/authpage" />
    </Switch>
  )
}
