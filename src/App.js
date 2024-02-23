import React from 'react'
import { Helmet } from 'react-helmet'
import Login from './Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Datasources from './Datasources'
import Home from './Home'
import AlertRules from './AlertRules'
import SilenceRules from './SilenceRules'
import NoticeObjects from './NoticeObjects'
import AlertCurEvent from './AlertCurEvent'
import AlertHisEvent from './AlertHisEvent'
import User from './User'
import UserRole from './UserRole'
import DutyManage from './DutyManage'
import NoticeTemplate from './NoticeTemplate'
import AlertRuleGroup from './AlertRuleGroup'
import RuleTemplateGroup from './RuleTemplateGroup'
import RuleTemplate from './RuleTemplate'

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        {/* 路由 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/alertRuleGroup" element={<AlertRuleGroup />} />
          <Route path="/alertRuleGroup/:id/alertRules" element={<AlertRules />} />
          <Route path="/silenceRules" element={<SilenceRules />} />
          <Route path="/alertCurEvent" element={<AlertCurEvent />} />
          <Route path="/alertHisEvent" element={<AlertHisEvent />} />
          <Route path="/ruleTemplateGroup" element={<RuleTemplateGroup />} />
          <Route path="/ruleTemplateGroup/:ruleGroupName/ruleTemplate" element={<RuleTemplate />} />
          <Route path="/noticeObjects" element={<NoticeObjects />} />
          <Route path="/noticeTemplate" element={<NoticeTemplate />} />
          <Route path="/dutyManage" element={<DutyManage />} />
          <Route path="/user" element={<User />} />
          <Route path="/userRole" element={<UserRole />} />
          <Route path='/datasource' element={<Datasources />} />
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