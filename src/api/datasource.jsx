import http from '../utils/http';
import { message } from 'antd';

async function getDatasourceList(params) {
    try {
        const res = await http('get', '/api/w8t/datasource/dataSourceList', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '数据源列表获取失败',
        });
        return error
    }
}

async function searchDatasource(params) {
    try {
        const queryString = Object.keys(params)
            .map(key => params[key] !== undefined ? `${key}=${params[key]}` : '')
            .filter(Boolean)
            .join('&');
        const res = await http('get', `/api/w8t/datasource/dataSourceSearch?${queryString}`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '数据源搜索失败',
        });
        return error
    }
}

async function getDatasource(params) {
    try {
        const res = await http('get', `/api/w8t/datasource/dataSourceGet?dsType=${params.dsType}`);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '数据源搜索失败',
        });
        return error
    }
}

async function createDatasource(params) {
    try {
        const res = await http('post', '/api/w8t/datasource/dataSourceCreate', params);
        message.open({
            type: 'success',
            content: '数据源创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '数据源创建失败',
        });
        return error
    }
}

async function updateDatasource(params) {
    try {
        const res = await http('post', '/api/w8t/datasource/dataSourceUpdate', params);
        message.open({
            type: 'success',
            content: '数据源更新成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '数据源更新失败',
        });
        return error
    }
}

async function deleteDatasource(params) {
    try {
        const res = await http('post', `/api/w8t/datasource/dataSourceDelete`, params);
        message.open({
            type: 'success',
            content: '数据源删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '数据源删除失败',
        });
        return error
    }
}

export {
    getDatasourceList,
    searchDatasource,
    createDatasource,
    updateDatasource,
    deleteDatasource,
    getDatasource
}