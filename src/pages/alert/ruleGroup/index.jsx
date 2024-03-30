import { Button, Input, Table, Popconfirm, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertRuleGroupCreateModal } from './AlertRuleGroupCreateModal'
import { CopyOutlined } from '@ant-design/icons';
import { deleteRuleGroup, getRuleGroupList } from '../../../api/rule'

export const AlertRuleGroup = ({ }) => {
    const [list, setList] = useState()
    const [selectedRow, setSelectedRow] = useState(null)
    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [updateModalVisible, setUpdateModalVisible] = useState(false)
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 250,
            render: (text, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={`/alertRuleGroup/${record.id}/rules`}>{text}</Link>
                        <CopyOutlined
                            style={{ marginLeft: '5px', cursor: 'pointer' }}
                            onClick={() => handleCopy(text)}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: '规则组名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: '规则数',
            dataIndex: 'number',
            key: 'number',
            width: 200,
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text, record, index) => {
                if (!text) {
                    return '没有留下任何描述~';
                }
                return text;
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            fixed: 'right',
            render: (_, record) =>
                list.length >= 1 ? (
                    <div>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(_, record)}>
                            <a>删除</a>
                        </Popconfirm>

                        <Button
                            type="link" onClick={() => handleUpdateModalOpen(record)} >
                            更新
                        </Button>
                    </div>
                ) : null,
        },
    ]

    useEffect(() => {
        handleList()
    }, [])

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        message.success('已复制到剪贴板');
    };

    const handleList = async () => {
        try {
            const res = await getRuleGroupList()
            console.log(res)
            setList(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (_, record) => {
        try {
            const params = {
                id: record.id,
            }
            await deleteRuleGroup(params)
            handleList()
        } catch (error) {
            console.error(error)
        }
    }

    const handleModalClose = () => {
        setCreateModalVisible(false)
    }

    const handleUpdateModalOpen = (record) => {
        setUpdateModalVisible(true)
        setSelectedRow(record)
    }

    const handleUpdateModalClose = () => {
        setUpdateModalVisible(false)
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderRight: '100vh' }}>
                <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{ marginLeft: 'auto' }}>
                    创建
                </Button>
            </div>

            <AlertRuleGroupCreateModal visible={createModalVisible} onClose={handleModalClose} type='create' handleList={handleList} />

            <AlertRuleGroupCreateModal visible={updateModalVisible} onClose={handleUpdateModalClose} selectedRow={selectedRow} type='update' handleList={handleList} />

            <div style={{ overflowX: 'auto', marginTop: 10, height: '64vh' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{
                        x: 1000,
                        y: 'calc(64vh - 64px - 40px)'
                    }}
                />
            </div>
        </>
    );
};
