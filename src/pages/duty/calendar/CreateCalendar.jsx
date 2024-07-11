import React, { useState } from 'react'
import { Form, Modal, Divider, InputNumber, DatePicker, Select, Button, message } from 'antd'
import { getAllUsers } from '../../../api/other.jsx'
import { createCalendar } from '../../../api/duty'

export const CreateCalendarModal = ({ visible, onClose, dutyId }) => {
    const { Option } = Select
    const [form] = Form.useForm()
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [dutyPeriod, setDutyPeriod] = useState(1)
    const [filteredOptions, setFilteredOptions] = useState([])
    const [dateType, setDateType] = useState('day')

    const handleSelectChange = (_, value) => {
        setSelectedItems(value)
    }

    const onChangeDate = (date, dateString) => {
        setSelectedMonth(dateString)
    }

    const handleDutyPeriodChange = (value) => {
        setDutyPeriod(value)
    }

    const handleFormSubmit = async (data) => {
        try {
            await createCalendar(data)
        } catch (error) {
            console.error(error)
        }
        onClose()
    }

    const handleSearchDutyUser = async () => {
        try {
            const params = {
                "joinDuty": "true"
            }
            const res = await getAllUsers(params)
            const options = res.data.map((item) => ({
                username: item.username,
                userid: item.userid
            }))
            setFilteredOptions(options)
        } catch (error) {
            console.error(error)
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
                dateType: dateType,
                users: selectedItems.map((item) => ({ username: item.value, userid: item.userid })),
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
            styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' } }}
            centered
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
                        placeholder="1"
                        min={1}
                        onChange={handleDutyPeriodChange}
                        addonAfter={
                            <Select onChange={setDateType} value={dateType?dateType:'day'}>
                                <Option value="day">{'天'}</Option>
                                <Option value="week">{'周'}</Option>
                            </Select>
                        }
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
                        placeholder="请选择需要值班的人员"
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
            </Form>

            <Button type="primary" onClick={generateCalendar}>
                提交
            </Button>
        </Modal>
    )
}