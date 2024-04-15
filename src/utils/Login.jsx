import React, { useEffect, useState } from 'react'
import { Modal, Layout, Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, GithubOutlined } from '@ant-design/icons';
import { ReactComponent as MyIcon } from '../img/701986.svg'
import { useNavigate } from 'react-router-dom'
import githubIcon from '../img/github_logo.png'
import { checkUser, loginUser, registerUser } from '../api/user'
import './login.css'

export const Login = () => {
    const navigate = useNavigate()
    const [passwordModal, setPasswordModal] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const handleShowModal = () => {
        setIsModalVisible(true)
    }
    const handleHideModal = () => {
        setIsModalVisible(false)
    }
    const siderStyle = {
        textAlign: 'center',
        lineHeight: '100vh', // 设置一个固定的行高，或者使用其他方式来控制高度
        color: 'white', // 如果背景是黑色，文字颜色应该是白色以便可见
        backgroundColor: 'black', // 背景颜色设置为黑色
        borderRadius: 0, // 取消圆边角
    };

    const layoutStyle = {
        overflow: 'hidden',
        width: '100%', // 宽度占据全屏
        height: '100%', // 高度占据全屏
    };

    const copyrightStyle = {
        position: 'absolute',
        bottom: 0,
        height: '60%',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        padding: '10px 0',
    };
    const { Sider } = Layout;

    const run = async () => {
        try {
            const params = {
                username: 'admin'
            }
            const res = await checkUser(params)
            if (res.data.username === 'admin') {
                setPasswordModal(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        run()
    }, [])

    // 检查用户是否已经登录
    useEffect(() => {
        const token = localStorage.getItem('Authorization')
        if (!token) {
            navigate('/login') // 未登录，跳转到登录页面
        } else {
            navigate('/')
        }
    }, [navigate])

    const onFinish = async (data) => {
        try {
            const response = await loginUser(data)
            const token = response.data
            if (token) {
                localStorage.setItem('Authorization', token)
                navigate('/')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handlePasswordSubmit = async (values) => {
        try {

            const params = {
                "username": "admin",
                "email": "admin@qq.com",
                "phone": "18888888888",
                "password": values.password,
                "role": "admin"
            }

            await registerUser(params)
            handleHideModal()
            window.location.reload()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div style={{ height: '100vh' }}>
            <Layout style={layoutStyle}>
                <Sider width="50%" style={siderStyle}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '-80vh', marginLeft: '30px' }}>
                            <MyIcon className="custom-svg" width="35px" height="35px" />
                            <span style={{ marginLeft: '10px', fontSize: '18px' }}>AlertCloud</span>
                            <div style={{ marginTop: '70vh' }}>
                                <span style={{ marginLeft: '10px', fontSize: '55px' }}>
                                    WatchAlert
                                </span>
                                <span style={{ marginLeft: '10px', fontSize: '15px' }}>
                                    智能监控，触手可及！
                                </span>
                            </div>
                        </div>
                        <div style={copyrightStyle}>
                            WatchAlert ©2024 Created by Cairry
                        </div>
                    </div>
                </Sider>
                <Layout >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '3vh', marginRight: '20px' }}>
                        <a href="https://github.com/Cairry/WatchAlert" target="_blank" title="GitHub" rel="noreferrer">
                            <img src={githubIcon} alt="GitHub Icon" className="icon" style={{ width: '3.5vh', height: '3.5vh', marginRight: '5px' }} />
                        </a>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                        <span style={{ marginLeft: '10px', fontSize: '30px', fontWeight: 'bold' }}>
                            Login System
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '-50px' }}>
                        <Form
                            style={{ width: '50vh', marginLeft: '25%' }}
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Username!',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>自动登录</Checkbox>
                                    {!passwordModal && (
                                        <a className="login-form-forgot" onClick={handleShowModal}>
                                            Initialization Password
                                        </a>
                                    )}
                                </Form.Item>
                            </Form.Item>

                            <Modal
                                title="初始化密码"
                                visible={isModalVisible}
                                onCancel={handleHideModal}
                                footer={null}>

                                <Form name="password_form" onFinish={handlePasswordSubmit}>
                                    <Form.Item
                                        name="password"
                                        label="Password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirm"
                                        label="Confirm Password"
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your password!',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve()
                                                    }
                                                    return Promise.reject(new Error('The new password that you entered do not match!'))
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item wrapperCol={{ offset: 100, span: 16 }}>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>

                            </Modal>

                            <Form.Item>
                                <Button style={{ width: '50vh' }} type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Layout >
            </Layout >

        </div >
    );

}
