import { Modal, Form, Input, Button } from 'antd'
import axios from 'axios'
import React from 'react'

// 函数组件
const UserChangePass = ({ visible, onClose, userid }) => {

  // 提交
  const handleFormSubmit = async (values) => {

    console.log(values)

    const res = await axios.post(`http://localhost:9001/api/v1/auth/changePass?userid=${userid}`, values)

    console.log(res)
    // 关闭弹窗
    onClose()

  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>

      <Form name="password_form" onFinish={handleFormSubmit} style={{ marginTop: '30px' }}>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator (_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('The new password that you entered do not match!'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 100, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

    </Modal>
  )
}

export default UserChangePass