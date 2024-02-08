import { Modal, Form, Input, Button, DatePicker, Select, Space } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
const { RangePicker } = DatePicker

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
const SilenceRuleCreateModal = ({ visible, onClose, selectedRow, type }) => {
  const [form] = Form.useForm()
  const [startTimestamp, setStartTimestamp] = useState(null)
  const [endTimestamp, setEndTimestamp] = useState(null)
  const [alertFingerprint, setAlertFingerprint] = useState([])
  const [dataSourceType, setDataSourceType] = useState('')

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        datasource_type: selectedRow.datasource_type,
        fingerprint: selectedRow.fingerprint,
      })
    }
  }, [selectedRow, form])

  // 时间选择器
  const onChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      const startTimestamp = moment(dateStrings[0]).unix()
      const endTimestamp = moment(dateStrings[1]).unix()
    }
  }

  const onOk = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const startTimestamp = dates[0].unix()
      const endTimestamp = dates[1].unix()
      setStartTimestamp(startTimestamp)
      setEndTimestamp(endTimestamp)
    }
  }
  // ---

  // 获取当前告警
  const handleSearchCurAlert = async () => {
    try {
      const res = await axios.get(`http://localhost:9001/api/w8s/event/curEvent?dsType=${dataSourceType}`)
      const options = res.data.data.map((item) => ({ label: item.rule_name, value: item.fingerprint }))
      setAlertFingerprint(options)
    } catch (error) {
      console.error("Error fetching duty users:", error)
    }
  }

  const onClickToDsType = async (value) => {
    setDataSourceType(value)
  }

  // 创建
  const handleCreate = async (data) => {
    await axios.post("http://localhost:9001/api/w8t/silence/silenceCreate", data)
  }

  // 更新
  const handleUpdate = async (data) => {
    await axios.post("http://localhost:9001/api/w8t/silence/silenceUpdate", data)
  }

  // 提交
  const handleFormSubmit = async (values) => {

    if (type === 'create') {
      const newData = {
        ...values,
        starts_at: startTimestamp,
        ends_at: endTimestamp,
      }

      await handleCreate(newData)
    }

    if (type === 'update') {
      const newData = {
        ...values,
        id: selectedRow.id,
        create_by: selectedRow.create_by,
        starts_at: startTimestamp,
        ends_at: endTimestamp,
      }

      await handleUpdate(newData)
    }

    // 关闭弹窗
    onClose()

  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

        <MyFormItem name="datasource_type" label="数据源类型">
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
            onChange={onClickToDsType}
          />
        </MyFormItem>

        <MyFormItem name="fingerprint" label="告警指纹">
          <Select
            placeholder="请选择要静默的告警指纹ID"
            style={{
              flex: 1,
            }}
            options={alertFingerprint}
            onClick={handleSearchCurAlert}
          />
        </MyFormItem>

        <Space direction="vertical" size={10}>
          <div>时间选择器</div>
          <RangePicker
            showTime={{
              format: 'HH:mm:ss',
            }}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChange}
            onOk={onOk}
          />
        </Space>

        <MyFormItem name="comment" label="评论">
          <Input />
        </MyFormItem>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default SilenceRuleCreateModal