import http from '../utils/http';
import { message } from 'antd';

async function getTenantList(params) {
    try {
        const res = await http('get', `/api/w8t/tenant/getTenantList`,params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '租户列表获取失败',
        });
        return error
    }
}

async function getTenant(params) {
    try {
        const res = await http('get', `/api/w8t/tenant/getTenant`, params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '租户信息获取失败',
        });
        return error
    }
}

async function createTenant(params) {
    try {
        const res = await http('post', `/api/w8t/tenant/createTenant`, params);
        message.open({
            type: 'success',
            content: '租户创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '租户创建失败',
        });
        return error
    }
}

async function updateTenant(params) {
    try {
        const res = await http('post', `/api/w8t/tenant/updateTenant`, params);
        message.open({
            type: 'success',
            content: '租户更新成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '租户更新失败',
        });
        return error
    }
}

async function deleteTenant(params) {
    try {
        const res = await http('post', `/api/w8t/tenant/deleteTenant`, params);
        message.open({
            type: 'success',
            content: '租户删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '租户删除失败',
        });
        return error
    }
}

async function getUsersForTenant(params) {
    try {
        const res = await http('get', `/api/w8t/tenant/getUsersForTenant`, params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '租户成员列表获取失败',
        });
        return error
    }
}

async function addUsersToTenant(params) {
    try {
        const res = await http('post', `/api/w8t/tenant/addUsersToTenant`, params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '向租户添加成员失败',
        });
        return error
    }
}

async function delUsersOfTenant(params) {
    try {
        const res = await http('post', `/api/w8t/tenant/delUsersOfTenant`, params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '删除租户成员失败',
        });
        return error
    }
}

async function changeTenantUserRole(params) {
    try {
        const res = await http('post', `/api/w8t/tenant/changeTenantUserRole`, params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '修改租户成员角色失败',
        });
        return error
    }
}

export {
    getTenantList,
    createTenant,
    updateTenant,
    deleteTenant,
    getTenant,
    getUsersForTenant,
    addUsersToTenant,
    delUsersOfTenant,
    changeTenantUserRole
}