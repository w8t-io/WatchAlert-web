import { Button, Input, Table, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';
import RuleTemplateGroupCreateModal from './RuleTemplateGroupCreateModal';
import { Link } from 'react-router-dom';
import { deleteRuleTmplGroup, getRuleTmplGroupList } from '../../../api/ruleTmpl';

const { Search } = Input;

export const RuleTemplateGroup = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState([]);

    // 表头
    const columns = [
        {
            title: '模版组名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={`/ruleTemplateGroup/${record.name}/templates`}>{text}</Link>
                    </div>
                </div>
            ),
        },
        {
            title: '模版数',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (!text ? '-' : text),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) =>
                list.length >= 1 ? (
                    <div>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
                            <a>删除</a>
                        </Popconfirm>
                    </div>
                ) : null,
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
        const res = await getRuleTmplGroupList();
        setList(res.data);
    };

    const handleDelete = async (record) => {
        const params = {
            name: record.name,
        };
        await deleteRuleTmplGroup(params);
        handleList();
    };

    useEffect(() => {
        handleList();
    }, []);

    const handleModalClose = () => setVisible(false);

    const handleUpdateModalClose = () => setUpdateVisible(false);

    const handleUpdateModalOpen = (record) => {
        setSelectedRow(record);
        setUpdateVisible(true);
    };

    const onSearch = (value, _e, info) => console.log(info?.source, value);

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

            <div>
                <RuleTemplateGroupCreateModal visible={visible} onClose={handleModalClose} type="create" handleList={handleList} />
                <RuleTemplateGroupCreateModal visible={updateVisible} onClose={handleUpdateModalClose} selectedRow={selectedRow} type="update" handleList={handleList} />
            </div>

            <div style={{ overflowX: 'auto', marginTop: 10 }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{
                        x: 1000,
                        y: height-400
                    }}
                />
            </div>
        </>
    );
};
