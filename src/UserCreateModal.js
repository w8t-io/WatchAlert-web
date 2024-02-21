import { Modal, Form, Input, Button, Select, Switch, message } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import backendIP from './config'

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
const UserCreateModal = ({ visible, onClose, selectedRow, type, handleList }) => {
  const [form] = Form.useForm()
  const [enabled, setEnabled] = useState("false")
  const [roleData, setRoleData] = useState([])
  const [username, serUsername] = useState("")

  useEffect(() => {
    if (selectedRow) {
      if (type === 'update') {
        setEnabled(selectedRow.joinDuty)
        serUsername(selectedRow.username)
      }
      form.setFieldsValue({
        username: selectedRow.username,
        phone: selectedRow.phone,
        email: selectedRow.email,
        joinDuty: enabled,
        dutyUserId: selectedRow.dutyUserId,
        role: selectedRow.role
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

      const res = await axios.post(`http://${backendIP}/api/system/register`, newValues)

      if (res.status === 200) {
        message.success("创建成功")
      } else {
        message.error("创建失败", res.data.data)
      }
    }

    if (type === 'update') {
      const newValues = {
        ...values,
        joinDuty: values.joinDuty ? "true" : "false",
        userid: selectedRow.userid,
        password: selectedRow.password,
      }

      const res = await axios.post(`http://${backendIP}/api/w8t/user/userUpdate`, newValues)

      if (res.status === 200) {
        message.success("更新成功")
      } else {
        message.error("更新失败", res.data.data)
      }
    }

    handleList()

    // 关闭弹窗
    onClose()

  }

  const handleGetRoleData = async () => {
    const res = await axios.get(`http://${backendIP}/api/w8t/role/roleList`)

    const newData = res.data.data.map((item) => ({
      label: item.name,
      value: item.name
    }))

    setRoleData(newData)
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
                message: 'Please input your username!',
              },
            ]}>
            <Input disabled={type === 'update'} />
          </MyFormItem>
          {type === 'create' && <Form.Item
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

        <MyFormItem name="role" label="用户角色"
          rules={[
            {
              required: true,
              message: 'Please input your Role!',
            },
          ]}>
          <Select
            placeholder="请选择用户角色"
            onClick={handleGetRoleData}
            options={roleData}
            disabled={username === "admin"}
          />
        </MyFormItem>

        <MyFormItem name="joinDuty" label="接受值班">
          <Switch defaultChecked={false} onChange={onChangeJoinDuty} />
        </MyFormItem>

        {enabled === 'true' && <MyFormItem name="dutyUserId" label="UserID「飞书/钉钉」"
          rules={[
            {
              required: true,
              message: 'Please input your UserID!',
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