import http from '../utils/http';
import { message } from 'antd';

async function getUserList(params) {
    try {
        const res = await http('get', `/api/w8t/user/userList`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '用户列表获取失败',
        });
        return error
    }
}


async function loginUser(params) {
    try {
        const res = await http('post', `/api/system/login`, params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '用户不存在或密码错误',
        });
        return error
    }
}

async function registerUser(params) {
    try {
        const res = await http('post', `/api/system/register`, params);
        message.open({
            type: 'success',
            content: '用户注册成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '用户注册失败',
        });
        return error
    }
}

async function updateUser(params) {
    try {
        const res = await http('post', `/api/w8t/user/userUpdate`, params);
        message.open({
            type: 'success',
            content: '用户更新成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '用户更新失败',
        });
        return error
    }
}

async function deleteUser(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('post', `/api/w8t/user/userDelete?${queryString}`);
        message.open({
            type: 'success',
            content: '用户删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '用户删除失败',
        });
        return error
    }
}

async function getUserInfo() {
    try {
        const res = await http('get', `/api/system/userInfo`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '用户信息获取失败',
        });
        return error
    }
}

async function checkUser(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('get', `/api/system/checkUser?${queryString}`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '用户检查失败',
        });
        return error
    }
}

async function changeUserPass(query, params) {
    try {
        const queryString = Object.keys(query)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('post', `/api/w8t/user/userChangePass?${queryString}`, params);
        message.open({
            type: 'success',
            content: '修改密码成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '修改密码失败',
        });
        return error
    }
}

export {
    getUserList,
    loginUser,
    registerUser,
    updateUser,
    deleteUser,
    checkUser,
    getUserInfo,
    changeUserPass
}