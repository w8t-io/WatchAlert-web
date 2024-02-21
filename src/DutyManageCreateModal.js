import { Modal, Form, Input, Button, message, Select, Tooltip } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import backendIP from './config'

const MyFormItemContext = React.createContext([])

function toArr (str) {
  return Array.isArray(str) ? str : [str]
}

const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
  return <Form.Item name={concatName} {...props} />
}

const DutyManageCreateModal = ({ visible, onClose, handleList }) => {
  const [form] = Form.useForm()

  const handleCreate = async (data) => {
    const res = await axios.post(`http://${backendIP}/api/w8t/dutyManage/dutyManageCreate`, data)
    if (res.status === 200) {
      message.success("创建成功")
    } else {
      message.error("创建失败", res.data.data)
    }
  }

  const handleFormSubmit = async (values) => {

    await handleCreate(values)

    handleList()

    // 关闭弹窗
    onClose()
  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>
        <MyFormItem name="name" label="名称"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </MyFormItem>

        <MyFormItem name="description" label="描述">
          <Input />
        </MyFormItem>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default DutyManageCreateModal