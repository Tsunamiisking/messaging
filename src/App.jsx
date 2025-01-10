import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css'
import Login from './Pages/Login';
import Users from './Pages/Users';
import User from './Pages/User';
import Signup from './Pages/Signup';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/users' element={<Users />} />
        <Route path='/user/:id' element={<User />} />

      </Routes>
    </Router>
  )


}

export default App
