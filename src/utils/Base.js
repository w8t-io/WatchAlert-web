import React, { useEffect, useState, useRef } from 'react'
import {
  UserOutlined,
  BellOutlined,
  PieChartOutlined,
  NotificationOutlined,
  CalendarOutlined,
  DashboardOutlined,
  LeftOutlined
} from '@ant-design/icons'
import { Layout, Menu, theme, Avatar, Button, Popover, Spin } from 'antd'
import Auth from './Auth'
import logoIcon from '../img/logo.jpeg'
import githubIcon from '../img/github_logo.png'
import backendIP from './config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

function Base(props) {
  // 鉴权
  Auth()

  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [selectedMenuKey, setSelectedMenuKey] = useState('')
  const [loading, setLoading] = useState(true)
  const cancelToken = useRef(null)

  // 退出
  const handleLogout = () => {
    // 清除LocalStorage中的Authorization值
    localStorage.removeItem('Authorization')
    window.location.reload()
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const content = (
    <div>
      <Button type="text" onClick={handleLogout}>
        退出登录
      </Button>
    </div>
  )

  useEffect(() => {
    cancelToken.current = axios.CancelToken.source()

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://${backendIP}/api/system/userInfo`, {
          cancelToken: cancelToken.current.token
        })
        setUserInfo(res.data.data)
        setLoading(false)
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error)
        }
      }
    }

    fetchData()

    return () => {
      cancelToken.current.cancel()
    }
  }, [])


  const handleMenuClick = (key) => {
    setSelectedMenuKey(key)
    switch (key) {
      case '1':
        navigate('/')
        break
      case '2-1':
        navigate('/alertRuleGroup')
        break
      case '2-2':
        navigate('/silenceRules')
        break
      case '2-3':
        navigate('/alertCurEvent')
        break
      case '2-4':
        navigate('/alertHisEvent')
        break
      case '2-5':
        navigate('/ruleTemplateGroup')
        break
      case '3-1':
        navigate('/noticeObjects')
        break
      case '3-2':
        navigate('/noticeTemplate')
        break
      case '4-1':
        navigate('/dutyManage')
        break
      case '5-1':
        navigate('/user')
        break
      case '5-2':
        navigate('/userRole')
        break
      case '6':
        navigate('/datasource')
        break
      default:
        break
    }
  }

  // 加载页
  if (loading) {
    return (
      <Spin tip="Loading...">
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
      </Spin>
    )
  }

  const goBackPage = () => {
    window.history.back()
  }

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

        <div className="footer">
          <a target="_blank" title="Logo">
            <img src={logoIcon} alt="Logo" className="icon" style={{ width: '100%', height: '100%' }} />
          </a>
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
        >

          <Menu.Item key="1" onClick={() => handleMenuClick('1')} icon={<DashboardOutlined />}>仪表盘</Menu.Item>

          <SubMenu key="2" icon={<BellOutlined />} title="告警管理">
            <Menu.Item key="2-1" onClick={() => handleMenuClick('2-1')}>告警规则</Menu.Item>
            <Menu.Item key="2-2" onClick={() => handleMenuClick('2-2')}>静默规则</Menu.Item>
            <Menu.Item key="2-3" onClick={() => handleMenuClick('2-3')}>当前告警</Menu.Item>
            <Menu.Item key="2-4" onClick={() => handleMenuClick('2-4')}>历史告警</Menu.Item>
            <Menu.Item key="2-5" onClick={() => handleMenuClick('2-5')}>规则模版</Menu.Item>
          </SubMenu>

          <SubMenu key="3" icon={<NotificationOutlined />} title="告警通知">
            <Menu.Item key="3-1" onClick={() => handleMenuClick('3-1')}>通知对象</Menu.Item>
            <Menu.Item key="3-2" onClick={() => handleMenuClick('3-2')}>通知模版</Menu.Item>
          </SubMenu>

          <SubMenu key="4" icon={<CalendarOutlined />} title="值班管理">
            <Menu.Item key="4-1" onClick={() => handleMenuClick('4-1')}>值班日程</Menu.Item>
          </SubMenu>


          {userInfo !== null && userInfo.role === 'admin' ? (
            <SubMenu key="5" icon={<UserOutlined />} title="人员组织">
              <Menu.Item key="5-1" onClick={() => handleMenuClick('5-1')}>用户管理</Menu.Item>
              <Menu.Item key="5-2" onClick={() => handleMenuClick('5-2')}>角色管理</Menu.Item>
            </SubMenu>
          ) : null}

          <Menu.Item key="6" onClick={() => handleMenuClick('6')} icon={<PieChartOutlined />}>数据源</Menu.Item>
        </Menu>

      </Sider>

      {/* 内容区 */}
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        {/* 右侧顶部 */}
        <Layout style={{ padding: 0 }}>
          <Header
            style={{
              height: '9vh',
              margin: '16px 16px 0',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '20px',
                marginRight: 'auto',
              }}
            >
              <div style={{ height: '2px' }}>
                <Button type="text" shape="circle" icon={<LeftOutlined />} onClick={goBackPage} />
              </div>
              <div style={{ marginLeft: '30px' }}>
                {props.name}
              </div>
            </div>

            {userInfo !== null ? (
              <div style={{ position: 'relative' }}>
                <Popover content={content} trigger="click" placement="bottom">
                  <Avatar
                    style={{
                      backgroundColor: '#7265e6',
                      verticalAlign: 'middle',
                      marginLeft: '10px',
                    }}
                    size="large"
                    gap="5"
                  >
                    {userInfo.username}
                  </Avatar>
                </Popover>
              </div>
            ) : null}
          </Header>
        </Layout>

        {/* 右侧内容区 */}
        <Layout>
          <Content
            style={{
              margin: '20px 10px 0',
              overflow: 'initial',
              height: '77vh',
              margin: '16px 16px 0',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div
              className="site-layout-background"
              style={{ padding: 24, textAlign: 'center' }}
            >
              {<props.children />}
            </div>
          </Content>
        </Layout>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '25px' }}>
          <a href="https://github.com/Cairry/WatchAlert" target="_blank" title="GitHub">
            <img src={githubIcon} alt="GitHub Icon" className="icon" style={{ width: '2vh', height: '2vh', marginRight: '5px' }} />
          </a>
        </div>
        <Footer style={{ textAlign: 'center', padding: '8px' }}>WatchAlert ©2024 Created by Cairry</Footer>

      </Layout>
    </Layout>
  )

}

export default Base