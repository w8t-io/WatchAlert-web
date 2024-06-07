import http from '../utils/http';
import { message } from 'antd';

async function getMetricTypes() {
    try {
        const res = await http('get', '/api/w8t/community/cloudwatch/metricTypes');
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '指标类型获取失败',
        });
        return error
    }
}

async function getMetricNames(params) {
    try {
        const res = await http('get', '/api/w8t/community/cloudwatch/metricNames?metricType='+params.metricType);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '指标获取失败',
        });
        return error
    }
}

async function getStatistics() {
    try {
        const res = await http('get', '/api/w8t/community/cloudwatch/statistics');
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '统计类型获取失败',
        });
        return error
    }
}

async function getDimensions(params) {
    try {
        const res = await http('get', '/api/w8t/community/cloudwatch/dimensions?metricType='+params.metricType);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '端点类型获取失败',
        });
        return error
    }
}

async function getRdsInstances(params) {
    try {
        const res = await http('get', '/api/w8t/community/rds/instances?datasourceId='+params.datasourceId);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '端点实例获取失败',
        });
        return error
    }
}

async function getRdsClusters(params) {
    try {
        const res = await http('get', '/api/w8t/community/rds/clusters?datasourceId='+params.datasourceId);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '端点集群获取失败',
        });
        return error
    }
}

export {
    getMetricTypes,
    getMetricNames,
    getStatistics,
    getDimensions,
    getRdsInstances,
    getRdsClusters
}