import { Modal, Form, Input, Button, Switch, Select, InputNumber, message } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import backendIP from './config'

const MyFormItemContext = React.createContext([])

function toArr (str) {
  return Array.isArray(str) ? str : [str]
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix])
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>
}

const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
  return <Form.Item name={concatName} {...props} />
}

const DatasourceCreateModal = ({ visible, onClose, selectedRow, type, handleList }) => {
  const [form] = Form.useForm()
  const [enabled, setEnabled] = useState(true) // 设置初始状态为 true

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
        name: selectedRow.name,
        type: selectedRow.type,
        http: {
          url: selectedRow.http.url,
          timeout: selectedRow.http.timeout
        },
        description: selectedRow.description,
        enabled: selectedRow.enabled
      })
    }
  }, [selectedRow, form])

  const handleCreate = async (data) => {
    axios.post(`http://${backendIP}/api/w8t/datasource/dataSourceCreate`, data)
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

  const handleUpdate = async (data) => {
    axios.post(`http://${backendIP}/api/w8t/datasource/dataSourceUpdate`, data)
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

  const handleFormSubmit = async (values) => {

    if (type === 'create') {
      await handleCreate(values)
    }

    if (type === 'update') {
      const newValues = {
        ...values,
        id: selectedRow.id
      }
      await handleUpdate(newValues)
    }

    // 关闭弹窗
    onClose()

  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>
        <MyFormItem name="name" label="数据源名称"
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

        <MyFormItem name="type" label="数据源类型"
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            placeholder="请选择数据源类型"
            style={{
              flex: 1,
            }}
            options={[
              {
                value: 'Prometheus',
                label: 'Prometheus',
              },
            ]}
          />
        </MyFormItem>

        <MyFormItemGroup prefix={['http']}>
          <MyFormItem name="url" label="URL"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^(http|https):\/\//,
                message: '输入正确的URL格式',
              },
            ]}>
            <Input />
          </MyFormItem>

          <MyFormItem name="timeout" label="Timeout"
            rules={[
              {
                required: true,
              },
            ]}>
            <InputNumber
              style={{ width: '100%' }}
              addonAfter={<span>秒</span>}
              placeholder="10"
              min={1}
            />
          </MyFormItem>
        </MyFormItemGroup>

        <MyFormItem name="description" label="描述">
          <Input />
        </MyFormItem>

        <MyFormItem
          name="enabled"
          label={"状态"}
          tooltip="启用/禁用"
          valuePropName="checked"
        >
          <Switch checked={enabled} onChange={setEnabled} />
        </MyFormItem>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default DatasourceCreateModal