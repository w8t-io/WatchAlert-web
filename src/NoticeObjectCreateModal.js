import { Modal, Form, Input, Button, Switch, Select, Tooltip } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'

const MyFormItemContext = React.createContext([])

function toArr (str) {
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

const NoticeObjectCreateModal = ({ visible, onClose }) => {
  const [form] = Form.useForm()
  const [notificationType, setNotificationType] = useState(null) // 设置初始通知类型为空

  const handleNotificationTypeChange = (value) => {
    setNotificationType(value)
  }

  const handleCreate = async (data) => {
    await axios.post("http://localhost:9001/api/v1/alertNotice/create", data)
  }

  const handleFormSubmit = async (values) => {
    console.log('Form submitted:', values)
    await handleCreate(values)
    // 关闭弹窗
    onClose()
  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>
        <MyFormItem name="name" label="名称">
          <Input />
        </MyFormItem>

        <MyFormItem name="env" label="应用环境">
          <Input />
        </MyFormItem>

        <MyFormItem name="NoticeType" label="通知类型">
          <Select
            placeholder="请选择通知类型类型"
            style={{
              flex: 1,
            }}
            options={[
              {
                value: 'FeiShu',
                label: 'FeiShu',
              },
            ]}
            onChange={handleNotificationTypeChange}
          />
        </MyFormItem>

        {notificationType === 'FeiShu' && (
          <MyFormItem name="feishuChatId" label="飞书 ChatID">
            <Input />
          </MyFormItem>
        )}

        <MyFormItem name="dutyId" label="值班ID">
          <Input />
        </MyFormItem>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default NoticeObjectCreateModal