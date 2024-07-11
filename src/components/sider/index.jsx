import React, { useState } from 'react';
import {
    UserOutlined,
    BellOutlined,
    PieChartOutlined,
    NotificationOutlined,
    CalendarOutlined,
    DashboardOutlined,
    DeploymentUnitOutlined,
    AreaChartOutlined,
    FileDoneOutlined,
    SettingOutlined,
    // CloudSyncOutlined,
    // SafetyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Menu, Layout } from 'antd';

export const ComponentSider = (props) => {
    const { SubMenu } = Menu
    const { userInfo } = props
    const navigate = useNavigate()
    const [selectedMenuKey, setSelectedMenuKey] = useState('')

    const handleMenuClick = (key, uri) => {
        if (uri !== undefined) {
            setSelectedMenuKey(key);
            navigate(uri);
        }
    };

    const renderMenu = () => {
        if (userInfo && userInfo.role === 'admin') {
            return (
                <>
                    <Menu
                        theme='light'
                        mode='inline'
                        selectedKeys={[selectedMenuKey]}
                        onClick={handleMenuClick}
                    >
                        <Menu.Item key='1' onClick={(e) => handleMenuClick(e.key, '/')} icon={<AreaChartOutlined />}>监控分析</Menu.Item >

                        <SubMenu key='2' icon={<BellOutlined />} title='告警管理'>
                            <Menu.Item key='2-1' onClick={(e) => handleMenuClick(e.key, '/alertRuleGroup')}>告警规则</Menu.Item>
                            <Menu.Item key='2-2' onClick={(e) => handleMenuClick(e.key, '/silenceRules')}>静默规则</Menu.Item>
                            <Menu.Item key='2-3' onClick={(e) => handleMenuClick(e.key, '/alertCurEvent')}>当前告警</Menu.Item>
                            <Menu.Item key='2-4' onClick={(e) => handleMenuClick(e.key, '/alertHisEvent')}>历史告警</Menu.Item>
                            <Menu.Item key='2-5' onClick={(e) => handleMenuClick(e.key, '/ruleTemplateGroup')}>规则模版</Menu.Item>
                        </SubMenu>

                        <SubMenu key='3' icon={<NotificationOutlined />} title='告警通知'>
                            <Menu.Item key='3-1' onClick={(e) => handleMenuClick(e.key, '/noticeObjects')}>通知对象</Menu.Item>
                            <Menu.Item key='3-2' onClick={(e) => handleMenuClick(e.key, '/noticeTemplate')}>通知模版</Menu.Item>
                        </SubMenu>

                        <SubMenu key='4' icon={<CalendarOutlined />} title='值班管理'>
                            <Menu.Item key='4-1' onClick={(e) => handleMenuClick(e.key, '/dutyManage')}>值班日程</Menu.Item>
                        </SubMenu>

                        <SubMenu key='5' icon={<UserOutlined />} title='人员组织'>
                            <Menu.Item key='5-1' onClick={(e) => handleMenuClick(e.key, '/user')}>用户管理</Menu.Item>
                            <Menu.Item key='5-2' onClick={(e) => handleMenuClick(e.key, '/userRole')}>角色管理</Menu.Item>
                        </SubMenu>
                        <Menu.Item key='7' onClick={(e) => handleMenuClick(e.key, '/tenants')} icon={<DeploymentUnitOutlined />}>租户管理</Menu.Item>

                        <Menu.Item key='6' onClick={(e) => handleMenuClick(e.key, '/datasource')} icon={<PieChartOutlined />}>数据源</Menu.Item>
                        <Menu.Item key='8' onClick={(e) => handleMenuClick(e.key, '/dashboard')} icon={<DashboardOutlined />}>仪表盘</Menu.Item >
                        {/*<SubMenu key='10' icon={<CloudSyncOutlined />} title='云拨测'>*/}
                        {/*    <Menu.Item key='10-1' onClick={(e) => handleMenuClick(e.key, '/userRole')}>即时拨测</Menu.Item>*/}
                        {/*    <Menu.Item key='10-2' onClick={(e) => handleMenuClick(e.key, '/user')}>拨测中心</Menu.Item>*/}
                        {/*</SubMenu>*/}
                        {/*<SubMenu key='11' icon={<SafetyOutlined />} title='智能洞察'>*/}
                        {/*    <Menu.Item key='11-1' onClick={(e) => handleMenuClick(e.key, '/user')}>事件大盘</Menu.Item>*/}
                        {/*    <Menu.Item key='11-2' onClick={(e) => handleMenuClick(e.key, '/userRole')}>事件中心</Menu.Item>*/}
                        {/*</SubMenu>*/}
                        <Menu.Item key='9' onClick={(e) => handleMenuClick(e.key, '/auditLog')} icon={<FileDoneOutlined />}>日志审计</Menu.Item >
                        <Menu.Item key='10' onClick={(e) => handleMenuClick(e.key, '/settings')} icon={<SettingOutlined />}>系统设置</Menu.Item >
                    </Menu>
                </>
            );
        } else {
            return (
                <>
                    <Menu
                        theme='light'
                        mode='inline'
                        selectedKeys={[selectedMenuKey]}
                        onClick={handleMenuClick}
                    >
                        <Menu.Item key='1' onClick={(e) => handleMenuClick(e.key, '/')} icon={<AreaChartOutlined />}>监控分析</Menu.Item >
                        <SubMenu key='2' icon={<BellOutlined />} title='告警管理'>
                            <Menu.Item key='2-1' onClick={(e) => handleMenuClick(e.key, '/alertRuleGroup')}>告警规则</Menu.Item>
                            <Menu.Item key='2-2' onClick={(e) => handleMenuClick(e.key, '/silenceRules')}>静默规则</Menu.Item>
                            <Menu.Item key='2-3' onClick={(e) => handleMenuClick(e.key, '/alertCurEvent')}>当前告警</Menu.Item>
                            <Menu.Item key='2-4' onClick={(e) => handleMenuClick(e.key, '/alertHisEvent')}>历史告警</Menu.Item>
                            <Menu.Item key='2-5' onClick={(e) => handleMenuClick(e.key, '/ruleTemplateGroup')}>规则模版</Menu.Item>
                        </SubMenu>

                        <SubMenu key='3' icon={<NotificationOutlined />} title='告警通知'>
                            <Menu.Item key='3-1' onClick={(e) => handleMenuClick(e.key, '/noticeObjects')}>通知对象</Menu.Item>
                            <Menu.Item key='3-2' onClick={(e) => handleMenuClick(e.key, '/noticeTemplate')}>通知模版</Menu.Item>
                        </SubMenu>

                        <SubMenu key='4' icon={<CalendarOutlined />} title='值班管理'>
                            <Menu.Item key='4-1' onClick={(e) => handleMenuClick(e.key, '/dutyManage')}>值班日程</Menu.Item>
                        </SubMenu>

                        <Menu.Item key='6' onClick={(e) => handleMenuClick(e.key, '/datasource')} icon={<PieChartOutlined />}>数据源</Menu.Item>
                        <Menu.Item key='8' onClick={(e) => handleMenuClick(e.key, '/dashboard')} icon={<DashboardOutlined />}>仪表盘</Menu.Item >
                    </Menu>
                </>
            );
        }
    };

    return (
        <Layout.Sider
            style={{
                overflow: 'auto',
                height: '100%',
                background: 'white',
                borderRadius: '12px',
            }}
        >
            {renderMenu()}
        </Layout.Sider>
    );
};