import { Button, Input, Table, Popconfirm, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertRuleGroupCreateModal } from './AlertRuleGroupCreateModal'
import { CopyOutlined } from '@ant-design/icons';
import { deleteRuleGroup, getRuleGroupList } from '../../../api/rule'

export const AlertRuleGroup = ({ }) => {
    const { Search } = Input
    const [list, setList] = useState()
    const [selectedRow, setSelectedRow] = useState(null)
    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [updateModalVisible, setUpdateModalVisible] = useState(false)
    const [pagination, setPagination] = useState({
        index: 1,
        size: 10,
        total: 0,
    });
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 250,
            render: (text, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={`/ruleGroup/${record.id}/rule/list`}>{text}</Link>
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
        handleList(pagination.index, pagination.size)
    }, [])

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        message.success('已复制到剪贴板');
    };

    const handleList = async (index, size) => {
        try {
            const params = {
                index: index,
                size: size,
            }
            const res = await getRuleGroupList(params)

            setPagination({
                index: res?.data?.index,
                size: res?.data?.size,
                total: res?.data?.total,
            });

            setList(res.data.list)
        } catch (error) {
            console.error(error)
        }
    }

    const handlePageChange = (page) => {
        setPagination({ ...pagination, index: page.current, size: page.size });
        handleList(page.current, page.size)
    };

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

    const onSearch = async (value) => {
        console.log("===>",pagination)
        try {
            const params = {
                index: pagination?.index,
                size: pagination?.size,
                query: value,
            }

            const res = await getRuleGroupList(params)

            setPagination({
                index: res?.data?.index,
                size: res?.data?.size,
                total: res?.data?.total,
            });

            setList(res.data.list)
        } catch (error) {
            console.error(error)
        }
    }

    const handleShowTotal = (total, range) =>
        `第 ${range[0]} - ${range[1]} 条 共 ${total} 条`;

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <Search
                        allowClear
                        placeholder="输入搜索关键字"
                        onSearch={onSearch}
                        style={{width: 300}}
                    />
                </div>
                <div>
                    <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{marginLeft: 'auto'}}>
                        创建
                    </Button>
                </div>
            </div>

            <AlertRuleGroupCreateModal visible={createModalVisible} onClose={handleModalClose} type='create'
                                       handleList={handleList}/>

            <AlertRuleGroupCreateModal visible={updateModalVisible} onClose={handleUpdateModalClose}
                                       selectedRow={selectedRow} type='update' handleList={handleList}/>

            <div style={{overflowX: 'auto', marginTop: 10, height: '64vh'}}>
                <Table
                    columns={columns}
                    dataSource={list}
                    pagination={{
                        index: pagination.index ?? 1,
                        size: pagination.size ?? 10,
                        total: pagination?.total ?? 0,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: handleShowTotal,
                    }}
                    onChange={handlePageChange}
                    scroll={{
                        y: 'calc(65vh - 65px - 40px)'
                    }}
                />
            </div>
        </>
    );
};
