/**
 * @file App.js
 */
import React from 'react'
import './App.css'
import Loader from './Shared/Components/Loader'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './Hooks/auth.hook'
import { AuthContext } from './Context/AuthContext'
import { PageContext } from './Context/PageContext'

const Header = React.lazy(() => import('./Pages/SharedComponents/Header'))

/**Рендер приложения */
function App() {
  /**подключение хука авторизации */
  const { token, login, logout, userId, email, ready } = useAuth()
  const isAuthenticated = !!token

  /**подключение хука роутов */
  const routes = useRoutes(isAuthenticated)

  /**хук обновления навбара */
  const [nav, setNav] = React.useState(<span className="d-inline" style={{ width: "70px", height: "46px" }}></span>)

  /**рендер */
  return (
    /**
     * обертка в контексты авторизации и обноления хедера
     * внутри роутер со статичным хедером и динамическим содержимым
     * */
    <AuthContext.Provider value={{
      token, login, logout, userId, email, isAuthenticated
    }}>
      <PageContext.Provider value={{ setNav }}>
        <React.Suspense fallback={<div className="container display-4 text-center p-5" > <Loader /> </div>}>
          <Router>
            <Header>{nav}</Header>
            {ready ?
              <div className="App pb-3 mb-3">
                {routes}
              </div>
              :
              <div className="container display-4 text-center p-5" >
                <Loader />
              </div>
            }
          </Router>
        </React.Suspense>
      </PageContext.Provider>
    </AuthContext.Provider>
  )
}

export default App;
