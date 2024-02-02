import React, { useState } from 'react'
import axios from 'axios'
import { Form, Modal, Divider, InputNumber, DatePicker, Select, Button } from 'antd'

const CreateCalendar = ({ visible, onClose, dutyId }) => {
  const { Option } = Select
  const [form] = Form.useForm()
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [dutyPeriod, setDutyPeriod] = useState(1)
  const [filteredOptions, setFilteredOptions] = useState([])

  const handleSelectChange = (selectedValues) => {
    setSelectedItems(selectedValues)
  }

  const onChangeDate = (date, dateString) => {
    setSelectedMonth(dateString)
  }

  const handleDutyPeriodChange = (value) => {
    setDutyPeriod(value)
  }

  const handleFormSubmit = async (data) => {
    console.log(data)
    await axios.post("http://localhost:9001/api/v1/schedule/create", data)
    onClose()
  }

  const handleSearchDutyUser = async () => {
    try {
      const res = await axios.get("http://localhost:9001/api/v1/auth/searchDutyUser")
      const options = res.data.data.map((item) => ({ name: item.username, userid: item.userid }))
      setFilteredOptions(options)
      console.log(options)
    } catch (error) {
      console.error("Error fetching duty users:", error)
    }
  }


  const generateCalendar = () => {
    if (selectedMonth && dutyPeriod && selectedItems.length > 0) {
      const startDate = new Date(selectedMonth)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + (dutyPeriod * selectedItems.length) - 1)

      const calendarData = {
        dutyId: dutyId,
        month: selectedMonth,
        dutyPeriod: dutyPeriod,
        users: selectedItems.map((item) => ({ username: item })),
      }

      handleFormSubmit(calendarData)

      form.resetFields()

    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
    >
      <Divider />

      <Form>
        <Form.Item
          name="year-month"
          label="选择月份"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker onChange={onChangeDate} picker="month" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="dutyPeriod"
          label="每人持续"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            addonAfter={<span>天</span>}
            placeholder="1"
            min={1}
            onChange={handleDutyPeriodChange}
          />
        </Form.Item>

        <Form.Item
          name="dutyUser"
          label="值班人员"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Inserted are removed"
            value={selectedItems}
            onChange={handleSelectChange}
            onClick={handleSearchDutyUser}
            style={{
              width: '100%',
            }}
          >
            {filteredOptions.map((item) => (
              <Option key={item.name} value={item.userid}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <Button type="primary" onClick={generateCalendar}>
        Submit
      </Button>
    </Modal>
  )
}

export default CreateCalendar