'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedMonitoringSVG from "./AnimatedMonitoringSVG";
import './login.css'
import { checkUser, loginUser, registerUser } from '../api/user';
import {message} from "antd";

export const Login = () => {
    const [passwordModal, setPasswordModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    // 检查是否已登录
    useEffect(() => {
        const token = localStorage.getItem('Authorization');
        if (token) {
            navigate('/'); // 已登录，跳转到主页
        }
    }, [navigate]);

    // 检查 admin 用户是否存在
    useEffect(() => {
        const checkAdminUser = async () => {
            try {
                const params = { username: 'admin' };
                const res = await checkUser(params);
                if (res?.data?.username === 'admin') {
                    setPasswordModal(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkAdminUser();
    }, []);

    // 处理登录表单提交
    const onFinish = async (event) => {
        event.preventDefault(); // 阻止默认表单提交行为

        const formData = new FormData(event.target);
        const params = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            const response = await loginUser(params);
            const token = response.data;
            if (token) {
                localStorage.setItem('Authorization', token);
                navigate('/'); // 登录成功，跳转到主页
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 处理密码初始化表单提交
    const handlePasswordSubmit = async (event) => {
        event.preventDefault(); // 阻止默认表单提交行为

        const formData = new FormData(event.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');

        console.log(password,"-",confirmPassword)
        if (password !== confirmPassword) {
            message.open({
                type: 'error',
                content: '两次输入的密码不一致',
            });
            return;
        }

        try {
            const params = {
                userid: 'admin',
                username: 'admin',
                email: 'admin@qq.com',
                phone: '18888888888',
                password: password,
                role: 'admin',
            };

            await registerUser(params);
            handleHideModal();
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    // 显示密码初始化模态框
    const handleShowModal = () => {
        setIsModalVisible(true);
    };

    // 隐藏密码初始化模态框
    const handleHideModal = () => {
        setIsModalVisible(false);
    };
    return (
        <div className="min-h-screen flex">
            <div className="w-1/2 bg-black"></div>
            <div className="w-1/2 bg-white"></div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 flex items-center justify-center"
            >
                <div className="bg-white rounded-3xl overflow-hidden flex w-[800px] h-[500px] shadow-2xl">
                    {/* Left Side - Login Form */}
                    <div className="w-3/5 p-10 flex flex-col">
                        <h1 className="text-3xl font-bold mb-2">登陆</h1>
                        <p className="text-gray-600 mb-8">欢迎使用 WatchAlert 监控云平台！</p>

                        <form onSubmit={onFinish} className="flex-grow flex flex-col justify-between">
                            <div className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="用户名"
                                        className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="密码"
                                        className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-black rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-600">记住我</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                {!passwordModal && (
                                    <button
                                        type="button"
                                        onClick={handleShowModal}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        ➡️ 点击我初始化 admin 用户密码
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    登陆
                                </button>
                                <p className="text-sm text-gray-500 text-center">
                                    未来支持 SSO 登录
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right Side - Decorative */}
                    <div
                        className="w-2/5 bg-black p-10 flex flex-col justify-center items-center relative overflow-hidden">
                        <AnimatedMonitoringSVG/>
                    </div>

                    {/* 密码初始化模态框 */}
                    {isModalVisible && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-8 rounded-lg h-500 w-500">
                                <h2 className="text-2xl font-bold mb-4">初始化密码</h2>
                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="init-password" className="block text-sm font-medium mb-2 text-gray-700">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="init-password"
                                            name="password"
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirm-password" className="block text-sm font-medium mb-2 text-gray-700">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirm-password"
                                            name="confirm-password"
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleHideModal}
                                            className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

