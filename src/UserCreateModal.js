import { Modal, Form, Input, Button, DatePicker, Select, Switch } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

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
const UserCreateModal = ({ visible, onClose, selectedRow, type }) => {
  const [form] = Form.useForm()
  const [enabled, setEnabled] = useState("false")

  useEffect(() => {
    if (selectedRow) {
      if (type === 'update') {
        setEnabled(selectedRow.joinDuty)
      }
      form.setFieldsValue({
        username: selectedRow.username,
        phone: selectedRow.phone,
        joinDuty: enabled,
        fsUserId: selectedRow.fsUserId,
        amount_type: selectedRow.amount_type
      })
    }
  }, [selectedRow, form])

  // 提交
  const handleFormSubmit = async (values) => {

    if (type === 'create') {
      const newValues = {
        ...values,
        joinDuty: values.joinDuty ? "true" : "false"
      }

      await axios.post("http://localhost:9001/api/v1/auth/register", newValues)
    }

    if (type === 'update') {
      const newValues = {
        ...values,
        joinDuty: values.joinDuty ? "true" : "false",
        userid: selectedRow.userid,
        password: selectedRow.password,
      }

      console.log(newValues)

      await axios.post("http://localhost:9001/api/v1/auth/updateUser", newValues)
    }


    // 关闭弹窗
    onClose()

  }

  const onChangeJoinDuty = (checked) => {
    setEnabled(checked ? "true" : "false")
  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

        <div style={{ display: 'flex' }}>
          <MyFormItem name="username" label="用户名"
            style={{
              marginRight: '10px',
              width: '500px',
            }}
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}>
            <Input />
          </MyFormItem>
          {type === '' && <Form.Item
            name="password"
            label="Password"
            style={{
              marginRight: '10px',
              width: '500px',
            }}
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>}

        </div>

        <MyFormItem name="phone" label="手机号">
          <Input />
        </MyFormItem>

        <MyFormItem name="email" label="邮箱">
          <Input />
        </MyFormItem>

        <MyFormItem name="amount_type" label="用户角色"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}>
          <Select
            placeholder="请选择用户角色"
            options={[
              {
                value: 'readonly',
                label: '只读',
              },
              {
                value: 'readwrite',
                label: '读写',
              },
            ]}
          />
        </MyFormItem>

        <MyFormItem name="joinDuty" label="接受值班">
          <Switch defaultChecked={false} onChange={onChangeJoinDuty} />
        </MyFormItem>

        {enabled === 'true' && <MyFormItem name="fsUserId" label="飞书UserID"
          rules={[
            {
              required: true,
              message: 'Please input your 飞书UserID!',
            },
          ]}>
          <Input />
        </MyFormItem>}

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default UserCreateModal