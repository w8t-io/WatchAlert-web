import http from '../utils/http';
import { message } from 'antd';

async function getSystemSetting() {
    try {
        const res = await http('get', '/api/w8t/setting/getSystemSetting');
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '系统配置获取失败',
        });
        return error
    }
}

async function saveSystemSetting(params) {
    try {
        const res = await http('post', '/api/w8t/setting/saveSystemSetting', params);
        message.open({
            type: 'success',
            content: '系统配置保存成功, 且立即生效!',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '系统配置保存失败',
        });
        return error
    }
}

export {
    getSystemSetting,
    saveSystemSetting
}