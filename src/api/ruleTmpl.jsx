import http from '../utils/http';
import { message } from 'antd';

async function getRuleTmplList(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('get', `/api/w8t/ruleTmpl/ruleTmplList?${queryString}`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '规则模版列表获取失败',
        });
        return error
    }
}

async function createRuleTmpl(params) {
    try {
        const res = await http('post', `/api/w8t/ruleTmpl/ruleTmplCreate`, params);
        message.open({
            type: 'success',
            content: '规则模版创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '规则模版创建失败',
        });
        return error
    }
}

async function deleteRuleTmpl(params) {
    try {

        const res = await http('post', `/api/w8t/ruleTmpl/ruleTmplDelete`, params);
        message.open({
            type: 'success',
            content: '规则模版删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '规则模版删除失败',
        });
        return error
    }
}

async function getRuleTmplGroupList() {
    try {
        const res = await http('get', `/api/w8t/ruleTmplGroup/ruleTmplGroupList`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '规则模版组获取失败',
        });
        return error
    }
}

async function createRuleTmplGroup(params) {
    try {
        const res = await http('post', `/api/w8t/ruleTmplGroup/ruleTmplGroupCreate`, params);
        message.open({
            type: 'success',
            content: '规则模版组创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '规则模版组创建失败',
        });
        return error
    }
}

async function deleteRuleTmplGroup(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('post', `/api/w8t/ruleTmplGroup/ruleTmplGroupDelete?${queryString}`);
        message.open({
            type: 'success',
            content: '规则模版组删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '规则模版组删除失败',
        });
        return error
    }
}

export {
    getRuleTmplList,
    createRuleTmpl,
    deleteRuleTmpl,
    getRuleTmplGroupList,
    createRuleTmplGroup,
    deleteRuleTmplGroup
}