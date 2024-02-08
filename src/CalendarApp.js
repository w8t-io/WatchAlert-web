import { Calendar, Modal, Divider, Button, DatePicker, Select, Space } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import CreateCalendar from './CreateCalendar'
import backendIP from './config'

export const fetchDutyData = async (dutyId) => {
  try {
    const response = await axios.get(
      `http://${backendIP}/api/w8t/calendar/calendarSearch?dutyId=${dutyId}`
    )
    const data = await response.data.data
    return data
  } catch (error) {
    console.error('Error fetching duty data:', error)
  }
}

// 函数组件
const CalendarApp = ({ visible, onClose, name, dutyId }) => {
  const [dutyData, setDutyData] = useState([])
  const [createCalendarModal, setCreateCalendarModal] = useState()

  useEffect(() => {
    async function fetchData () {
      if (visible) {
        try {
          const data = await fetchDutyData(dutyId)
          setDutyData(data)
        } catch (error) {
          console.error('Error:', error)
        }
      }
    }

    fetchData()
  }, [visible])

  const onPanelChange = (value, mode) => {
  }

  const dateCellRender = (value) => {
    const matchingDutyData = dutyData.find((item) => {
      const itemDate = new Date(item.time)
      return (
        itemDate.getFullYear() === value.year() &&
        itemDate.getMonth() === value.month() &&
        itemDate.getDate() === value.date()
      )
    })

    if (matchingDutyData) {
      return <div style={
        { marginTop: '20px', textAlign: 'center' }
      }>{matchingDutyData.username}</div>
    }

    return null
  }

  const handleModalClose = () => {
    setCreateCalendarModal(false)
  }


  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }} // 设置弹窗内容的样式
    >
      <div style={{ textAlign: 'center' }}>
        <h3>日程表名称：{name}</h3>
      </div>

      <Button onClick={() => setCreateCalendarModal(true)}>发布日程</Button>

      <div>
        <CreateCalendar visible={createCalendarModal} onClose={handleModalClose} dutyId={dutyId} />
      </div>

      <Divider />
      <div style={{ display: 'flex' }}>
        <Calendar onPanelChange={onPanelChange} dateCellRender={dateCellRender} />
      </div>

    </Modal>
  )
}

export default CalendarApp