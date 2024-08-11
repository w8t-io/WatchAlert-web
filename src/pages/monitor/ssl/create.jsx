import {  Form, Input, Button, Switch, Divider, Select, InputNumber } from 'antd'
import React, { useState, useEffect } from 'react'
import { getNoticeList } from '../../../api/notice'
import { useParams } from 'react-router-dom'
import {createMonitor, getMonitor, updateMonitor} from "../../../api/monitor";
const MyFormItemContext = React.createContext([])

function toArr(str) {
    return Array.isArray(str) ? str : [str]
}

// 表单
const MyFormItem = ({ name, ...props }) => {
    const prefixPath = React.useContext(MyFormItemContext)
    const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
    return <Form.Item name={concatName} {...props} />
}

export const CreateMonitorSSLRule = ({ type, handleList }) => {
    const [form] = Form.useForm()
    const { id } = useParams()
    const [selectedRow,setSelectedRow] = useState({})
    const [enabled, setEnabled] = useState(true) // 设置初始状态为 true
    const [recoverNotify,setRecoverNotify] = useState(true)
    const [noticeOptions, setNoticeOptions] = useState([])  // 通知对象列表
    // 禁止输入空格
    const [spaceValue, setSpaceValue] = useState('')
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleSearchRuleInfo = async ()=>{
            try {
                const params = {
                    id: id
                };
                const res = await getMonitor(params);
                setSelectedRow(res.data); // 更新状态
                initBasicInfo(res.data)
            } catch (error) {
                console.error('Error fetching rule info:', error);
            } finally {
                setLoading(false); // 请求完成后设置 loading 状态
            }
        }

        if (type === "edit"){
            handleSearchRuleInfo()
        }

        handleGetNoticeData()
    }, [])

    const initBasicInfo =(selectedRow)=>{
        form.setFieldsValue({
            name: selectedRow.name,
            domain: selectedRow.domain,
            expectTime: selectedRow.expectTime,
            description: selectedRow.description,
            enabled: selectedRow.enabled,
            evalInterval: selectedRow.evalInterval,
            noticeId: selectedRow.noticeId,
            repeatNoticeInterval: selectedRow.repeatNoticeInterval,
            ruleId: selectedRow.ruleId,
            ruleName: selectedRow.ruleName,
            recoverNotify:selectedRow.recoverNotify,
        })
    }

    const handleCreateRule = async (values) => {
        try {
            const params = {
                ...values,
                recoverNotify:recoverNotify,
                enabled: enabled
            }

            await createMonitor(params)
            handleList()
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdateRule = async (values) => {
        try {
            const params = {
                ...values,
                tenantId: selectedRow.tenantId,
                id: selectedRow.id,
                recoverNotify:recoverNotify,
                enabled: enabled,
            }

            await updateMonitor(params)
            handleList()
        } catch (error) {
            console.error(error)
        }
    }

    // 创建
    const handleFormSubmit = async (values) => {
        if (type === 'add') {
            handleCreateRule(values)
        }
        if (type === 'edit') {
            handleUpdateRule(values)
        }

        window.history.back()
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

    // 在onChange事件处理函数中更新选择的通知对象值
    const handleSelectChange = (value) => {
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

    if (loading && type === "edit") {
        return <div>Loading...</div>;
    }

    // 域名验证正则表达式
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;

    const validateDomain = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('请输入域名'));
        }
        if (value.toLowerCase().startsWith('http://') || value.toLowerCase().startsWith('https://')) {
            return Promise.reject(new Error('域名不应包含 http:// 或 https://'));
        }
        if (!domainRegex.test(value)) {
            return Promise.reject(new Error('请输入有效的域名'));
        }
        return Promise.resolve();
    };

    return (
        <div style={{textAlign:'left',
            width: '100%',
            // flex: 1,
            alignItems: 'flex-start',
            marginTop: '-20px',
            maxHeight: 'calc((-145px + 100vh) - 65px - 40px)',
            overflowY: 'auto',
        }}>
            <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

                <div>
                    <strong style={{ fontSize: '20px' }}>基础配置</strong>
                    <div style={{ display: 'flex' }}>
                        <MyFormItem
                            name="name"
                            label="规则名称"
                            style={{
                                marginRight: '10px',
                                width: '50%',
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

                        <MyFormItem name="description" label="描述" style={{width: '50%',}}>
                            <Input />
                        </MyFormItem>
                    </div>
                </div>

                <Divider />

                <div>
                    <strong style={{fontSize: '20px'}}>规则配置</strong>
                    <div style={{display: 'flex', gap:'10px'}}>
                        <MyFormItem
                            name="domain"
                            label="域名"
                            style={{
                                width: '50%',
                            }}
                            rules={[
                                {
                                    required: true,
                                    validator: validateDomain,
                                },
                            ]}
                        >
                            <Input placeholder="请输入域名，例如：example.com"/>
                        </MyFormItem>

                        <MyFormItem
                            name="expectTime"
                            label="表达式"
                            style={{
                                width: '50%',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}>
                            <InputNumber placeholder="输入阈值" addonBefore={
                                "当证书有效期 <"
                            }addonAfter={"天时, 触发告警"}/>
                        </MyFormItem>
                    </div>

                    <div style={{display: 'flex'}}>
                        <MyFormItem
                            name="evalInterval"
                            label="执行频率"
                            style={{
                                width: '100%',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber
                                style={{width: '100%'}}
                                addonAfter={<span>小时</span>}
                                placeholder="10"
                                min={1}
                            />
                        </MyFormItem>
                    </div>
                </div>

                <Divider/>

                <div>
                    <strong style={{fontSize: '20px'}}>通知配置</strong>

                    <div style={{display: 'flex'}}>
                        <MyFormItem
                            name="noticeId"
                            label="通知对象"
                            tooltip="默认通知对象"
                            style={{
                                marginRight: '10px',
                                width: '50%',
                            }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                allowClear
                                placeholder="选择通知对象"
                                options={noticeOptions}
                                onChange={handleSelectChange} // 使用onChange事件处理函数来捕获选择的值
                            />
                        </MyFormItem>

                        <MyFormItem
                            name="repeatNoticeInterval"
                            label="重复通知"
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
                                style={{width: '100%'}}
                                addonAfter={<span>分钟</span>}
                                placeholder="60"
                                min={1}
                            />
                        </MyFormItem>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: '10px'}}>
                            启用恢复通知
                        </div>
                        <MyFormItem
                            style={{marginBottom: '0'}}
                            name="recoverNotify"
                            valuePropName="checked"
                        >
                            <Switch
                                value={recoverNotify}
                                checked={recoverNotify}
                                onChange={(e) => {setRecoverNotify(e)}}
                            />
                        </MyFormItem>
                    </div>

                </div>

                <div style={{ marginTop: '10px' }}>
                    <MyFormItem
                        name="enabled"
                        label="状态"
                        tooltip="规则启用/禁用"
                        valuePropName="checked"
                    >
                        <Switch value={enabled} checked={enabled} onChange={(e)=>{setEnabled(e)}} />
                    </MyFormItem>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </div>
            </Form >
        </div>
    )
}