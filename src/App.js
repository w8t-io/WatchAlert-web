import React from 'react'
import { Helmet } from 'react-helmet'
import Login from './Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Datasources from './datasources/Datasources'
import Home from './Home'
import AlertRules from './alert/AlertRules'
import SilenceRules from './silence/SilenceRules'
import NoticeObjects from './notice/NoticeObjects'
import AlertCurEvent from './alert/AlertCurEvent'
import AlertHisEvent from './alert/AlertHisEvent'
import User from './members/User'
import UserRole from './members/UserRole'
import DutyManage from './duty/DutyManage'
import NoticeTemplate from './notice/NoticeTemplate'
import AlertRuleGroup from './alert/AlertRuleGroup'
import RuleTemplateGroup from './alert/RuleTemplateGroup'
import RuleTemplate from './alert/RuleTemplate'
import Base from './utils/Base'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {/* 路由 */}
        <Routes>
          <Route path="/" element={<Base name="首页" children={Home} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/alertRuleGroup" element={<Base name="告警规则组" children={AlertRuleGroup} />} />
          <Route path="/alertRuleGroup/:id/alertRules" element={<Base name="告警规则" children={AlertRules} />} />
          <Route path="/silenceRules" element={<Base name="静默规则" children={SilenceRules} />} />
          <Route path="/alertCurEvent" element={<Base name="当前告警" children={AlertCurEvent} />} />
          <Route path="/alertHisEvent" element={<Base name="历史告警" children={AlertHisEvent} />} />
          <Route path="/ruleTemplateGroup" element={<Base name="规则模版组" children={RuleTemplateGroup} />} />
          <Route path="/ruleTemplateGroup/:ruleGroupName/ruleTemplate" element={<Base name="规则模版" children={RuleTemplate} />} />
          <Route path="/noticeObjects" element={<Base name="通知对象" children={NoticeObjects} />} />
          <Route path="/noticeTemplate" element={<Base name="通知模版" children={NoticeTemplate} />} />
          <Route path="/dutyManage" element={<Base name="值班日程" children={DutyManage} />} />
          <Route path="/user" element={<Base name="用户管理" children={User} />} />
          <Route path="/userRole" element={<Base name="角色管理" children={UserRole} />} />
          <Route path='/datasource' element={<Base name="数据源" children={Datasources} />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default function AppWithHelmet() {
  return (
    <React.Fragment>
      <Helmet>
        <title>WatchAlert</title>
      </Helmet>
      <App />
    </React.Fragment>
  )
}