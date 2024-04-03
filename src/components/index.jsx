import React, { useEffect, useState } from 'react'
import {
    Layout,
    theme,
    Avatar, Button,
    Popover,
    Spin,
    Divider,
    Modal,
    Card, Col,
    Row,
    Typography
} from 'antd'
import logoIcon from '../img/logo.jpeg'
import githubIcon from '../img/github_logo.png'
import { getUserInfo } from '../api/user'
import Auth from '../utils/Auth'
import { getTenantList } from '../api/tenant'
import './index.css';
import { ComponentSider } from './sider'

export const ComponentsContent = (props) => {
    const { Text } = Typography;
    const { name, c } = props
    const { Header, Content, Footer } = Layout
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [tenantList, setTenantList] = useState([])
    const [tenantModal, setTenantModal] = useState(false)

    Auth()

    const handleLogout = () => {
        // 清除LocalStorage中的Authorization值
        localStorage.removeItem('Authorization')
        window.location.reload()
    }

    const openTenantModal = () => {
        fetchTenantList()
        setTenantModal(true)
    }

    const closeTenantModal = () => [
        setTenantModal(false)
    ]

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    const content = (
        <div>
            <div>
                <Button type="text" onClick={openTenantModal}>
                    切换租户
                </Button>
            </div>
            <Divider style={{ margin: '5px 0' }} />
            <div>
                <Button type="text" onClick={handleLogout}>
                    退出登录
                </Button>
            </div>
        </div>
    )

    const run = async () => {
        try {
            const params = {
                'Authorization': localStorage.getItem('Authorization')
            }
            const res = await getUserInfo(params)
            setUserInfo(res.data)
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    const getTenantName = () => {
        return localStorage.getItem('TenantName')
    }

    const fetchTenantList = async () => {
        try {
            const res = await getTenantList()
            const opts = res.data.map((key) => (
                {
                    'label': key.name,
                    'value': key.id
                }
            ))
            setTenantList(opts)
            if (getTenantName() === null) {
                localStorage.setItem('TenantName', opts[0].label)
                localStorage.setItem('TenantID', opts[0].value)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        run()
        fetchTenantList()
    }, [])

    if (loading) {
        return (
            <Spin tip="Loading...">
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
            </Spin>
        )
    }

    const changeTenant = (c) => {
        if (c.label) {
            localStorage.setItem("TenantName", c.label)
        }
        if (c.value) {
            localStorage.setItem('TenantID', c.value)
        }
        setTenantModal(false)
        window.location.reload()
    }

    const cardsStyle = {
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    };

    return (
        <>
            <Modal title="租户列表"
                open={tenantModal}
                onCancel={closeTenantModal}
                footer={null}>
                <Text type="secondary">｜当前租户: {getTenantName()}</Text>
                <Row gutter={16} style={{ marginTop: '30px' }}>
                    {tenantList.map((key) => (
                        <Col span={8} style={{ marginTop: '10px' }}>
                            <Card
                                bordered={false}
                                style={cardsStyle}
                                onClick={() => changeTenant(key)}
                                className="card-interactive"
                            >
                                {key.label}
                                <p style={{ fontSize: 10 }}>
                                    <sup><small>{key.value}</small></sup>
                                </p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Modal>

            <Layout style={{ height: '100vh', overflow: 'hidden', }}>
                {/* 导航栏 */}
                <div style={{
                    marginLeft: '15px',
                    marginTop: '89px',
                }}>
                    {<ComponentSider userInfo={userInfo} />}
                </div>

                {/* 内容区 */}
                <Layout className="site-layout" >
                    {/* 右侧顶部 */}
                    <Layout style={{ marginLeft: '-216px', padding: 0, borderRadius: '12px', }}>
                        <Header
                            style={{
                                height: '60px',
                                margin: '16px 16px 0',
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                display: 'flex',
                                alignItems: 'center',
                            }}>

                            <div style={{ marginTop: '25px', marginLeft: '-30px' }}>
                                <div className="footer">
                                    <a target="_blank" title="Logo">
                                        <img src={logoIcon} alt="Logo" className="icon" style={{ width: '8%', height: '8%' }} />
                                    </a>
                                </div>
                            </div>

                            <div style={{ fontSize: 15, fontWeight: 'bold' }}>
                                <div style={{ position: 'absolute', left: '100px', top: '12px' }}>
                                    当前租户：{getTenantName()}
                                </div>
                                <div>
                                    {name}
                                </div>
                            </div>

                            <div style={{ position: 'absolute', top: '10px', right: '30px', bottom: '10px' }}>                            {userInfo !== null ? (
                                <Popover content={content} trigger="hover" placement="bottom">
                                    <Avatar
                                        style={{
                                            backgroundColor: '#7265e6',
                                            verticalAlign: 'middle',
                                        }}
                                        size="large"
                                    >
                                        {userInfo.username}
                                    </Avatar>
                                </Popover>
                            ) : null}
                            </div>
                        </Header>
                    </Layout>

                    {/* 右侧内容区 */}
                    <Layout style={{ marginTop: '15px' }}>
                        <Content
                            style={{
                                height: 'calc(100vh - 80px - 65px)',
                                margin: '0px 16px 0',
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                borderRadius: '10px'
                            }}
                        >
                            <div
                                className="site-layout-background"
                                style={{ padding: 24, textAlign: 'center', height: '10px' }}
                            >
                                {c}
                            </div>
                        </Content>
                    </Layout>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1vh' }}>
                        <a href="https://github.com/Cairry/WatchAlert" target="_blank" title="GitHub" rel="noreferrer">
                            <img src={githubIcon} alt="GitHub Icon" className="icon" style={{ width: '2vh', height: '2vh', marginRight: '5px' }} />
                        </a>
                    </div>
                    <Footer style={{ textAlign: 'center', padding: '1vh' }}>WatchAlert ©2024 Created by Cairry</Footer>

                </Layout>
            </Layout >
        </>
    )

}