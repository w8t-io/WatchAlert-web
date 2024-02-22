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

  const handleCreate = async (data) => {
    axios.post(`http://${backendIP}/api/w8t/dutyManage/dutyManageCreate`, data)
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

  const handleFormSubmit = async (values) => {

    await handleCreate(values)

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
          <Input
            value={spaceValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress} />
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