import { Modal, Form, Input, Button, Transfer } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
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
  const [mockData, setMockData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])

  // 提交
  const handleFormSubmit = async (values) => {

    const newValues = {
      ...values,
      permissions: targetKeys
    }

    const res = await axios.post("http://localhost:9001/api/w8t/role/roleCreate", newValues)

    console.log(res)
    // 关闭弹窗
    onClose()

  }

  useEffect(() => {
    // 模拟从后端获取数据的请求
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9001/api/w8t/permissions/permsList')
        const data = response.data.data
        formatData(data) // 格式化数据
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
  }, [])

  const formatData = (data) => {
    const tempTargetKeys = []
    const tempMockData = data.map((item) => {
      const { key } = item
      const chosen = targetKeys.includes(key)
      if (chosen) {
        tempTargetKeys.push(key)
      }
      return {
        key,
        api: item.api,
        title: item.key,
        chosen,
      }
    })

    setMockData(tempMockData)
    setTargetKeys(tempTargetKeys)
  }

  const handleOnChange = (keys) => {
    const tempTargetKeys = keys.map((key) => {
      const item = mockData.find((item) => item.key === key)
      return { key, api: item ? item.api : undefined }
    })
    setTargetKeys(tempTargetKeys)
  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

        <MyFormItem name="name" label="角色名称"
          rules={[
            {
              required: true,
              message: 'Please input your roleName!',
            },
          ]}>
          <Input />
        </MyFormItem>

        <MyFormItem name="description" label="描述">
          <Input />
        </MyFormItem>

        <MyFormItem name="permissions" label="选择权限">
          <Transfer
            showSearch
            dataSource={mockData}
            targetKeys={targetKeys.map((item) => {
              return item.key
            })}
            onChange={(keys) => handleOnChange(keys)}
            render={(item) => item.title}
            listStyle={{ height: 300, width: 300 }} // 设置列表样式
          />
        </MyFormItem>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default UserRoleCreateModal