import { Modal, Form, Input, Button, Select, Checkbox, Tooltip, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { createNotice, updateNotice } from '../../api/notice'
import { getDutyManagerList } from '../../api/duty'
const { TextArea } = Input
const MyFormItemContext = React.createContext([])

function toArr(str) {
    return Array.isArray(str) ? str : [str]
}

const MyFormItem = ({ name, ...props }) => {
    const prefixPath = React.useContext(MyFormItemContext)
    const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
    return <Form.Item name={concatName} {...props} />
}

export const CreateNoticeObjectModal = ({ visible, onClose, selectedRow, type, handleList }) => {
    const [form] = Form.useForm()
    const [notificationType, setNotificationType] = useState(null)
    const isFeishuNotification = notificationType === 'FeiShu'
    const [isChecked, setIsChecked] = useState(false)
    const [dutyList, setDutyList] = useState([])
    const [selectedDutyItem, setSelectedDutyItem] = useState([])

    // 禁止输入空格
    const [spaceValue, setSpaceValue] = useState('')

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

    useEffect(() => {
        handleDutyManageList()

        if (selectedRow) {
            setNotificationType(selectedRow.noticeType)
            setIsChecked(selectedRow.enableCard == 'true' ? true : false)
            form.setFieldsValue({
                uuid: selectedRow.uuid,
                name: selectedRow.name,
                dutyId: selectedRow.dutyId,
                env: selectedRow.env,
                noticeType: selectedRow.noticeType,
                hook: selectedRow.hook,
                enableCard: isChecked,
                template: selectedRow.template,
                templateFiring: selectedRow.templateFiring,
                templateRecover: selectedRow.templateRecover
            })
        }
    }, [selectedRow, form])

    const handleNotificationTypeChange = (value) => {
        setNotificationType(value)
    }

    const handleDutyManageList = async () => {
        try {
            const res = await getDutyManagerList()
            const newData = res.data.map((item) => ({
                label: item.name,
                value: item.id
            }))
            setDutyList(newData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleCreate = async (data) => {
        try {
            const params = {
                ...data,
                enableCard: isChecked ? "true" : "false"
            }
            await createNotice(params)
            handleList()
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdate = async (data) => {
        try {
            const params = {
                ...data,
                enableCard: isChecked ? "true" : "false",
                uuid: selectedRow.uuid,
            }
            await updateNotice(params)
            handleList()
        } catch (error) {
            console.error(error)
        }
    }

    const handleFormSubmit = async (values) => {

        if (type === 'create') {
            await handleCreate(values)
        }

        if (type === 'update') {
            await handleUpdate(values)
        }

        // 关闭弹窗
        onClose()
    }

    return (
        <Modal visible={visible} onCancel={onClose} footer={null} width={800} >
            <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

                <div style={{ display: 'flex' }}>
                    <MyFormItem
                        name="name"
                        label="名称"
                        style={{
                            marginRight: '10px',
                            width: '500px',
                        }}
                        rules={[
                            {
                                required: true,
                            },
                        ]}>
                        <Input
                            value={spaceValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            disabled={type === 'update'} />
                    </MyFormItem>

                    <MyFormItem
                        name="env"
                        label="应用环境"
                        style={{
                            marginRight: '10px',
                            width: '500px',
                        }}
                        rules={[
                            {
                                required: false,
                            },
                        ]}>
                        <Input />
                    </MyFormItem>
                </div>


                <div style={{ display: 'flex' }}>
                    <MyFormItem name="noticeType" label="通知类型"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{
                            marginRight: '10px',
                            width: '500px',
                        }}>
                        <Select
                            placeholder="请选择通知类型"
                            options={[
                                {
                                    value: "FeiShu",
                                    label: "飞书",
                                },
                                {
                                    value: "DingDing",
                                    label: "钉钉"
                                }
                            ]}

                            onChange={handleNotificationTypeChange}
                        />
                    </MyFormItem>

                    <MyFormItem
                        name="dutyId"
                        label="值班表"
                        style={{
                            marginRight: '10px',
                            width: '500px',
                        }}>
                        <Select
                            showSearch
                            allowClear
                            placeholder="请选择值班表"
                            options={dutyList}
                            value={selectedDutyItem}
                            tokenSeparators={[',']}
                            onChange={setSelectedDutyItem}
                        />
                    </MyFormItem>

                </div>

                <div style={{ display: 'flex' }}>

                    <MyFormItem
                        name="hook"
                        label="Hook"
                        tooltip="客户端机器人的 Hook 地址"
                        style={{
                            marginRight: '10px',
                            width: '100vh',
                        }}
                        rules={[
                            {
                                required: true,
                            },
                            {
                                pattern: /^(http|https):\/\//,
                                message: '输入正确的URL格式',
                            },
                        ]}>
                        <Input />
                    </MyFormItem>

                </div>

                {isFeishuNotification && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MyFormItem style={{ marginBottom: '0', marginRight: '10px' }}>
                            <span>应用飞书高级消息卡片</span>
                            <Tooltip title="需要则输入 飞书消息卡片搭建工具的Json Code">
                                <QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                            </Tooltip>
                        </MyFormItem>
                        <Checkbox
                            style={{ marginTop: '0', marginRight: '10px' }}
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                    </div>
                )}

                {!isChecked && (
                    <div style={{ display: 'flex' }}>
                        <MyFormItem
                            name="template"
                            label="告警模版"
                            style={{
                                marginRight: '10px',
                                width: '100vh',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}>
                            <TextArea rows={15} placeholder="输入告警模版" maxLength={10000} />
                        </MyFormItem>
                    </div>
                ) || (
                        <div style={{ display: 'flex' }}>
                            <MyFormItem
                                name="templateFiring"
                                label="告警模版"
                                style={{
                                    marginRight: '10px',
                                    width: '100vh',
                                }}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <TextArea rows={15} placeholder="输入告警模版" maxLength={10000} />
                            </MyFormItem>
                            <MyFormItem
                                name="templateRecover"
                                label="恢复模版"
                                style={{
                                    marginRight: '10px',
                                    width: '100vh',
                                }}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <TextArea rows={15} placeholder="输入告警模版" maxLength={10000} />
                            </MyFormItem>
                        </div>

                    )}

                <Button type="primary" htmlType="submit">
                    提交
                </Button>
            </Form>
        </Modal>
    )
}