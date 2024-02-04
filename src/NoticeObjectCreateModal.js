import { Modal, Form, Input, Button, Switch, Select, Tooltip } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

const MyFormItemContext = React.createContext([])

function toArr (str) {
  return Array.isArray(str) ? str : [str]
}

const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
  return <Form.Item name={concatName} {...props} />
}

const NoticeObjectCreateModal = ({ visible, onClose, selectedRow, type }) => {
  const [form] = Form.useForm()
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    if (selectedRow) {
      setNotificationType(selectedRow.noticeType)
      form.setFieldsValue({
        uuid: selectedRow.uuid,
        name: selectedRow.name,
        dataSource: selectedRow.dataSource,
        dutyId: selectedRow.dutyId,
        env: selectedRow.env,
        feishuChatId: selectedRow.feishuChatId,
        noticeStatus: selectedRow.noticeStatus,
        noticeType: selectedRow.noticeType,
      })
    }
  }, [selectedRow, form])

  const handleNotificationTypeChange = (value) => {
    setNotificationType(value)
  }

  const handleCreate = async (data) => {
    await axios.post("http://localhost:9001/api/v1/alertNotice/create", data)
  }

  const handleUpdate = async (data) => {
    const newData = {
      ...data,
      uuid: selectedRow.uuid,
    }

    await axios.post("http://localhost:9001/api/v1/alertNotice/update", newData)
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
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>
        <MyFormItem name="name" label="名称">
          <Input />
        </MyFormItem>

        <MyFormItem name="env" label="应用环境">
          <Input />
        </MyFormItem>

        <MyFormItem name="dutyId" label="值班日程 ID">
          <Input />
        </MyFormItem>

        <MyFormItem name="noticeType" label="通知类型">
          <Select
            placeholder="请选择通知类型类型"
            style={{
              flex: 1,
            }}
            options={[
              {
                value: "FeiShu",
                label: "FeiShu",
              },
            ]}
            onChange={handleNotificationTypeChange}
          />
        </MyFormItem>

        {notificationType === "FeiShu" && (
          <MyFormItem name="feishuChatId" label="飞书 ChatID">
            <Input />
          </MyFormItem>
        )}

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default NoticeObjectCreateModal