import { Modal, Form, Input, Button, DatePicker, Select, Space } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
const MyFormItemContext = React.createContext([])

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
const UserRoleCreateModal = ({ visible, onClose }) => {
  const [form] = Form.useForm()

  // 提交
  const handleFormSubmit = async (values) => {

    const res = await axios.post("http://localhost:9001/api/v1/auth/register", values)

    console.log(res)
    // 关闭弹窗
    onClose()

  }


  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

        <MyFormItem name="username" label="角色名称"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}>
          <Input />
        </MyFormItem>

        <MyFormItem name="phone" label="描述">
          <Input />
        </MyFormItem>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default UserRoleCreateModal