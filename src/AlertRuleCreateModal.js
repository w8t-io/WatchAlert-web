import { Modal, Form, Input, Button, Switch, Radio, Divider, Select, Tooltip, InputNumber } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import backendIP from './config'
const MyFormItemContext = React.createContext([])

function toArr (str) {
  return Array.isArray(str) ? str : [str]
}

// 表单组
const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix])
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>
}

// 表单
const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
  return <Form.Item name={concatName} {...props} />
}

const AlertRuleCreateModal = ({ visible, onClose, selectedRow, type }) => {
  const [form] = Form.useForm()
  const [enabled, setEnabled] = useState(true) // 设置初始状态为 true
  const [selectedType, setSelectedType] = useState('') // 数据源类型
  const [datasourceOptions, setDatasourceOptions] = useState([])  // 数据源列表
  const [selectedItems, setSelectedItems] = useState([])  //选择数据源

  const [noticeLabels, setNoticeLabels] = useState([]) // notice Lable
  const [noticeOptions, setNoticeOptions] = useState([])  // 通知对象列表
  // 在组件中定义一个状态来存储选择的通知对象值
  const [selectedNotice, setSelectedNotice] = useState('')

  // 告警等级
  const [severityValue, setSeverityValue] = useState(1)
  const onChange = (e) => {
    setSeverityValue(e.target.value)
  }

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        annotations: selectedRow.annotations,
        datasourceId: selectedRow.datasourceId,
        datasourceType: selectedRow.datasourceType,
        description: selectedRow.description,
        enabled: selectedRow.enabled,
        evalInterval: selectedRow.evalInterval,
        forDuration: selectedRow.forDuration,
        labels: selectedRow.labels,
        noticeGroup: selectedRow.noticeGroup,
        noticeId: selectedRow.noticeId,
        repeatNoticeInterval: selectedRow.repeatNoticeInterval,
        ruleConfig: selectedRow.ruleConfig,
        ruleId: selectedRow.ruleId,
        ruleName: selectedRow.ruleName
      })
    }
  }, [selectedRow, form])


  // 创建
  const handleFormSubmit = async (values) => {

    if (type === 'create') {
      const newData = {
        ...values,
        noticeGroup: noticeLabels
      }

      await axios.post(`http://${backendIP}/api/w8t/rule/ruleCreate`, newData)
    }

    if (type === 'update') {
      const newData = {
        ...values,
        ruleId: selectedRow.ruleId,
        noticeGroup: noticeLabels
      }

      await axios.post(`http://${backendIP}/api/w8t/rule/ruleUpdate`, newData)
    }

    // 关闭弹窗
    onClose()
  }

  // 获取数据源
  const handleGetDatasourceData = async (data) => {

    const res = await axios.get(`http://${backendIP}/api/w8t/datasource/dataSourceSearch?dsType=${data}`)

    const newData = res.data.data.map((item) => ({
      label: item.name,
      value: item.id
    }))

    // 将数据设置为选项对象数组
    setDatasourceOptions(newData)
  }

  // 获取通知对象
  const handleGetNoticeData = async (data) => {

    const res = await axios.get(`http://${backendIP}/api/w8t/notice/noticeList`)

    const newData = res.data.data.map((item) => ({
      label: item.name,
      value: item.uuid
    }))


    // 将数据设置为选项对象数组
    setNoticeOptions(newData)

  }

  // 数据源单/多选标签
  const addLabel = () => {
    setNoticeLabels([...noticeLabels, { key: '', value: '', noticeId: '' }])
  }

  const updateLabel = (index, field, value) => {
    const updatedLabels = [...noticeLabels]
    updatedLabels[index][field] = value
    setNoticeLabels(updatedLabels)
  }

  const removeLabel = (index) => {
    const updatedLabels = [...noticeLabels]
    updatedLabels.splice(index, 1)
    setNoticeLabels(updatedLabels)
  }
  // --

  React.useEffect(() => {

    handleGetNoticeData()
    handleGetDatasourceData()

  }, [])

  // 在onChange事件处理函数中更新选择的通知对象值
  const handleSelectChange = (value) => {
  }

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      bodyStyle={{ overflowY: 'auto', maxHeight: '600px' }} // 设置最大高度并支持滚动
      width={800} // 设置Modal窗口宽度
    >
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

        <div>
          <strong style={{ fontSize: '20px' }}>基础配置</strong>
          <div style={{ display: 'flex' }}>
            <MyFormItem
              name="ruleName"
              label="规则名称"
              style={{
                marginRight: '10px',
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={type === 'update'} />
            </MyFormItem>

            <MyFormItem
              name="labels"
              label="附加标签"
              style={{
                width: '500px',
              }}
            >
              <Input />
            </MyFormItem>
          </div>

          <MyFormItem name="description" label="描述">
            <Input />
          </MyFormItem>
        </div>

        <Divider />

        <div>
          <strong style={{ fontSize: '20px' }}>规则配置</strong>

          <div style={{ display: 'flex' }}>

            <MyFormItem
              name="datasourceType"
              label="数据源类型"
              style={{
                marginRight: '10px',
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
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
                value={selectedType}
                onChange={handleGetDatasourceData}
              />
            </MyFormItem>

            <MyFormItem
              name="datasourceId"
              label="关联数据源"
              style={{
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}>
              <Select
                mode="multiple"
                placeholder="Inserted are removed"
                value={selectedItems}
                onChange={setSelectedItems}
                style={{
                  width: '100%',
                }}
                tokenSeparators={[',']}
                options={datasourceOptions}

              />
            </MyFormItem>

          </div>

          <MyFormItemGroup prefix={['ruleConfig']}>
            <MyFormItem name="promQL" label="PromQL">
              <Input />
            </MyFormItem>

            <MyFormItem name="severity" label="告警等级">
              <Radio.Group onChange={onChange} value={severityValue}>
                <Radio value={0}>P0级告警</Radio>
                <Radio value={1}>P1级告警</Radio>
                <Radio value={2}>P2级告警</Radio>
              </Radio.Group>
            </MyFormItem>


          </MyFormItemGroup>

          <div style={{ display: 'flex' }}>
            <MyFormItem
              name="evalInterval"
              label="执行频率"
              style={{
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                style={{ width: '97%' }}
                addonAfter={<span>秒</span>}
                placeholder="10"
              />
            </MyFormItem>

            <MyFormItem
              name="forDuration"
              label="持续时间"
              style={{
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter={<span>秒</span>}
                placeholder="60"
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
            </MyFormItem>
          </div>

          <MyFormItem name="annotations" label="告警事件">
            <Input />
          </MyFormItem>
        </div>

        <Divider />

        <div>
          <strong style={{ fontSize: '20px' }}>通知配置</strong>

          <div style={{ display: 'flex' }}>
            <MyFormItem
              name="noticeId"
              label="通知对象"
              tooltip="默认通知对象"
              style={{
                marginRight: '10px',
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                style={{
                  width: 370,
                }}
                allowClear
                value={selectedNotice} // 将选择的值与状态中的值进行绑定
                options={noticeOptions}
                onChange={handleSelectChange} // 使用onChange事件处理函数来捕获选择的值
              />
            </MyFormItem>

            <MyFormItem
              name="repeatNoticeInterval"
              label="重复通知"
              style={{
                width: '500px',
              }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter={<span>分钟</span>}
                placeholder="60"
              />
            </MyFormItem>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MyFormItem style={{ marginBottom: '0', marginRight: '10px' }}>
              <span>分组通知</span>
              <Tooltip title="根据 Metric 标签进行分组通知">
                <QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
              </Tooltip>
            </MyFormItem>
            <Button onClick={addLabel} style={{ marginTop: '0' }}>
              +
            </Button>
          </div>

          <MyFormItemGroup prefix={['noticeGroup']}>
            {noticeLabels.map((label, index) => (
              <div key={index} style={{ display: 'flex' }}>
                <MyFormItem
                  name={`[${index}].key`}
                  label="Key"
                  style={{ marginRight: '10px', width: '200px' }}
                >
                  <Input
                    value={label.key}
                    onChange={(e) => updateLabel(index, 'key', e.target.value)}
                  />
                </MyFormItem>

                <MyFormItem
                  name={`[${index}].value`}
                  label="Value"
                  style={{ marginRight: '10px', width: '200px' }}
                >
                  <Input
                    value={label.value}
                    onChange={(e) => updateLabel(index, 'value', e.target.value)}
                  />
                </MyFormItem>

                <MyFormItem
                  name={`[${index}].noticeId`}
                  label="通知对象"
                  style={{ marginRight: '10px', width: '500px' }}
                  rules={[{ message: '请选择通知对象' }]}
                >
                  <Select
                    style={{ width: 370 }}
                    allowClear
                    options={noticeOptions}
                    value={label.noticeId}
                    onChange={(e) => updateLabel(index, 'noticeId', e)}
                  />
                </MyFormItem>

                <MyFormItem>
                  {/* 删除标签按钮 */}
                  操作
                  <Button onClick={() => removeLabel(index)} style={{ marginTop: '5px' }}>
                    -
                  </Button>
                </MyFormItem>
              </div>
            ))}
          </MyFormItemGroup>

        </div>

        <MyFormItem
          name="enabled"
          label="状态"
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

export default AlertRuleCreateModal