import {Modal, Form, Input, Button, Select, Checkbox, Tooltip, message, InputNumber} from 'antd'
import React, { useState, useEffect } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { createNotice, updateNotice } from '../../api/notice'
import { getDutyManagerList } from '../../api/duty'
const { TextArea } = Input
const MyFormItemContext = React.createContext([])

function toArr(str) {
    return Array.isArray(str) ? str : [str]
}

const MyFormItemGroup = ({ prefix, children }) => {
    const prefixPath = React.useContext(MyFormItemContext)
    const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix])
    return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>
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

    const [subjectValue,setSubjectValue] = useState('')
    const [arrayEmailToValue, setArrayEmailToValue] = useState([]);
    const [arrayEmailCCValue, setArrayEmailCCValue] = useState([]);

    const handleInputEmailChange = (name,value) => {
        console.log(value)
        const newValue = value;
        const newArray = newValue.split(',').map(item => item.trim());
        switch (name) {
            case 'subject':
                setSubjectValue(newValue)
                break;
            case 'to':
                setArrayEmailToValue(newArray);
                break;
            case 'cc':
                setArrayEmailCCValue(newArray);
                break;
            default:
                break;
        }
    };

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
                templateRecover: selectedRow.templateRecover,
                email: {
                    subject: selectedRow.email.subject,
                    to: selectedRow.email.to,
                    cc: selectedRow.email.cc,
                }
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
                enableCard: isChecked ? "true" : "false",
                email:{
                    subject: subjectValue,
                    to: arrayEmailToValue,
                    cc: arrayEmailCCValue,
                }
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
                tenantId: selectedRow.tenantId,
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
        <Modal visible={visible} onCancel={onClose} footer={null} width={800} centered>
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
                                },
                                {
                                    value: "Email",
                                    label: "邮件"
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

                <div >

                    {notificationType === "Email"&& (
                        <MyFormItemGroup prefix={['email']}>
                            <MyFormItem name="subject" label="邮件主题" rules={[{required: true}]}>
                                <Input
                                    onChange={(e) => handleInputEmailChange('subject', e.target.value)}
                                    placeholder="WatchAlert监控报警平台" style={{width: '99%'}}/>
                            </MyFormItem>

                            <MyFormItem name="to" label="收件人" rules={[{required: true}]}>
                                <Input
                                    onChange={(e) => handleInputEmailChange('to', e.target.value)}
                                    placeholder="aaa@gmail.com,bbb@gmail.com (多个用英文逗号 , 隔开)" style={{width: '99%'}} />
                            </MyFormItem>

                            <MyFormItem name="cc" label="抄送人">
                                <Input
                                    onChange={(e) => handleInputEmailChange('cc', e.target.value)}
                                    placeholder="aaa@gmail.com,bbb@gmail.com (多个用英文逗号 , 隔开)" style={{width: '99%'}}/>
                            </MyFormItem>
                        </MyFormItemGroup>
                    ) || (
                        <MyFormItem
                            name="hook"
                            label="Hook"
                            tooltip="客户端机器人的 Hook 地址"
                            style={{
                                marginRight: '10px',
                                width: '99%',
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
                    )}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}