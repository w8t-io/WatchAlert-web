import { Calendar, Modal, Divider, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { CreateCalendarModal } from './CreateCalendar';
import { UpdateCalendarModal } from './UpdateCalendar';
import { searchCalendar } from '../../../api/duty';

export const fetchDutyData = async (dutyId) => {
    try {
        const params = {
            dutyId: dutyId,
        }
        const res = await searchCalendar(params)
        const data = await res.data
        return data
    } catch (error) {
        console.error(error)
    }
}

export const CalendarApp = ({ visible, onClose, name, tenantId, dutyId }) => {
    const [dutyData, setDutyData] = useState([])
    const [createCalendarModal, setCreateCalendarModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const run = async (visible) => {
        if (visible) {
            try {
                const data = await fetchDutyData(dutyId)
                setDutyData(data)
            } catch (error) {
                console.error('Error:', error)
            }
        }
    }

    useEffect(() => {
        run(visible)
    }, [visible])

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
            return (
                <div
                    style={{ marginTop: '20px', textAlign: 'center', cursor: 'pointer' }}
                    onClick={handleClick}
                >
                    {matchingDutyData.username}
                </div>
            );
        }

        return null
    }

    const handleClick = (record) => {
        const m = record.month();
        const month = m + 1
        const year = record.year();

        setSelectedDate(`${year}-${month.toString()}-${record.date().toString()}`);
        setModalVisible(true);
    };

    const handleUpdateModalClose = () => {
        setModalVisible(false)
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
            style={{ marginTop: '-8vh' }}
            styles={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }} // 设置弹窗内容的样式
        >
            <div style={{ textAlign: 'center' }}>
                <h3>日程表名称：{name}</h3>
            </div>

            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '747px', width: '100%' }}>
                    <Button onClick={() => setCreateCalendarModal(true)}>
                        发布日程
                    </Button>
                </div>
                <CreateCalendarModal visible={createCalendarModal} onClose={handleModalClose} dutyId={dutyId} />
                <Divider />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Calendar
                        onChange={handleClick}
                        cellRender={dateCellRender}
                        fullscreen={true}
                    />
                </div>
            </div>



            <UpdateCalendarModal visible={modalVisible} onClose={handleUpdateModalClose} time={selectedDate} tenantId={tenantId} dutyId={dutyId} date={selectedDate} />

        </Modal>
    )
}