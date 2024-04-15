/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { CreateDutyModal } from './DutyManageCreateModal';
import { CalendarApp } from './calendar';
import { CopyOutlined } from '@ant-design/icons';
import { deleteDutyManager, getDutyManagerList } from '../../api/duty';

export const DutyManage = () => {
    const [tenantId, setTenantId] = useState('')
    const [calendarDutyId, setCalendarDutyId] = useState('');
    const [calendarName, setCalendarName] = useState('');
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [list, setList] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null)
    const [columns] = useState([
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            render: (text, record) => (
                <div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <a
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                // 将所有状态更新放在一个函数中以确保顺序和组件更新
                                setSelectedId(text);
                                setCalendarVisible(true);
                                setCalendarName(record.name);
                                setCalendarDutyId(record.id);
                                setTenantId(record.tenantId)
                            }}
                        >
                            {text}
                        </a>
                        <CopyOutlined
                            style={{ marginLeft: '5px', cursor: 'pointer' }}
                            onClick={() => handleCopy(text)}
                        />
                    </div>
                </div>

            ),
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 50,
        },
        {
            title: '负责人',
            dataIndex: 'manager',
            key: 'manager',
            width: 30,
            render: (text) => {
                return <span>{text.username}</span>;
            },
        },
        {
            title: '今日值班',
            dataIndex: 'curDutyUser',
            key: 'curDutyUser',
            width: 30,
            render: (text) => {
                if (!text) {
                    return '-';
                }
                return text;
            },
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: 100,
            render: (text) => {
                if (!text) {
                    return '没有留下任何描述~';
                }
                return text;
            },
        },
        {
            title: '创建时间',
            dataIndex: 'create_at',
            key: 'create_at',
            width: 50,
            render: (text) => {
                const date = new Date(text * 1000)
                return date.toLocaleString()
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 50,
            render: (_, record) =>
                <>
                    <div>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record)}
                            disabled={record.role === 'admin'}>
                            <a style={{ cursor: record.role === 'admin' ? 'not-allowed' : 'pointer' }}>删除</a>
                        </Popconfirm>
                        <Button
                            type="link"
                            onClick={() => handleUpdateModalOpen(record)}>
                            更新
                        </Button>
                    </div>
                </>
        },
    ]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        message.success('已复制到剪贴板');
    };

    useEffect(() => {
        handleList();
    }, []);

    const handleList = async () => {
        try {
            const res = await getDutyManagerList()
            setList(res.data);
        } catch (error) {
            message.error(error);
        }
    };

    const handleDelete = async (record) => {
        try {
            const params = {
                id: record.id
            }
            await deleteDutyManager(params)
            handleList();
        } catch (error) {
            message.error(error);
        }
    };

    const handleModalClose = () => {
        setVisible(false);
    };

    const handleUpdateModalClose = () => {
        setUpdateVisible(false);
    };

    const handleCalendarModalClose = () => {
        setCalendarVisible(false);
    };

    const handleUpdateModalOpen = (record) => {
        setSelectedRow(record)
        setUpdateVisible(true)
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => setVisible(true)}>
                    创建
                </Button>            </div>
            <div style={{ display: 'flex' }}>

                <CreateDutyModal visible={visible} onClose={handleModalClose} handleList={handleList} type="create" />

                <CreateDutyModal visible={updateVisible} onClose={handleUpdateModalClose} handleList={handleList} selectedRow={selectedRow} type="update" />

                <CalendarApp visible={calendarVisible} onClose={handleCalendarModalClose} name={calendarName} tenantId={tenantId} dutyId={calendarDutyId} handleList={handleList} />

            </div>

            <div style={{ overflowX: 'auto', marginTop: 10, height: '71vh' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{
                        x: 1500,
                        y: 'calc(65vh - 65px - 40px)'
                    }}
                />
            </div>
        </>
    );
};