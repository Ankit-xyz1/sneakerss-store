
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import YourCourses from './pages/YourCourses'
import BuyCourse from './pages/BuyCourse'
import Profile from './pages/Profile.jsx'
import CreateCourse from './pages/CreateCourse.jsx'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/yourCourses' element={<YourCourses/>}></Route>
      <Route path="/buycourse/:id" element={<BuyCourse/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/createCourse" element={<CreateCourse/>} />
    </Routes>
   
    </>
  )
}

export default App
