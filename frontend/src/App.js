import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import ELearning from './components/ELearning'
import Signup from './components/Signup'
import Services from './components/Services'
import Admin from './components/Admin'
import Course from './components/Course'

function App() {

  return (
   <div>
    <BrowserRouter>
    <Routes>
      <Route exact path = '/' element = {<Home/>}></Route>
      <Route path='/login' element = {<Login/>}></Route>
      <Route path='/signup' element = {<Signup/>}></Route>
      <Route path='/elearning' element = {<ELearning/>}></Route>
      <Route path='/services' element = {<Services/>}></Route>
      <Route path='/admin' element = {<Admin/>}></Route>
      <Route path='/course/:id' element = {<Course/>}></Route>
    </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App