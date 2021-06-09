import React from 'react';

import './App.css';

import Loader from './shared/Loader'

import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'

function App() {
  const { token, login, logout, userId, email, ready } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return (
      <div className="container display-4 text-center p-3" >
        <Loader />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, email, isAuthenticated
    }}>
      <Router>
        <div className="App pb-3 mb-3">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
