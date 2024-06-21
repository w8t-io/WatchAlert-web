import React, { useEffect, useState } from 'react'
import { Button, Input, Table, Radio, Popconfirm, Dropdown, Tag, message } from 'antd'
import { useParams } from 'react-router-dom'
import { AlertRuleCreateModal } from './AlertRuleCreateModal'
import { deleteRule, getRuleList } from '../../../api/rule'
import { ReactComponent as PrometheusImg } from "./img/Prometheus.svg"
import { ReactComponent as AlicloudImg } from "./img/alicloud.svg"
import { ReactComponent as JaegerImg } from "./img/jaeger.svg"
import { ReactComponent as AwsImg } from "./img/AWSlogo.svg"
import { ReactComponent as LokiImg } from "./img/L.svg"

export const AlertRules = () => {
    const { Search } = Input
    const [selectedRow, setSelectedRow] = useState(null)
    const [updateVisible, setUpdateVisible] = useState(false)
    const [visible, setVisible] = useState(false)
    const [list, setList] = useState([])
    const { id } = useParams()
    const [selectRuleStatus, setSelectRuleStatus] = useState('all')
    const [pagination, setPagination] = useState({
        index: 1,
        size: 10,
        total: 0,
    });
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
            render: (text, record) => {
                return (
                    <div style={{display: 'flex'}}>
                        {text === "Prometheus" && (
                            <PrometheusImg style={{ height: "25px", width: "25px" }} />
                        )}
                        {text === "CloudWatch" && (
                            <AwsImg style={{ height: "25px", width: "25px" }} />
                        )}
                        {text === "Loki" && (
                            <LokiImg style={{ height: "25px", width: "25px" }} />
                        )}
                        {text === "Jaeger" && (
                            <JaegerImg style={{ height: "25px", width: "25px" }} />
                        )}
                        {text === "AliCloudSLS" && (
                            <AlicloudImg style={{ height: "25px", width: "25px" }} />
                        )}
                        <div style={{marginLeft: "5px", marginTop: '3px',fontSize :'12px'}}>{text}</div>
                    </div>
                )
            },
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
                index: pagination.index,
                size: pagination.size,
                status: selectRuleStatus,
                ruleGroupId: id,
            }
            const res = await getRuleList(params)

            setPagination({
                index: res.data.index,
                size: res.data.size,
                total: res.data.total,
            });

            setList(res.data.list);
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (_, record) => {
        try {
            const params = {
                ruleId: record.ruleId,
                ruleGroupId: record.ruleGroupId
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

    const onSearch = async (value) => {
        try {
            const params = {
                index: pagination.index,
                size: pagination.size,
                ruleGroupId: id,
                status: selectRuleStatus,
                query: value,
            }

            const res = await getRuleList(params)

            setPagination({
                index: res.data.index,
                size: res.data.size,
                total: res.data.total,
            });

            setList(res.data.list);
        } catch (error) {
            console.error(error)
        }
    }

    const changeStatus = async ({ target: { value } }) => {
        setSelectRuleStatus(value)
    }

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Radio.Group
                        options={[
                            {
                                label: '全部',
                                value: 'all',
                            },
                            {
                                label: '开启',
                                value: 'enabled',
                            },
                            {
                                label: '禁用',
                                value: 'disabled',
                            }
                        ]}
                        defaultValue={selectRuleStatus}
                        onChange={changeStatus}
                        optionType="button"
                    />

                    <Search
                        allowClear
                        placeholder="输入搜索关键字"
                        onSearch={onSearch}
                        style={{width: 300}}
                    />
                </div>
                <div>
                    <Button type="primary" onClick={() => setVisible(true)}> 创建 </Button>
                </div>
            </div>

            <div style={{display: 'flex'}}>
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

            <div style={{overflowX: 'auto', marginTop: 10, height: '71vh'}}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{
                        x: 1500,
                        y: 'calc(65vh - 65px - 40px)',
                    }}
                />
            </div>
        </>
    )
}