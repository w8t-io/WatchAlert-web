import http from '../utils/http';
import { message } from 'antd';

async function getNoticeTmplList() {
    try {
        const res = await http('get', '/api/w8t/noticeTemplate/noticeTemplateList');
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '通知模版列表获取失败',
        });
        return error
    }
}

async function createNoticeTmpl(params) {
    try {
        const res = await http('post', `/api/w8t/noticeTemplate/noticeTemplateCreate`, params);
        message.open({
            type: 'success',
            content: '通知模版创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '通知模版创建失败',
        });
        return error
    }
}

async function updateNoticeTmpl(params) {
    try {
        const res = await http('post', `/api/w8t/noticeTemplate/noticeTemplateUpdate`, params);
        message.open({
            type: 'success',
            content: '通知模版更新成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '通知模版更新失败',
        });
        return error
    }
}

async function deleteNoticeTmpl(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('post', `/api/w8t/noticeTemplate/noticeTemplateDelete?${queryString}`);
        message.open({
            type: 'success',
            content: '通知模版删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '通知模版删除失败',
        });
        return error
    }
}

async function searchNoticeTmpl(params) {
    try {
        const res = await http('get', '/api/w8t/noticeTemplate/searchNoticeTmpl', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '搜索通知模版失败',
        });
        return error
    }
}

export {
    getNoticeTmplList,
    createNoticeTmpl,
    updateNoticeTmpl,
    deleteNoticeTmpl,
    searchNoticeTmpl
}