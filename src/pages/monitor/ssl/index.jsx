import React, { useState, useEffect } from 'react';
import {Button, Table, Popconfirm, message, Input, Tag} from 'antd';
import {deleteMonitor, listMonitor} from "../../../api/monitor";
import {Link} from "react-router-dom";

export const MonitorSSL = () => {
    const { Search } = Input
    const [selectedRow, setSelectedRow] = useState(null);
    const [list, setList] = useState([]);
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 'auto',
        },
        {
            title: '域名',
            dataIndex: 'domain',
            key: 'domain',
            width: 'auto',
        },
        {
            title: '响应时间(最新)',
            dataIndex: 'responseTime',
            key: 'responseTime',
            width: 'auto',
            render: (text) => {
                if (!text) {
                    return '-';
                }
                return text;
            },
        },
        {
            title: '证书剩余时间',
            dataIndex: 'timeRemaining',
            key: 'timeRemaining',
            width: 'auto',
            render: (text) => {
                if (!text) {
                    return '-';
                }
                return text+"天";
            },
        },
        {
            title: '状态',
            dataIndex: 'enabled',
            key: 'enabled',
            width: 'auto',
            render: enabled => (
                enabled ?
                    <Tag color="success">启用</Tag> :
                    <Tag color="error">禁用</Tag>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 120,
            render: (_, record) =>
                list.length >= 1 ? (
                    <div>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record)}>
                            <a>删除</a>
                        </Popconfirm>

                        <Link to={`/monitor/ssl/${record.id}/edit`}>
                            <Button type="link">
                                更新
                            </Button>
                        </Link>
                    </div>
                ) : null,
        },
    ]

    useEffect(() => {
        handleList();
    }, []);

    const handleList = async () => {
        try {
            const res = await listMonitor()
            setList(res.data);
        } catch (error) {
            message.error(error);
        }
    };

    const handleUpdateModalOpen = (record) => {
        setSelectedRow(record);
    };

    const handleDelete = async (record) => {
        try {
            const params = {
                id: record.id
            }
            await deleteMonitor(params)
            handleList();
        } catch (error) {
            message.error(error);
        }
    };

    const onSearch = async (value) => {
        try {
            const params = {
                query: value,
            }
            // const res = await searchNotice(params)
            // setList(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Search allowClear placeholder="输入搜索关键字" onSearch={onSearch} style={{ width: 300 }} />
                </div>
                <div>
                    <Link to={`/monitor/ssl/create`}>
                        <Button type="primary"> 创 建 </Button>
                    </Link>
                </div>
            </div>

            <div style={{ overflowX: 'auto', marginTop: 10, height: '71vh' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{
                        x: 1000,
                        y: 'calc(65vh - 65px - 40px)',
                    }}
                />
            </div>
        </>
    );
};