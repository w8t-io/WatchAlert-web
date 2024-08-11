import http from '../utils/http';
import { message } from 'antd';

async function listMonitor(params) {
    try {
        const res = await http('get', '/api/w8t/monitor/listMon', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '证书监控列表获取失败',
        });
        return error
    }
}

async function getMonitor(params) {
    try {
        const res = await http('get', '/api/w8t/monitor/getMon', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '证书监控规则信息获取失败',
        });
        return error
    }
}

async function createMonitor(params) {
    try {
        const res = await http('post', '/api/w8t/monitor/createMon', params);
        message.open({
            type: 'success',
            content: '证书监控规则创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '证书监控规则创建失败',
        });
        return error
    }
}

async function updateMonitor(params) {
    try {
        const res = await http('post', '/api/w8t/monitor/updateMon', params);
        message.open({
            type: 'success',
            content: '证书监控规则更新成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '证书监控规则更新失败',
        });
        return error
    }
}

async function deleteMonitor(params) {
    try {
        const res = await http('post', '/api/w8t/monitor/deleteMon', params);
        message.open({
            type: 'success',
            content: '证书监控规则删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '证书监控规则删除失败',
        });
        return error
    }
}

export {
    listMonitor,
    getMonitor,
    createMonitor,
    updateMonitor,
    deleteMonitor
}