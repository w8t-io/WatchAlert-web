import http from '../utils/http';
import { message } from 'antd';

async function getKubernetesResourceList(params) {
    try {
        const res = await http('get', '/api/w8t/kubernetes/getResourceList', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '获取Kubernetes资源列表失败',
        });
        return error
    }
}

async function getKubernetesReasonList(params) {
    try {
        const res = await http('get', '/api/w8t/kubernetes/getReasonList', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '获取Kubernetes事件类型列表失败',
        });
        return error
    }
}

export {
    getKubernetesResourceList,
    getKubernetesReasonList
}