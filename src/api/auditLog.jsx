import http from '../utils/http';
import { message } from 'antd';

async function listAuditLog(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('get', `/api/w8t/auditLog/listAuditLog?${queryString}`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '审计日志列表获取失败',
        });
        return error
    }
}

async function searchAuditLog(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');

        const res = await http('get', `/api/w8t/auditLog/searchAuditLog?${queryString}`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '日志审计列表查询失败',
        });
        return error
    }
}

export {
    listAuditLog,
    searchAuditLog
}