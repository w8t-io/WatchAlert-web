import { Modal, Form, Input, Button, Select, Tooltip } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
const { TextArea } = Input
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
        dutyId: selectedRow.dutyId,
        env: selectedRow.env,
        noticeType: selectedRow.noticeType,
        hook: selectedRow.hook,
        template: selectedRow.template
      })
    }
  }, [selectedRow, form])

  const handleNotificationTypeChange = (value) => {
    setNotificationType(value)
  }

  const handleCreate = async (data) => {
    await axios.post("http://localhost:9001/api/w8t/notice/noticeCreate", data)
  }

  const handleUpdate = async (data) => {
    const newData = {
      ...data,
      uuid: selectedRow.uuid,
    }

    await axios.post("http://localhost:9001/api/w8t/notice/noticeUpdate", newData)
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
            <Input />
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
              placeholder="请选择通知类型类型"
              options={[
                {
                  value: "FeiShu",
                  label: "飞书",
                },
              ]}

              onChange={handleNotificationTypeChange}
            />
          </MyFormItem>

          <MyFormItem
            name="dutyId"
            label="值班日程 ID"
            style={{
              marginRight: '10px',
              width: '500px',
            }}>
            <Input />
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
            ]}>
            <Input />
          </MyFormItem>

        </div>

        <div style={{ display: 'flex' }}>

          <MyFormItem
            name="template"
            label="告警模版"
            style={{
              marginRight: '10px',
              width: '100vh',
            }}>
            <TextArea rows={15} placeholder="输入告警模版" maxLength={1000} />
          </MyFormItem>

        </div>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default NoticeObjectCreateModal