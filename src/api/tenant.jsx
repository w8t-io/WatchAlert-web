import http from '../utils/http';
import { message } from 'antd';

async function getTenantList() {
    try {
        const res = await http('get', `/api/w8t/tenant/getTenantList`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '租户列表获取失败',
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

export {
    getTenantList,
    createTenant,
    updateTenant,
    deleteTenant,
}