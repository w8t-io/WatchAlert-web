import React from 'react'
import Base from './Base'
import NoticeObjectCreateModal from './NoticeObjectCreateModal'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

class App extends React.Component {
  const = ""
  render () {
    return (
      // <div>App</div>
      <BrowserRouter>

        {/* 路由 */}
        <Routes>
          <Route path="/" element={<Base />} ></Route>
          <Route path="/test" element={<NoticeObjectCreateModal />} ></Route>
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App