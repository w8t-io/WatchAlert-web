import { Input, Table, Button, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';
import UserCreateModal from './UserCreateModal';
import UserChangePass from './UserChangePass';
import { deleteUser, getUserList, searchUser } from '../../../api/user';

const { Search } = Input;

export const User = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [changeVisible, setChangeVisible] = useState(false);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState([]);

    // 表头
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: 30,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: 40,
            render: (text) => (!text ? '-' : text),
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 40,
            render: (text) => (!text ? '-' : text),
        },
        {
            title: '创建人',
            dataIndex: 'create_by',
            key: 'create_by',
            width: 40,
        },
        {
            title: '创建时间',
            dataIndex: 'create_at',
            key: 'create_at',
            width: 50,
            render: (text) => {
                const date = new Date(text * 1000);
                return date.toLocaleString();
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 30,
            render: (_, record) => (
                list.length >= 1 ? (
                    <div>
                        <Button
                            type="link"
                            onClick={() => {
                                setChangeVisible(true);
                                setSelectedUserId(record.userid);
                                setSelectedUsername(record.username);
                            }}
                            disabled={record.create_by === 'LDAP'}
                        >
                            重置密码
                        </Button>
                        <UserChangePass
                            visible={changeVisible}
                            onClose={() => setChangeVisible(false)}
                            userid={selectedUserId}
                            username={selectedUsername}
                        />
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record)}
                            disabled={record.username === 'admin'}
                        >
                            <a
                                style={{
                                    cursor: record.username === 'admin' ? 'not-allowed' : 'pointer',
                                    color: record.username === 'admin' ? 'rgba(0, 0, 0, 0.25)' : '#1677ff',
                                }}
                            >
                                删除
                            </a>
                        </Popconfirm>
                        <Button type="link" onClick={() => handleUpdateModalOpen(record)}>
                            更新
                        </Button>
                    </div>
                ) : null
            ),
        },
    ];

    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        // 定义一个处理窗口大小变化的函数
        const handleResize = () => {
            setHeight(window.innerHeight);
        };

        // 监听窗口的resize事件
        window.addEventListener('resize', handleResize);

        // 在组件卸载时移除监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleList = async () => {
        try {
            const res = await getUserList();
            setList(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (record) => {
        try {
            const params = {
                userid: record.userid,
            };
            await deleteUser(params);
            handleList();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateModalOpen = (record) => {
        setSelectedRow(record);
        setUpdateVisible(true);
    };

    const onSearch = async (value) => {
        try {
            const params = { query: value };
            const res = await searchUser(params);
            setList(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleList();
    }, []);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Search
                        allowClear
                        placeholder="输入搜索关键字"
                        onSearch={onSearch}
                        style={{ width: 300 }}
                    />
                </div>
                <div>
                    <Button type="primary" onClick={() => setVisible(true)}>
                        创建
                    </Button>
                </div>
            </div>

            <UserCreateModal
                visible={visible}
                onClose={() => setVisible(false)}
                type="create"
                handleList={handleList}
            />

            <UserCreateModal
                visible={updateVisible}
                onClose={() => setUpdateVisible(false)}
                selectedRow={selectedRow}
                type="update"
                handleList={handleList}
            />

            <div style={{ overflowX: 'auto', marginTop: 10 }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{ x: 1500, y: height-400 }}
                />
            </div>
        </>
    );
};