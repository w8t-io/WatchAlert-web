import {Modal, Form, Input, Button, Select, Card} from 'antd'
import React, { useState, useEffect } from 'react'
import { createNotice, updateNotice } from '../../api/notice'
import { getDutyManagerList } from '../../api/duty'
import FeiShuImg from "./img/feishu.svg";
import EmailImg from "./img/Email.svg";
import DingDingImg from "./img/dingding.svg";
import { searchNoticeTmpl} from "../../api/noticeTmpl";
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
    const [dutyList, setDutyList] = useState([])
    const [selectedDutyItem, setSelectedDutyItem] = useState([])

    const [subjectValue,setSubjectValue] = useState('')
    const [arrayEmailToValue, setArrayEmailToValue] = useState([]);
    const [arrayEmailCCValue, setArrayEmailCCValue] = useState([]);

    const [selectedNoticeCard, setSelectedNoticeCard] = useState(null);
    const [noticeType,setNoticeType] = useState('')

    const [noticeTmplItems,setNoticeTmplItems] = useState([])
    const [selectNoticeTmpl,setSelectNoticeTmpl] = useState('')

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
        handleGetNoticeTmpl()
        if (selectedRow) {
            form.setFieldsValue({
                uuid: selectedRow.uuid,
                name: selectedRow.name,
                dutyId: selectedRow.dutyId,
                env: selectedRow.env,
                noticeType: selectedRow.noticeType,
                hook: selectedRow.hook,
                noticeTmplId: selectedRow.noticeTmplId,
                email: {
                    subject: selectedRow.email.subject,
                    to: selectedRow.email.to,
                    cc: selectedRow.email.cc,
                }
            })

            let t = 0;
            if (selectedRow.noticeType === "FeiShu"){
                t = 0
            } else if (selectedRow.noticeType === "Email"){
                t = 1
            } else if (selectedRow.noticeType === "DingDing"){
                t = 2
            }

            setSelectedNoticeCard(t)
            setNoticeType(selectedRow.noticeType)
            setSelectNoticeTmpl(selectedRow.noticeTmplId)
        }
    }, [selectedRow, form])

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

    const cards = [
        {
            imgSrc: FeiShuImg,
            text: '飞书',
        },
        {
            imgSrc: EmailImg,
            text: '邮件',
        },
        {
            imgSrc: DingDingImg,
            text: '钉钉',
        },
    ];

    useEffect(() => {
        if (selectedNoticeCard === null){
            setSelectedNoticeCard(0)
            setNoticeType("FeiShu")
        }
    }, [])

    const handleCardClick = (index) => {
        let t = "FeiShu";
        if (index === 1){
            t = "Email"
        } else if (index === 2){
            t = "DingDing"
        }

        setNoticeType(t)
        setSelectedNoticeCard(index);
    };

    const handleGetNoticeTmpl = async () =>{
        const params = {
            noticeType: noticeType,
        }
        const res =  await searchNoticeTmpl(params)
        const newData = res.data.map((item) => ({
            label: item.name,
            value: item.id
        }))
        setNoticeTmplItems(newData)
    }

    return (
        <Modal visible={visible} onCancel={onClose} footer={null} width={800} centered>
            <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

                <div style={{display: 'flex'}}>
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
                            disabled={type === 'update'}/>
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

                <div style={{display: 'flex'}}>
                    <MyFormItem name="" label="通知类型">
                        <div style={{display: 'flex', gap: '10px'}}>
                            {cards.map((card, index) => (
                                <Card
                                    key={index}
                                    style={{
                                        height: 100,
                                        width: 120,
                                        position: 'relative',
                                        cursor: type === 'update' ? 'not-allowed' : 'pointer',
                                        border: selectedNoticeCard === index ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                        pointerEvents: type === 'update' ? 'none' : 'auto',
                                    }}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        marginTop: '-10px'
                                    }}>
                                        <img src={card.imgSrc}
                                             style={{height: '50px', width: '100px', objectFit: 'contain'}}
                                             alt={card.text}/>
                                        <p style={{
                                            fontSize: '12px',
                                            textAlign: 'center',
                                            marginTop: '5px'
                                        }}>{card.text}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </MyFormItem>
                </div>

                <div>
                    {noticeType === "Email" && (
                        <MyFormItemGroup prefix={['email']}>
                            <MyFormItem name="subject" label="邮件主题" rules={[{required: true}]}>
                                <Input
                                    onChange={(e) => handleInputEmailChange('subject', e.target.value)}
                                    placeholder="WatchAlert监控报警平台" style={{width: '100%'}}/>
                            </MyFormItem>

                            <MyFormItem name="to" label="收件人" rules={[{required: true}]}>
                                <Input
                                    onChange={(e) => handleInputEmailChange('to', e.target.value)}
                                    placeholder="aaa@gmail.com,bbb@gmail.com (多个用英文逗号 , 隔开)"
                                    style={{width: '100%'}}/>
                            </MyFormItem>

                            <MyFormItem name="cc" label="抄送人">
                                <Input
                                    onChange={(e) => handleInputEmailChange('cc', e.target.value)}
                                    placeholder="aaa@gmail.com,bbb@gmail.com (多个用英文逗号 , 隔开)"
                                    style={{width: '100%'}}/>
                            </MyFormItem>
                        </MyFormItemGroup>
                    ) || (
                        <MyFormItem
                            name="hook"
                            label="Hook"
                            tooltip="客户端机器人的 Hook 地址"
                            style={{
                                marginRight: '10px',
                                width: '100%',
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
                            <Input/>
                        </MyFormItem>
                    )}
                </div>

                <div>
                    <MyFormItem
                        name="noticeTmplId"
                        label="通知模版"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        >
                        <Select
                            showSearch
                            allowClear
                            placeholder="请选择通知模版"
                            options={noticeTmplItems}
                            value={selectNoticeTmpl}
                            tokenSeparators={[',']}
                            onChange={setSelectNoticeTmpl}
                            onClick={handleGetNoticeTmpl}
                        />
                    </MyFormItem>

                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}