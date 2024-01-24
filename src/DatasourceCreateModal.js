import { Modal, Form, Input, Button, Switch, Select, Tooltip } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'

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

const DatasourceCreateModal = ({ visible, onClose }) => {
  const [form] = Form.useForm()
  const [enabled, setEnabled] = useState(true) // 设置初始状态为 true

  const handleCreate = async (data) => {
    await axios.post("http://localhost:9001/api/v1/alert/dataSourceCreate", data)
  }

  const handleFormSubmit = async (values) => {
    console.log('Form submitted:', values)

    await handleCreate(values)

    // 关闭弹窗
    onClose()
  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>
        <MyFormItem name="name" label="数据源名称">
          <Input />
        </MyFormItem>

        <MyFormItem name="type" label="数据源类型">
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
          <MyFormItem name="url" label="URL">
            <Input />
          </MyFormItem>

          <MyFormItem name="timeout" label="Timeout">
            <Input />
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