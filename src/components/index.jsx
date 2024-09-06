import React, { useEffect, useState } from 'react'
import {
    Layout,
    theme,
    Avatar, Button,
    Popover,
    Spin,
    Menu,
    Typography,
    Dropdown,
    Space, message, Divider
} from 'antd'
import { DownOutlined, LeftOutlined } from '@ant-design/icons';
import logoIcon from '../img/logo.jpeg'
import githubIcon from '../img/github_logo.png'
import { getUserInfo } from '../api/user'
import Auth from '../utils/Auth'
import { getTenantList } from '../api/tenant'
import './index.css';
import { ComponentSider } from './sider'
import { useNavigate } from 'react-router-dom'

export const ComponentsContent = (props) => {
    const { name, c } = props
    const navigate = useNavigate()
    const { Header, Content, Footer } = Layout
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [tenantList, setTenantList] = useState([])
    const [getTenantStatus, setTenantStatus] = useState(null);

    Auth()

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    const content = (
        <>
            <Button type="text" onClick={handleLogout}>
                退出登录
            </Button>
        </>
    )

    const run = async () => {
        try {
            const res = await getUserInfo()
            setUserInfo(res.data)
            setLoading(false)
            if (res.data.userid) {
                fetchTenantList(res.data.userid)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getTenantName = () => {
        return localStorage.getItem('TenantName')
    }

    const getTenantIndex = () => {
        return localStorage.getItem('TenantIndex')
    }

    const fetchTenantList = async (userid) => {
        try {
            const params={
                userId: userid
            }
            const res = await getTenantList(params)
            console.log(res.data)
            if (res.data === null || res.data.length === 0){
                message.error("该用户没有可用租户")
            }
            const opts = res.data.map((key, index) => (
                {
                    'label': key.name,
                    'value': key.id,
                    'index': index
                }
            ))
            setTenantList(opts)
            if (getTenantName() === null) {
                localStorage.setItem('TenantName', opts[0].label)
                localStorage.setItem('TenantID', opts[0].value)
                localStorage.setItem('TenantIndex', opts[0].index)
            }
            setTenantStatus(true);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        // fetchTenantList()
        run()
    }, [])

    if (loading || !getTenantStatus) {
        return (
            <Spin tip="Loading...">
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
            </Spin>
        )
    }

    const goBackPage = () => {
        window.history.back()
    }

    const changeTenant = (c) => {
        localStorage.setItem("TenantIndex", c.key)
        if (c.item.props.name) {
            localStorage.setItem("TenantName", c.item.props.name)
        }
        if (c.item.props.value) {
            localStorage.setItem('TenantID', c.item.props.value)
        }
        window.location.reload()
    }

    const items = tenantList

    const menu = (
        <Menu selectable defaultSelectedKeys={getTenantIndex()} onSelect={changeTenant}>
            {items.map((item) => (
                <Menu.Item key={item.index} name={item.label} value={item.value}>
                    {item.label}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <>
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

                            <div style={{marginTop: '25px', marginLeft: '-30px'}}>
                                <div className="footer">
                                    <a target="_blank" title="Logo">
                                        <img src={logoIcon} alt="Logo" className="icon"
                                             style={{width: '40%', height: '40%'}}/>
                                    </a>
                                </div>
                            </div>

                            <div style={{fontSize: 15, fontWeight: 'bold'}}>
                                <div style={{position: 'absolute', left: '100px', top: '12px'}}>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <Typography.Link style={{fontSize: 15, color: 'black'}}>
                                            <Space>
                                                多租户
                                                <DownOutlined/>
                                            </Space>
                                        </Typography.Link>
                                    </Dropdown>
                                </div>
                            </div>

                            <div style={{position: 'absolute', top: '12px', right: '35px', bottom: '10px'}}>
                                {userInfo !== null ? (
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
                    <Layout>
                        <Content
                            style={{
                                height: 'calc(98vh - 100px )',
                                margin: '0px 16px 0',
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <div style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginLeft: '1%',
                                justifyContent: 'center',
                                marginTop: '20px'
                            }}>
                                <Button type="text" shape="circle" icon={<LeftOutlined/>} onClick={goBackPage}/>
                                {name}
                            </div>
                            <div
                                className="site-layout-background"
                                style={{padding: 24, textAlign: 'center', height: '10px'}}
                            >
                                <Divider style={{marginTop: '-10px', marginBottom: '40px'}}/>
                                {c}
                            </div>
                        </Content>
                        <span style={{textAlign:'center',color:'#B1B1B1FF',marginLeft:'-200px'}}> WatchAlert 轻量级一站式监控报警服务!</span>
                    </Layout>

                    {/*<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1vh' }}>*/}
                    {/*    <a href="https://github.com/w8t-io/WatchAlert" target="_blank" title="GitHub" rel="noreferrer">*/}
                    {/*        <img src={githubIcon} alt="GitHub Icon" className="icon" style={{ width: '2vh', height: '2vh', marginRight: '5px' }} />*/}
                    {/*    </a>*/}
                    {/*</div>*/}

                </Layout>
            </Layout >
        </>
    )

}