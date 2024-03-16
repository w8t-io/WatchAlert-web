import { Modal, Form, Input, Button, Transfer, message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import backendIP from '../utils/config'
const MyFormItemContext = React.createContext([])

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
const UserRoleCreateModal = ({ visible, onClose, selectedRow, type, handleList }) => {
  const [form] = Form.useForm()
  const [mockData, setMockData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])
  const [disabledPermission, setDisabledPermission] = useState(false)

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
      setTargetKeys(selectedRow.permissions)
      form.setFieldsValue({
        id: selectedRow.id,
        name: selectedRow.name,
        description: selectedRow.description,
        permissions: targetKeys,
      })
      if (selectedRow.name === 'admin') {
        setDisabledPermission(true)
      } else {
        setDisabledPermission(false)
      }
    }
  }, [selectedRow, form])


  // 提交
  const handleFormSubmit = (values) => {

    if (type === 'create') {
      const newValues = {
        ...values,
        permissions: targetKeys
      }

      axios.post(`http://${backendIP}/api/w8t/role/roleCreate`, newValues)
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

    if (type === 'update') {
      const newValues = {
        ...values,
        id: selectedRow.id,
        permissions: targetKeys
      }

      axios.post(`http://${backendIP}/api/w8t/role/roleUpdate`, newValues)
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

    // 关闭弹窗
    onClose()

  }

  useEffect(() => {
    // 模拟从后端获取数据的请求
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://${backendIP}/api/w8t/permissions/permsList`)
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
          <Input
            value={spaceValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={type === 'update'} />
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
            disabled={disabledPermission}
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