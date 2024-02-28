import { Modal, Form, Button, message, Select, Tooltip } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import backendIP from './config'
const { Option } = Select


const CalendarAppUpdateModal = ({ visible, onClose, time, dutyId, date }) => {
  const [selectedItems, setSelectedItems] = useState([])
  const [filteredOptions, setFilteredOptions] = useState([])

  const handleSelectChange = (_, value) => {
    setSelectedItems(value)
  }

  const handleSearchDutyUser = async () => {
    try {
      const res = await axios.get(`http://${backendIP}/api/w8t/user/searchDutyUser`)
      const options = res.data.data.map((item) => ({
        username: item.username,
        userid: item.userid
      }))
      setFilteredOptions(options)
    } catch (error) {
      console.error("Error fetching duty users:", error)
    }
  }

  const handleUpdate = async (data) => {
    axios.post(`http://${backendIP}/api/w8t/calendar/calendarUpdate`, data)
      .then((res) => {
        if (res.status === 200) {
          message.success("更新成功")
        }
      })
      .catch(() => {
        message.error("更新失败")
      })
  }

  const handleFormSubmit = async () => {

    const calendarData = {
      dutyId: dutyId,
      time: date,
      userid: selectedItems.userid,
      username: selectedItems.value,
    }

    console.log(calendarData)
    await handleUpdate(calendarData)

    // 关闭弹窗
    onClose()

  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null} style={{ marginTop: '20vh' }}>

      <div>
        调整值班人员, 当前值班日期: {time}
      </div>

      <Form.Item
        name="dutyUser"
        label="值班人员"
        rules={[
          {
            required: true,
          },
        ]}
        style={{ marginTop: '20px' }}
      >
        <Select
          showSearch
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={handleSelectChange}
          onClick={handleSearchDutyUser}
          style={{
            width: '100%',
          }}
        >
          {filteredOptions.map((item) => (
            <Option key={item.username} value={item.username} userid={item.userid}>
              {item.username}
            </Option>
          ))}
        </Select>

      </Form.Item>

      <Button type="primary" htmlType="submit" onClick={handleFormSubmit}>
        Submit
      </Button>

    </Modal>
  )
}

export default CalendarAppUpdateModal