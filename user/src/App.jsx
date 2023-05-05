import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ErrorPage, Home, SignIn, SignUp } from './modules'
import { ProtectedRoute } from './components'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<ProtectedRoute element={Home} />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App