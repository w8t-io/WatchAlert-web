import http from '../utils/http';
import { message } from 'antd';

async function getAllUsers(params) {
    try {
        const res = await http('get', '/api/v1/user/getAllUser', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '获取用户信息失败',
        });
        return error
    }
}

async function getDashboardInfo() {
    try {
        const res = await http('get', '/api/system/getDashboardInfo');
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '获取仪表盘数据失败',
        });
        return error
    }
}

export {
    getAllUsers,
    getDashboardInfo,
}