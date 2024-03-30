import http from '../utils/http';
import { message } from 'antd';

async function getPermissionsList() {
    try {
        const res = await http('get', `/api/w8t/permissions/permsList`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '权限列表获取失败',
        });
        return error
    }
}

export {
    getPermissionsList
}