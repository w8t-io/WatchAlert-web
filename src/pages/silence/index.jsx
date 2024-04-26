import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Tag, Popconfirm, message } from 'antd';
import { CreateSilenceModal } from './SilenceRuleCreateModal'
import { deleteSilence, getSilenceList } from '../../api/silence';
import { ComponentsContent } from '../../components';

export const Silences = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState([]); // 初始化list为空数组
    const [columns] = useState([
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 230,
        },
        {
            title: '告警指纹',
            dataIndex: 'fingerprint',
            key: 'fingerprint',
            width: 200,
        },
        {
            title: '数据源类型',
            dataIndex: 'datasource_type',
            key: 'datasource_type',
            width: 150,
        },
        {
            title: '创建人',
            dataIndex: 'create_by',
            key: 'create_by',
        },
        {
            title: '更新时间',
            dataIndex: 'update_at',
            key: 'update_at',
            width: 200,
            render: (text) => {
                const date = new Date(text * 1000)
                return date.toLocaleString()
            },
        },
        {
            title: '评论',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: '静默开始时间',
            dataIndex: 'starts_at',
            key: 'starts_at',
            width: 200,
            render: (text) => {
                const date = new Date(text * 1000)
                return date.toLocaleString()
            },
        },
        {
            title: '静默结束时间',
            dataIndex: 'ends_at',
            key: 'ends_at',
            width: 200,
            render: (text) => {
                const date = new Date(text * 1000)
                return date.toLocaleString()
            },
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
            const res = await getSilenceList()
            setList(res.data);
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (_, record) => {
        try {
            const params = {
                fingerprint: record.fingerprint,
                id: record.id,
            }
            await deleteSilence(params)
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

            <div style={{ display: 'flex' }}>
                <CreateSilenceModal visible={visible} onClose={handleModalClose} type='create' handleList={handleList} />

                <CreateSilenceModal visible={updateVisible} onClose={handleUpdateModalClose} selectedRow={selectedRow} type='update' handleList={handleList} />

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    width: '1000px'
                }}>

                </div>

            </div>

            <div style={{ overflowX: 'auto', marginTop: 10, height: '64vh' }}>
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