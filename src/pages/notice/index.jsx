import React, { useState, useEffect } from 'react';
import { Button, Table, Popconfirm, message } from 'antd';
import { CreateNoticeObjectModal } from './NoticeObjectCreateModal';
import { deleteNotice, getNoticeList } from '../../api/notice';
import { ComponentsContent } from '../../components';

export const NoticeObjects = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState([]);
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 'auto',
        },
        {
            title: '环境',
            dataIndex: 'env',
            key: 'env',
            width: 150,
            render: (text, record, index) => {
                if (!text) {
                    return '-';
                }
                return text;
            },
        },
        {
            title: '通知类型',
            dataIndex: 'noticeType',
            key: 'noticeType',
            width: 150,
            render: (text, record) => {
                if (record.noticeType === 'FeiShu') {
                    return '飞书'
                } else if (record.noticeType === 'DingDing') {
                    return '钉钉'
                }
                return ''
            },
        },
        {
            title: '值班表',
            dataIndex: 'dutyId',
            key: 'dutyId',
            width: 300,
            render: (text, record, index) => {
                if (!text) {
                    return '-';
                }
                return text;
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 250,
            render: (_, record) =>
                list.length >= 1 ? (
                    <div>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record)}>
                            <a>删除</a>
                        </Popconfirm>

                        <Button
                            type="link" onClick={() => handleUpdateModalOpen(record)}>
                            更新
                        </Button>
                    </div>
                ) : null,
        },
    ]

    useEffect(() => {
        handleList();
    }, []);

    const handleList = async () => {
        try {
            const res = await getNoticeList()
            setList(res.data);
        } catch (error) {
            message.error(error);
        }
    };

    const handleUpdateModalClose = () => {
        setUpdateVisible(false);
    };

    const handleUpdateModalOpen = (record) => {
        setSelectedRow(record);
        setUpdateVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            const params = {
                uuid: record.uuid
            }
            await deleteNotice(params)
            handleList();
        } catch (error) {
            message.error(error);
        }
    };

    const handleModalClose = () => {
        setVisible(false);
    };

    return (

        <div>
            <div style={{ display: 'flex' }}>
                <Button type="primary" onClick={() => setVisible(true)}>
                    创建
                </Button>

                <CreateNoticeObjectModal visible={visible} onClose={handleModalClose} type='create' handleList={handleList} />

                <CreateNoticeObjectModal visible={updateVisible} onClose={handleUpdateModalClose} selectedRow={selectedRow} type='update' handleList={handleList} />

            </div>

            <div style={{ overflowX: 'auto', marginTop: 10, height: '71vh' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{
                        x: 1500,
                        y: 'calc(71vh - 71px - 40px)',
                    }}
                />
            </div>
        </div>
    );
};