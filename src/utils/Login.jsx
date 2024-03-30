import React, { useEffect, useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Modal, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import WatchAlertLogo from '../img/WatchAlert.png'
import { checkUser, loginUser, registerUser } from '../api/user'

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

    useEffect(async () => {
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
            localStorage.setItem('Authorization', token)
            navigate('/') // 登录成功，跳转到首页
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
        <div>
            <a
                href=""
                target="_blank"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    marginTop: '20vh'
                }}
            >
                <img src={WatchAlertLogo} className="icon" style={{ width: '50vh', height: '15vh' }} />
            </a>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    marginTop: '-30vh'
                }}
            >
                <Form
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
                        style={{ width: '280px' }}
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
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        {!passwordModal && (
                            <a className="login-form-forgot" onClick={handleShowModal}>
                                Initialization Password
                            </a>
                        )}

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
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>

    )
}