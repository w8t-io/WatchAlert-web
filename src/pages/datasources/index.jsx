import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Tag, Popconfirm } from 'antd';
import { CreateDatasourceModal } from './DatasourceCreateModal';
import { deleteDatasource, getDatasourceList, searchDatasource } from '../../api/datasource';

export const Datasources = () => {
    const { Search } = Input
    const [selectedRow, setSelectedRow] = useState(null);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState([]);
    const [columns] = useState([
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '数据源类型',
            dataIndex: 'type',
            key: 'type',
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
            title: '状态',
            dataIndex: 'enabled',
            key: 'enabled',
            render: enabled => (
                enabled ?
                    <Tag color="success">启用</Tag> :
                    <Tag color="error">禁用</Tag>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right', // 设置操作列固定
            render: (_, record) => (
                <div>
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(_, record)}>
                        <a>删除</a>
                    </Popconfirm>

                    <Button
                        type="link"
                        onClick={() => handleUpdateModalOpen(record)}>
                        更新
                    </Button>
                </div>
            ),
        },
    ]);

    useEffect(() => {
        try {
            handleList();
        } catch (error) {
            console.error(error)
        }
    }, []);

    const handleList = async () => {
        try {
            const res = await getDatasourceList()
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
            await deleteDatasource(params)
            handleList()
        } catch (error) {
            console.error(error)
        }
    };

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

    const onSearch = async (value) => {
        try {
            const params = {
                query: value,
            }
            const res = await searchDatasource(params)
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
                    <Button type="primary" onClick={() => setVisible(true)}>
                        创建
                    </Button>
                </div>
            </div>

            <CreateDatasourceModal visible={visible} onClose={handleModalClose} type='create' handleList={handleList} />

            <CreateDatasourceModal visible={updateVisible} onClose={handleUpdateModalClose} selectedRow={selectedRow} type="update" handleList={handleList} />

            <div style={{ overflowX: 'auto', marginTop: 10, height: '71vh' }}>
                <Table
                    dataSource={list}
                    columns={columns}
                    scroll={{
                        x: 1000,
                        y: 'calc(65vh - 65px - 40px)'
                    }}
                />
            </div>

        </>
    );
};