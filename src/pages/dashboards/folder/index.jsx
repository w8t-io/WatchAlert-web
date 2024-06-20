import { Button, Table, Popconfirm, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteRuleGroup } from '../../../api/rule'
import { deleteDashboard, getDashboardList, searchDashboard } from '../../../api/dashboard';
import CreateFolderModal from './create';

export const DashboardFolder = () => {
    const { Search } = Input
    const [list, setList] = useState()
    const [selectedRow, setSelectedRow] = useState(null)
    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [updateModalVisible, setUpdateModalVisible] = useState(false)
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 'auto',
            render: (text, record) => (
                < div >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={`/dashboard/${record.id}/info`}>{text}</Link>
                    </div>
                </div >
            ),
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: 'auto',
            render: (text) => {
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


    const handleList = async () => {
        try {
            const res = await getDashboardList()
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
            await deleteDashboard(params)
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
        try {
            const params = {
                query: value,
            }
            const res = await searchDashboard(params)
            setList(res.data)
        } catch (error) {
            console.error(error)
        }
        console.log(value)
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Search
                        allowClear
                        placeholder="输入搜索关键字"
                        style={{ width: 300 }}
                        onSearch={onSearch}
                    />
                </div>
                <div>
                    <Button type="primary" onClick={() => { setCreateModalVisible(true) }} >
                        创建
                    </Button>
                </div>
            </div>

            <CreateFolderModal
                visible={createModalVisible}
                onClose={handleModalClose}
                type="create"
                handleList={handleList}
            />

            <CreateFolderModal
                visible={updateModalVisible}
                onClose={handleUpdateModalClose}
                selectedRow={selectedRow}
                type="update"
                handleList={handleList}
            />

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
