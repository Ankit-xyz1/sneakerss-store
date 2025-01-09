
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
    </Routes>
   
    </>
  )
}

export default App
