import { Modal, Form, Input, Button, message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import backendIP from '../utils/config'
const MyFormItemContext = React.createContext([])
const { TextArea } = Input

function toArr(str) {
  return Array.isArray(str) ? str : [str]
}

// 表单
const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
  return <Form.Item name={concatName} {...props} />
}

// 函数组件
const NoticeTemplateCreateModal = ({ visible, onClose, selectedRow, type, handleList }) => {
  const [form] = Form.useForm()

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
    if (selectedRow) {
      form.setFieldsValue({
        id: selectedRow.id,
        name: selectedRow.name,
        description: selectedRow.description,
        template: selectedRow.template,
      })
    }
  }, [selectedRow, form])

  const handleCreate = async (values) => {
    axios.post(`http://${backendIP}/api/w8t/noticeTemplate/noticeTemplateCreate`, values)
      .then((res) => {
        if (res.status === 200) {
          message.success("创建成功")
          handleList()
        }
      })
      .catch(() => {
        message.error("创建失败")
      })
  }

  const handleUpdate = async (values) => {
    const newValue = {
      ...values,
      id: selectedRow.id,
    }
    axios.post(`http://${backendIP}/api/w8t/noticeTemplate/noticeTemplateUpdate`, newValue)
      .then((res) => {
        if (res.status === 200) {
          message.success("更新成功")
          handleList()
        }
      })
      .catch(() => {
        message.error("更新失败")
      })
  }

  // 提交
  const handleFormSubmit = (values) => {

    if (type === 'create') {
      handleCreate(values)

    }
    if (type === 'update') {
      handleUpdate(values)
    }

    // 关闭弹窗
    onClose()

  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null} width={800}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

        <div style={{ display: 'flex' }}>
          <MyFormItem name="name" label="名称"
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

          <MyFormItem name="description" label="描述"
            style={{
              marginRight: '10px',
              width: '500px',
            }}>
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
            <TextArea rows={15} placeholder="输入告警模版" maxLength={10000} />
          </MyFormItem>
        </div>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default NoticeTemplateCreateModal