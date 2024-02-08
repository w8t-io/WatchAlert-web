import React from 'react'
import Base from './Base'
import Login from './Login'
import Test from './Test'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

class App extends React.Component {

  render () {
    return (
      // <div>App</div>
      <BrowserRouter>

        {/* 路由 */}
        <Routes>
          <Route path="/" element={<Base />} ></Route>
          <Route path="/login" element={<Login />} ></Route>
          <Route path='/Test' element={<Test />}></Route>
        </Routes>

      </BrowserRouter>
    )
  }
}

export default App