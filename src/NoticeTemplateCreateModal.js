import { Modal, Form, Input, Button } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import backendIP from './config'
const MyFormItemContext = React.createContext([])
const { TextArea } = Input

function toArr (str) {
  return Array.isArray(str) ? str : [str]
}

// 表单
const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
  return <Form.Item name={concatName} {...props} />
}

// 函数组件
const NoticeTemplateCreateModal = ({ visible, onClose, selectedRow, type }) => {
  const [form] = Form.useForm()

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

  // 提交
  const handleFormSubmit = async (values) => {

    const res = await axios.post(`http://${backendIP}/api/w8t/noticeTemplate/noticeTemplateCreate`, values)

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
            <Input disabled={type === 'update'} />
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