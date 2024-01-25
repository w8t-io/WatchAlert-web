import React, { useState } from 'react'
import {
  UserOutlined,
  BellOutlined,
  PieChartOutlined,
  NotificationOutlined,
  CalendarOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { Layout, Menu, theme, Image } from 'antd'
import AlertRules from './AlertRules'
import SilenceRules from './SilenceRules'
import NoticeObjects from './NoticeObjects'
import Datasources from './Datasources'
import EchartsComponent from './EchartsComponent'
import Auth from './Auth'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

function Base () {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [selectedKeys, setSelectedKeys] = useState(['1'])
  const [selectedValue, setSelectedValue] = useState('首页')

  const handleMenuSelect = ({ key }) => {
    const selectedButton = menuItems.find(item => item.key === key)
    setSelectedKeys([key])
    setSelectedValue(selectedButton.value)
  }

  Auth()

  const menuItems = [
    { key: '1', value: '首页' },
    { key: '2', value: '告警规则' },
    { key: '3', value: '静默规则' },
    { key: '4', value: '当前告警' },
    { key: '5', value: '历史告警' },
    { key: '6', value: '通知对象' },
    { key: '7', value: '通知模版' },
    { key: '8', value: '值班用户' },
    { key: '9', value: '值班排表' },
    { key: '10', value: '用户管理' },
    { key: '11', value: '组织管理' },
    { key: '12', value: '数据源' },
  ]

  return (

    <Layout hasSider>
      {/* 导航栏 */}
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'white', // 将背景色调整为白色
        }}
      >
        <img
          style={{ width: 200 }}
          src="https://media.istockphoto.com/id/1481521952/zh/%E5%90%91%E9%87%8F/professional-innovative-initial-wv-logo-and-vw-logo-letter-wv-or-vw-minimal-elegant-monogram.jpg?s=612x612&w=0&k=20&c=tcqk6EYeLI9-qgURv8SZX5dGdMEf8PQd30-NGYMsql4="
          alt="Image"
        />

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          onSelect={handleMenuSelect}
        >

          <Menu.Item key="1" icon={<HomeOutlined />}>首页</Menu.Item>

          <SubMenu key="sub1" icon={<BellOutlined />} title="告警管理">
            <Menu.Item key="2">告警规则</Menu.Item>
            <Menu.Item key="3">静默规则</Menu.Item>
            <Menu.Item key="4">当前告警</Menu.Item>
            <Menu.Item key="5">历史告警</Menu.Item>
          </SubMenu>

          <SubMenu key="sub2" icon={<NotificationOutlined />} title="告警通知">
            <Menu.Item key="6">通知对象</Menu.Item>
            <Menu.Item key="7">通知模版</Menu.Item>
          </SubMenu>

          <SubMenu key="sub3" icon={<CalendarOutlined />} title="值班管理">
            <Menu.Item key="8">值班用户</Menu.Item>
            <Menu.Item key="9">值班排表</Menu.Item>
          </SubMenu>

          <SubMenu key="sub4" icon={<UserOutlined />} title="人员组织">
            <Menu.Item key="10">用户管理</Menu.Item>
            <Menu.Item key="11">组织管理</Menu.Item>
          </SubMenu>

          <Menu.Item key="12" icon={<PieChartOutlined />}>数据源</Menu.Item>
        </Menu>
      </Sider>

      {/* 右侧顶部 */}
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{
            height: '8vh',
            margin: '16px 16px 0',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>

          <div
            style={{
              fontWeight: 'bold',
              fontSize: '20px'
            }}>

            {selectedValue}

          </div>
        </Header>

        {/* 右侧中部内容区 */}
        <Content
          style={{
            margin: '20px 16px 0',
            height: '90vh',
            padding: 5,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selectedKeys[0] === '1' && <EchartsComponent />}
          {selectedKeys[0] === '2' && <AlertRules />}
          {selectedKeys[0] === '3' && <SilenceRules />}
          {selectedKeys[0] === '6' && <NoticeObjects />}
          {selectedKeys[0] === '12' && <Datasources />}

        </Content>

      </Layout>
    </Layout>
  )
}

export default Base