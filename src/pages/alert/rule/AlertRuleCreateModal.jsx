import { Modal, Form, Input, Button, Switch, Radio, Divider, Select, Tooltip, InputNumber, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { createRule, updateRule } from '../../../api/rule'
import { getDatasource, searchDatasource } from '../../../api/datasource'
import { getNoticeList } from '../../../api/notice'
import { getJaegerService } from '../../../api/other'
const MyFormItemContext = React.createContext([])

const { Option } = Select;

function toArr(str) {
    return Array.isArray(str) ? str : [str]
}

// 表单组
const MyFormItemGroup = ({ prefix, children }) => {
    const prefixPath = React.useContext(MyFormItemContext)
    const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix])
    return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>
}

// 表单
const MyFormItem = ({ name, ...props }) => {
    const prefixPath = React.useContext(MyFormItemContext)
    const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
    return <Form.Item name={concatName} {...props} />
}

export const AlertRuleCreateModal = ({ visible, onClose, selectedRow, type, handleList, ruleGroupId }) => {
    const [form] = Form.useForm()
    const [enabled, setEnabled] = useState(true) // 设置初始状态为 true
    const [selectedType, setSelectedType] = useState() // 数据源类型
    const [datasourceOptions, setDatasourceOptions] = useState([])  // 数据源列表
    const [selectedItems, setSelectedItems] = useState([])  //选择数据源
    const [noticeLabels, setNoticeLabels] = useState([]) // notice Lable
    const [noticeOptions, setNoticeOptions] = useState([])  // 通知对象列表
    // 在组件中定义一个状态来存储选择的通知对象值
    const [selectedNotice, setSelectedNotice] = useState('')
    // 禁止输入空格
    const [spaceValue, setSpaceValue] = useState('')
    // 告警等级
    const [severityValue, setSeverityValue] = useState(1)
    const [jaegerServiceList, setJaegerServiceList] = useState([])

    useEffect(() => {
        handleGetDatasourceList(selectedType)
    }, [selectedType])

    useEffect(() => {
        handleGetNoticeData()
    }, [])

    useEffect(() => {
        if (selectedRow) {
            form.setFieldsValue({
                annotations: selectedRow.annotations,
                datasourceId: selectedRow.datasourceId,
                datasourceType: selectedRow.datasourceType,
                description: selectedRow.description,
                enabled: selectedRow.enabled,
                evalInterval: selectedRow.evalInterval,
                forDuration: selectedRow.forDuration,
                labels: selectedRow.labels,
                noticeGroup: selectedRow.noticeGroup,
                noticeId: selectedRow.noticeId,
                repeatNoticeInterval: selectedRow.repeatNoticeInterval,
                ruleId: selectedRow.ruleId,
                ruleName: selectedRow.ruleName,
                alicloudSLSConfig: selectedRow.alicloudSLSConfig,
                lokiConfig: selectedRow.lokiConfig,
                prometheusConfig: selectedRow.prometheusConfig,
                severity: selectedRow.severity,
                jaegerConfig: {
                    service: selectedRow.jaegerConfig.service,
                    tags: selectedRow.jaegerConfig.tags,
                    scope: selectedRow.jaegerConfig.scope,
                }
            })
            setSelectedItems(selectedRow.datasourceId)
            setSelectedType(selectedRow.datasourceType)
            setNoticeLabels(selectedRow.noticeGroup)
        }
    }, [selectedRow, form])

    const handleCreateRule = async (values) => {
        try {
            const params = {
                ...values,
                noticeGroup: noticeLabels,
                ruleGroupId: ruleGroupId,
            }

            await createRule(params)
            handleList(ruleGroupId)
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdateRule = async (values) => {
        try {
            const params = {
                ...values,
                tenantId: selectedRow.tenantId,
                ruleId: selectedRow.ruleId,
                ruleGroupId: ruleGroupId,
                noticeGroup: noticeLabels
            }
            await updateRule(params)
            handleList(ruleGroupId)
        } catch (error) {
            console.error(error)
        }
    }

    const handleGetDatasourceList = async (selectedType) => {
        try {
            const params = {
                dsType: selectedType
            }
            const res = await getDatasource(params)
            const newData = res.data.map((item) => ({
                label: item.name,
                value: item.id
            }))

            // 将数据设置为选项对象数组
            setDatasourceOptions(newData)
        } catch (error) {
            console.error(error)
        }
    }

    // 创建
    const handleFormSubmit = async (values) => {

        if (type === 'create') {
            handleCreateRule(values)
        }

        if (type === 'update') {
            handleUpdateRule(values)
        }

        // 关闭弹窗
        onClose()
    }

    // 获取数据源
    const handleGetDatasourceData = async (data) => {
        setSelectedType(data)
    }

    // 获取通知对象
    const handleGetNoticeData = async () => {
        const res = await getNoticeList()
        const newData = res.data.map((item) => ({
            label: item.name,
            value: item.uuid
        }))
        // 将数据设置为选项对象数组
        setNoticeOptions(newData)
    }

    const handleGetJaegerService = async () => {
        const params = {
            id: selectedItems
        }
        const res = await getJaegerService(params)

        const newData = res.data.data.map((item) => ({
            label: item,
            value: item
        }))
        setJaegerServiceList(newData)
    }

    // 数据源单/多选标签
    const addLabel = () => {
        setNoticeLabels([...noticeLabels, { key: '', value: '', noticeId: '' }])
    }

    const updateLabel = (index, field, value) => {
        const updatedLabels = [...noticeLabels]
        updatedLabels[index][field] = value
        setNoticeLabels(updatedLabels)
    }

    const removeLabel = (index) => {
        const updatedLabels = [...noticeLabels]
        updatedLabels.splice(index, 1)
        setNoticeLabels(updatedLabels)
    }

    // 在onChange事件处理函数中更新选择的通知对象值
    const handleSelectChange = (value) => {
    }

    const onChange = (e) => {
        setSeverityValue(e.target.value)
    }

    const handleInputChange = (e) => {
        // 移除输入值中的空格
        const newValue = e.target.value.replace(/\s/g, '')
        setSpaceValue(newValue)
    }

    const handleKeyPress = (e) => {
        // 阻止空格键的默认行为
        if (e.key === ' ') {
            e.preventDefault()
        }
    }

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            styles={{ body: { overflowY: 'auto', maxHeight: '600px' } }} // 设置最大高度并支持滚动 
            width={800} // 设置Modal窗口宽度
        >
            <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

                <div>
                    <strong style={{ fontSize: '20px' }}>基础配置</strong>
                    <div style={{ display: 'flex' }}>
                        <MyFormItem
                            name="ruleName"
                            label="规则名称"
                            style={{
                                marginRight: '10px',
                                width: '500px',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                value={spaceValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                disabled={type === 'update'} />
                        </MyFormItem>

                        <MyFormItem
                            name="labels"
                            label="附加标签"
                            style={{
                                width: '500px',
                            }}
                        >
                            <Input />
                        </MyFormItem>
                    </div>

                    <MyFormItem name="description" label="描述">
                        <Input />
                    </MyFormItem>
                </div>

                <Divider />

                <div>
                    <strong style={{ fontSize: '20px' }}>规则配置</strong>

                    <div style={{ display: 'flex' }}>

                        <MyFormItem
                            name="datasourceType"
                            label="数据源类型"
                            style={{
                                marginRight: '10px',
                                width: '500px',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                placeholder="选择数据源类型"
                                style={{
                                    flex: 1,
                                }}
                                options={[
                                    {
                                        value: 'Prometheus',
                                        label: 'Prometheus',
                                    },
                                    {
                                        value: 'AliCloudSLS',
                                        label: '阿里云SLS'
                                    },
                                    {
                                        value: 'Jaeger',
                                        label: 'Jaeger'
                                    },
                                    {
                                        value: 'Loki',
                                        label: 'Loki'
                                    },
                                ]}
                                // value={selectedType}
                                onChange={handleGetDatasourceData}
                            />
                        </MyFormItem>

                        <MyFormItem
                            name="datasourceId"
                            label="关联数据源"
                            style={{
                                width: '500px',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}>
                            <Select
                                mode="multiple"
                                placeholder="选择数据源"
                                value={selectedItems}
                                onChange={setSelectedItems}
                                style={{
                                    width: '100%',
                                }}
                                tokenSeparators={[',']}
                                options={datasourceOptions}

                            />
                        </MyFormItem>

                    </div>

                    {selectedType === 'Prometheus' &&
                        <MyFormItemGroup prefix={['prometheusConfig']}>
                            <MyFormItem name="promQL" label="PromQL"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <Input />
                            </MyFormItem>
                        </MyFormItemGroup>
                    }

                    {selectedType === 'AliCloudSLS' &&
                        <MyFormItemGroup prefix={['alicloudSLSConfig']}>

                            <div style={{ display: 'flex' }}>
                                <MyFormItem
                                    name="project"
                                    label="Project"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    style={{
                                        marginRight: '10px',
                                        width: '500px',
                                    }}>
                                    <Input />
                                </MyFormItem>
                                <MyFormItem
                                    name="logstore"
                                    label="Logstore"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    style={{
                                        width: '500px',
                                    }}>
                                    <Input />
                                </MyFormItem>
                            </div>

                            <MyFormItem
                                name="logQL"
                                label="LogQL"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <Input />
                            </MyFormItem>

                            <div style={{ display: 'flex' }}>
                                <MyFormItem
                                    name="logScope"
                                    label="查询区间"
                                    style={{
                                        width: '500px',
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: '97%' }}
                                        addonAfter={'分钟'}
                                        placeholder="10"
                                        min={1}
                                    />
                                </MyFormItem>

                                <MyFormItemGroup prefix={['evalCondition']}>

                                    <MyFormItem name="type" label="判断条件">
                                        <Select showSearch style={{ marginRight: 8, width: '127px' }} placeholder="数据条数">
                                            <Option value="count">数据条数</Option>
                                        </Select>
                                    </MyFormItem>

                                    <MyFormItem name="operator" label=" ">
                                        <Select showSearch style={{ marginRight: 8, width: '127px' }} placeholder=">">
                                            <Option value=">">{'>'}</Option>
                                            <Option value=">=">{'>='}</Option>
                                            <Option value="<">{'<'}</Option>
                                            <Option value="==">{'=='}</Option>
                                            <Option value="!=">{'!='}</Option>
                                        </Select>
                                    </MyFormItem>

                                    <MyFormItem name='value' label=" ">
                                        <InputNumber style={{ width: '100px' }} min={1} placeholder="0" />
                                    </MyFormItem>

                                </MyFormItemGroup>

                            </div>

                        </MyFormItemGroup>
                    }

                    {selectedType === 'Jaeger' &&
                        <MyFormItemGroup prefix={['jaegerConfig']}>
                            <div style={{ display: 'flex' }}>
                                <MyFormItem name='service' label="应用服务"
                                    style={{
                                        marginRight: '10px',
                                        width: '500px',
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="选择需查询链路的服务"
                                        style={{
                                            flex: 1,
                                        }}
                                        options={jaegerServiceList}
                                        onClick={handleGetJaegerService}
                                    />
                                </MyFormItem>

                                <MyFormItem name='tags' label="判断条件"
                                    style={{
                                        width: '500px',
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select showSearch style={{ width: '100%' }} placeholder="StatusCode = 5xx">
                                        <Option value='%7B"http.status_code"%3A"5.%2A%3F"%7D'>{'StatusCode = 5xx'}</Option>
                                    </Select>
                                </MyFormItem>
                            </div>

                            <MyFormItem
                                name="scope"
                                label="查询区间"
                                style={{
                                    width: '380px',
                                }}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '98%' }}
                                    addonAfter={'分钟'}
                                    placeholder="10"
                                    min={1}
                                />
                            </MyFormItem>

                        </MyFormItemGroup>
                    }

                    {selectedType === 'Loki' &&
                        <MyFormItemGroup prefix={['lokiConfig']}>

                            <MyFormItem
                                name="logQL"
                                label="LogQL"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <Input />
                            </MyFormItem>

                            <div style={{ display: 'flex' }}>
                                <MyFormItem
                                    name="logScope"
                                    label="查询区间"
                                    style={{
                                        width: '500px',
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: '97%' }}
                                        addonAfter={'分钟'}
                                        placeholder="10"
                                        min={1}
                                    />
                                </MyFormItem>

                                <MyFormItemGroup prefix={['evalCondition']}>

                                    <MyFormItem name="type" label="判断条件">
                                        <Select showSearch style={{ marginRight: 8, width: '127px' }} placeholder="数据条数">
                                            <Option value="count">数据条数</Option>
                                        </Select>
                                    </MyFormItem>

                                    <MyFormItem name="operator" label=" ">
                                        <Select showSearch style={{ marginRight: 8, width: '127px' }} placeholder=">">
                                            <Option value=">">{'>'}</Option>
                                            <Option value=">=">{'>='}</Option>
                                            <Option value="<">{'<'}</Option>
                                            <Option value="==">{'=='}</Option>
                                            <Option value="!=">{'!='}</Option>
                                        </Select>
                                    </MyFormItem>

                                    <MyFormItem name='value' label=" ">
                                        <InputNumber style={{ width: '100px' }} min={1} placeholder="0" />
                                    </MyFormItem>

                                </MyFormItemGroup>

                            </div>

                        </MyFormItemGroup>
                    }

                    <div style={{ display: 'flex' }}>
                        <MyFormItem
                            name="evalInterval"
                            label="执行频率"
                            style={{
                                width: '385px',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '97%' }}
                                addonAfter={<span>秒</span>}
                                placeholder="10"
                                min={1}
                            />
                        </MyFormItem>

                        {selectedType === 'Prometheus' &&
                            <MyFormItem
                                name="forDuration"
                                label="持续时间"
                                style={{
                                    width: '50%',
                                }}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    addonAfter={<span>秒</span>}
                                    placeholder="60"
                                    min={1}
                                />
                            </MyFormItem>
                        }
                    </div>

                    <MyFormItem name="severity" label="告警等级"
                        rules={[
                            {
                                required: true,
                            },
                        ]}>
                        <Radio.Group onChange={onChange} value={severityValue}>
                            <Radio value={'P0'}>P0级告警</Radio>
                            <Radio value={'P1'}>P1级告警</Radio>
                            <Radio value={'P2'}>P2级告警</Radio>
                        </Radio.Group>
                    </MyFormItem>

                    {
                        selectedType === "Prometheus" &&
                        <MyFormItem
                            name="annotations"
                            label="告警详情"
                            tooltip="获取 Label 变量, 示例: ${job}, ${instance}。凡是 Target 中的变量均可通过`${}`获取。">
                            <Input />
                        </MyFormItem>
                    }
                </div>

                <Divider />

                <div>
                    <strong style={{ fontSize: '20px' }}>通知配置</strong>

                    <div style={{ display: 'flex' }}>
                        <MyFormItem
                            name="noticeId"
                            label="通知对象"
                            tooltip="默认通知对象"
                            style={{
                                marginRight: '10px',
                                width: '500px',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                style={{
                                    width: 370,
                                }}
                                allowClear
                                placeholder="选择通知对象"
                                value={selectedNotice} // 将选择的值与状态中的值进行绑定
                                options={noticeOptions}
                                onChange={handleSelectChange} // 使用onChange事件处理函数来捕获选择的值
                            />
                        </MyFormItem>

                        <MyFormItem
                            name="repeatNoticeInterval"
                            label="重复通知"
                            style={{
                                width: '500px',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                addonAfter={<span>分钟</span>}
                                placeholder="60"
                                min={1}
                            />
                        </MyFormItem>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MyFormItem style={{ marginBottom: '0', marginRight: '10px' }}>
                            <span>分组通知</span>
                            <Tooltip title="根据 Metric 标签进行分组通知">
                                <QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                            </Tooltip>
                        </MyFormItem>
                        <Button onClick={addLabel} style={{ marginTop: '0' }}>
                            +
                        </Button>
                    </div>
                </div>

                <MyFormItemGroup prefix={['noticeGroup']} >
                    {noticeLabels.length >= 1 ? (<div style={{ display: 'flex', }}>
                        <label style={{ marginRight: '21vh' }} >* Key</label>
                        <label style={{ marginRight: '20vh' }} >* Value</label>
                        <label style={{ marginRight: '18vh' }} >* 通知对象</label>
                        <label>操作</label>
                    </div>) : null}
                    {noticeLabels.map((label, index) => (
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <Input
                                name={`[${index}].key`}
                                placeholder="Key"
                                style={{ marginRight: '10px', width: 'calc((100% / 3) - 20px)', height: '32px' }} // 减去marginRight和padding
                                value={label.key}
                                onChange={(e) => updateLabel(index, 'key', e.target.value)}
                            />

                            <Input
                                name={`[${index}].value`}
                                placeholder="Value"
                                style={{ marginRight: '10px', width: 'calc((100% / 3) - 20px)', height: '32px' }} // 减去marginRight和padding
                                value={label.value}
                                onChange={(e) => updateLabel(index, 'value', e.target.value)}
                            />

                            <Select
                                name={`[${index}].noticeId`}
                                placeholder="选择通知对象"
                                style={{ width: 'calc((100% / 3) - 20px)', height: '32px' }} // 减去marginRight和padding
                                allowClear
                                options={noticeOptions}
                                value={label.noticeId ? [label.noticeId] : undefined}
                                onChange={(e) => updateLabel(index, 'noticeId', e)}
                            />

                            <Button onClick={() => removeLabel(index)} style={{ marginLeft: '10px' }}>
                                -
                            </Button>
                        </div>
                    ))}
                </MyFormItemGroup>

                <div style={{ marginTop: '20px' }}>
                    <MyFormItem
                        name="enabled"
                        label="状态"
                        tooltip="启用/禁用"
                        valuePropName="checked"
                    >
                        <Switch checked={enabled} onChange={setEnabled} />
                    </MyFormItem>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </div>
            </Form >
        </Modal >
    )
}