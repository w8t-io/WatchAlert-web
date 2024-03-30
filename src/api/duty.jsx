import http from '../utils/http';
import { message } from 'antd';

async function getDutyManagerList(params) {
    try {
        const res = await http('get', '/api/w8t/dutyManage/dutyManageList', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '值班列表获取失败',
        });
        return error
    }
}

async function createDutyManager(params) {
    try {
        const res = await http('post', '/api/w8t/dutyManage/dutyManageCreate', params);
        message.open({
            type: 'success',
            content: '值班表创建成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '值班表创建失败',
        });
        return error
    }
}

async function updateDutyManager(params) {
    try {
        const res = await http('post', '/api/w8t/dutyManage/dutyManageUpdate', params);
        message.open({
            type: 'success',
            content: '值班表更新成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '值班表更新失败',
        });
        return error
    }
}

async function deleteDutyManager(params) {
    try {
        const res = await http('post', `/api/w8t/dutyManage/dutyManageDelete?id=${params.id}`);
        message.open({
            type: 'success',
            content: '值班表删除成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '值班表删除失败',
        });
        return error
    }
}

async function createCalendar(params) {
    try {
        const res = await http('post', '/api/w8t/calendar/calendarCreate', params);
        message.open({
            type: 'success',
            content: '日程表发布成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '日程表发布失败',
        });
        return error
    }
}

async function updateCalendar(params) {
    try {
        const res = await http('post', '/api/w8t/calendar/calendarUpdate', params);
        message.open({
            type: 'success',
            content: '日程表更新成功',
        });
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '日程表更新失败',
        });
        return error
    }
}

async function searchCalendar(params) {
    try {
        const res = await http('get', '/api/w8t/calendar/calendarSearch', params);
        return res;
    } catch (error) {
        message.open({
            type: 'error',
            content: '日程表查询失败',
        });
        return error
    }
}

export {
    getDutyManagerList,
    createDutyManager,
    updateDutyManager,
    deleteDutyManager,
    createCalendar,
    updateCalendar,
    searchCalendar
}