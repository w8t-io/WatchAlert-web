import React, { useEffect, useState } from 'react'
import { Button, Input, Table, Select, Popconfirm, Dropdown, Tag, message } from 'antd'
import { useParams } from 'react-router-dom'
import { AlertRuleCreateModal } from './AlertRuleCreateModal'
import { deleteRule, getRuleList } from '../../../api/rule'

export const AlertRules = () => {
    const [selectedRow, setSelectedRow] = useState(null)
    const [updateVisible, setUpdateVisible] = useState(false)
    const [visible, setVisible] = useState(false)
    const [list, setList] = useState([])
    const { id } = useParams()
    const columns = [
        {
            title: '规则名称',
            dataIndex: 'ruleName',
            key: 'ruleName',
            width: 200,
        },
        {
            title: '数据源类型',
            dataIndex: 'datasourceType',
            key: 'datasourceType',
            width: 200,
        },
        {
            title: '数据源',
            dataIndex: 'datasourceId',
            key: 'datasourceId',
            width: 200,
            render: (text, record) => (
                <span>
                    {Object.entries(record.datasourceId).map(([key, value]) => (
                        <Tag color="processing" key={key}>{`${value}`}</Tag>
                    ))}
                </span>
            ),
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: 300,
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
            width: 150,
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
            width: 150,
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
    ]

    useEffect(() => {
        handleList(id)
    }, [])

    const handleList = async (id) => {
        try {
            const params = {
                ruleGroupId: id,
            }
            const res = await getRuleList(params)
            setList(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (_, record) => {
        try {
            const params = {
                id: record.ruleId
            }
            await deleteRule(params)
            handleList(id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleModalClose = () => {
        setVisible(false)
    }

    const handleUpdateModalClose = () => {
        setUpdateVisible(false)
    }

    const handleUpdateModalOpen = (record) => {
        setSelectedRow(record)
        setUpdateVisible(true)
    }

    return (

        <div>
            <div style={{ display: 'flex' }}>
                <Button type="primary" onClick={() => setVisible(true)}>
                    创建
                </Button>

                <AlertRuleCreateModal
                    visible={visible}
                    onClose={handleModalClose}
                    type="create"
                    handleList={handleList}
                    ruleGroupId={id}
                />

                <AlertRuleCreateModal
                    visible={updateVisible}
                    onClose={handleUpdateModalClose}
                    selectedRow={selectedRow}
                    type="update"
                    handleList={handleList}
                    ruleGroupId={id}
                />

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        width: '1000px',
                    }}
                >
                </div>
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

    )
}