import React from 'react'
import { Helmet } from 'react-helmet'
import Base from './Base'
import Login from './Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        {/* 路由 */}
        <Routes>
          <Route path="/" element={<Base />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default function AppWithHelmet () {
  return (
    <React.Fragment>
      <Helmet>
        <title>WatchAlert</title>
      </Helmet>
      <App />
    </React.Fragment>
  )
}