import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

const Auth = () => {

  // 检查用户是否已经登录
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('Authorization')
    if (!token) {
      navigate('/login') // 未登录，跳转到登录页面
    }
  }, [navigate])

  // 设置全局请求头
  const token = localStorage.getItem('Authorization')
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

}

export default Auth