import React, { useState, useEffect } from 'react';
import { Button, Table, Popconfirm } from 'antd';
import { deleteSilence } from '../../api/silence';
import { deleteTenant, getTenantList } from '../../api/tenant';
import { CreateTenant } from './CreateTenant';

export const Tenants = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState([]);
    const [columns] = useState([
        {
            title: '租户名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: '创建人',
            dataIndex: 'createBy',
            key: 'createBy',
            width: 150
        },
        {
            title: '负责人',
            dataIndex: 'manager',
            key: 'manager',
            width: 150

        },
        {
            title: '创建时间',
            dataIndex: 'createAt',
            key: 'createAt',
            width: 200,
            render: (text) => {
                const date = new Date(text * 1000)
                return date.toLocaleString()
            },
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            render: (text) => {
                if (!text) {
                    return '-'
                }
                return text
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 150,
            render: (_, record) =>
                <div>
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(_, record)}>
                        <a>删除</a>
                    </Popconfirm>
                    <Button type="link"
                        onClick={() => handleUpdateModalOpen(record)}>
                        更新
                    </Button>
                </div>
        },
    ]);

    useEffect(() => {
        handleList();
    }, []);

    // 获取所有数据
    const handleList = async () => {
        try {
            const res = await getTenantList()
            setList(res.data);
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (_, record) => {
        try {
            const params = {
                id: record.id,
            }
            await deleteTenant(params)
            handleList()
        } catch (error) {
            console.error(error)
        }
    }

    // 关闭窗口
    const handleModalClose = () => {
        setVisible(false)
    };

    const handleUpdateModalClose = () => {
        setUpdateVisible(false)
    }

    const handleUpdateModalOpen = (record) => {
        setSelectedRow(record)
        setUpdateVisible(true)
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => setVisible(true)}>
                    创建
                </Button>
            </div>

            <CreateTenant visible={visible} onClose={handleModalClose} type='create' handleList={handleList} />
            <CreateTenant visible={updateVisible} selectedRow={selectedRow} onClose={handleUpdateModalClose} type='update' handleList={handleList} />

            <div style={{ overflowX: 'auto', marginTop: 10, height: '64vh' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{
                        x: 1000,
                        y: 'calc(65vh - 65px - 40px)'
                    }}
                />
            </div>
        </>
    );
};