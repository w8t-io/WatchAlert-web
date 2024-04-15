import React, { useState, useEffect } from 'react';
import { Table, message, Button, Drawer, Select, Input } from 'antd';
import dayjs from 'dayjs'
import { listAuditLog, searchAuditLog } from '../../api/auditLog';
import moment from 'moment';
import JsonViewer from 'react-json-view';

export const AuditLog = () => {
    const { Search } = Input
    const [list, setList] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [annotations, setAnnotations] = useState('');
    const [scope, setScope] = useState('')
    const [startTimestamp, setStartTimestamp] = useState(null)
    const [endTimestamp, setEndTimestamp] = useState(null)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const columns = [
        {
            title: '时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            render: (text) => {
                const dateInMilliseconds = text * 1000;
                return moment(dateInMilliseconds).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: 'auto',
        },
        {
            title: '来源IP',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            width: 'auto',
        },
        {
            title: '事件名称',
            dataIndex: 'auditType',
            key: 'auditType',
            width: 'auto',
        },
        {
            title: '事件ID',
            dataIndex: 'id',
            key: 'id',
            width: 'auto',
        },
        {
            title: '事件Body详情',
            dataIndex: 'body',
            key: 'body',
            width: 150,
            render: (text, record) => (
                <span>
                    {record.body && (
                        <Button type="link" onClick={() => { showDrawer(record.body) }}>
                            详情
                        </Button>
                    )}
                </span>
            )
        },
    ]

    useEffect(() => {
        handleList(pagination.current, pagination.pageSize);
    }, [startTimestamp, endTimestamp]);

    const handleList = async (pageIndex, pageSize) => {
        try {
            const params = {
                pageIndex: pageIndex,
                pageSize: pageSize,
            };

            const filteredParams = {};
            for (const key in params) {
                if (params[key] !== undefined) {
                    filteredParams[key] = params[key];
                }
            }

            const res = await listAuditLog(params)
            setPagination({
                ...pagination,
                current: res.data.PageIndex,
                total: res.data.TotalCount,
            });
            setList(res.data.List);
        } catch (error) {
            message.error(error);
        }
    };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, current: page.current, pageSize: page.pageSize });
        handleList(page.current, page.pageSize)
    };

    const handleShowTotal = (total, range) =>
        `第 ${range[0]} - ${range[1]} 条 共 ${total} 条`;

    const showDrawer = (record) => {
        setDrawerOpen(true);
        setAnnotations(record)
    };

    const onCloseDrawer = () => {
        setDrawerOpen(false);
    };

    let annotationsJson = ""
    if (annotations) {
        annotationsJson = JSON.parse(annotations);
    }

    const onSearch = async (value) => {
        try {
            const params = {
                scope: scope,
                query: value,
            }
            const res = await searchAuditLog(params)
            setList(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <Drawer
                anchor="right"
                title="事件Body详情"
                onClose={onCloseDrawer}
                open={drawerOpen}
            >
                <JsonViewer
                    src={annotationsJson}
                    displayObjectSize={false}
                />
            </Drawer>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50vh' }}>
                <Select
                    allowClear
                    placeholder="时间范围"
                    style={{
                        flex: 1,
                    }}
                    options={[
                        {
                            value: '1',
                            label: '近 1 天',
                        },
                        {
                            value: '3',
                            label: '近 3 天'
                        },
                        {
                            value: '5',
                            label: '近 5 天'
                        },
                        {
                            value: '9',
                            label: '近 9 天'
                        },
                        {
                            value: '15',
                            label: '近 15 天'
                        },
                        {
                            value: '20',
                            label: '近 20 天'
                        },
                        {
                            value: '30',
                            label: '近 30 天'
                        },
                    ]}
                    onChange={(record) => { setScope(record) }}
                />
                <Search
                    allowClear
                    placeholder="输入搜索关键字"
                    enterButton
                    style={{ width: 300 }}
                    onSearch={onSearch}
                />
            </div>

            <div style={{ overflowX: 'auto', marginTop: 10, height: '64vh' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    pagination={{
                        current: pagination.current ?? 1,
                        pageSize: pagination.pageSize ?? 10,
                        total: pagination?.total ?? 0,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: handleShowTotal,
                    }}
                    onChange={handlePageChange}
                    scroll={{
                        y: 'calc(65vh - 60px - 40px)'
                    }}
                />
            </div>
        </div>
    );
};