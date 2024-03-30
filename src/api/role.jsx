import http from '../utils/http';
import { message } from 'antd';

async function getRoleList() {
    try {
        const res = await http('get', `/api/w8t/role/roleList`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '角色列表获取失败',
        });
        return error
    }
}

async function createRole(params) {
    try {
        const res = await http('post', `/api/w8t/role/roleCreate`, params);
        message.open({
            type: 'success',
            content: '角色创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '角色创建失败',
        });
        return error
    }
}

async function updateRole(params) {
    try {
        const res = await http('post', `/api/w8t/role/roleUpdate`, params);
        message.open({
            type: 'success',
            content: '角色更新成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '角色更新失败',
        });
        return error
    }
}

async function deleteRole(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('post', `/api/w8t/role/roleDelete?${queryString}`);
        message.open({
            type: 'success',
            content: '角色删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '角色删除失败',
        });
        return error
    }
}

export {
    getRoleList,
    createRole,
    updateRole,
    deleteRole
}