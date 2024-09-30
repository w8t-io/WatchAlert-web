import http from '../utils/http';
import { message } from 'antd';

async function listSubscribe(params) {
    try {
        const res = await http('get', '/api/w8t/subscribe/listSubscribe', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '订阅列表获取失败',
        });
        return error
    }
}

async function createSubscribe(params) {
    try {
        const res = await http('post', '/api/w8t/subscribe/createSubscribe', params);
        message.open({
            type: 'success',
            content: '订阅规则创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: `订阅规则创建失败`,
        });
        return error
    }
}

async function deleteSubscribe(params) {
    try {
        const res = await http('post', `/api/w8t/subscribe/deleteSubscribe`, params);
        message.open({
            type: 'success',
            content: '订阅规则删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '订阅规则删除失败',
        });
        return error
    }
}

export {
    listSubscribe,
    createSubscribe,
    deleteSubscribe
}