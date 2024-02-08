import { Select, Input, Table, Button, Popconfirm, Dropdown, Tag } from 'antd'
import axios from 'axios'
import React from 'react'
import { CopyOutlined } from '@ant-design/icons'
import DutyManageCreateModal from './DutyManageCreateModal'
import CalendarApp from './CalendarApp'
import backendIP from './config'
const { Search } = Input

class DutyManage extends React.Component {

  state = {
    calendarDutyId: "",
    calendarName: "",
    calendarVisible: false,
    selectedId: null,
    visible: false,
    list: [],
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        render: (text, record) => (
          <div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <a
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ selectedId: text, calendarVisible: true, calendarName: record.name, calendarDutyId: record.id })}
              >
                {text}
              </a>
              <CopyOutlined
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                onClick={() => this.handleCopy(text)}
              />
            </div>
          </div>

        ),
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 50,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: 50,
      },
      {
        title: '创建人',
        dataIndex: 'create_by',
        key: 'create_by',
        width: 50,
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
        key: 'create_at',
        width: 50,
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 50,
        render: (_, record) =>
          this.state.list.length >= 1 ? (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(_, record)}
                disabled={record.role === 'admin'}>
                <a style={{ cursor: record.role === 'admin' ? 'not-allowed' : 'pointer' }}>删除</a>
              </Popconfirm>
            </div>
          ) : null,
      },
    ]
  }

  handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  };

  async componentDidMount () {
    this.handleList()
  }

  handleList = async () => {
    const res = await axios.get(`http://${backendIP}/api/w8t/dutyManage/dutyManageList`)
    this.setState({
      list: res.data.data,
    })
  };

  handleDelete = async (_, record) => {
    await axios.post(`http://${backendIP}/api/w8t/dutyManage/dutyManageDelete?id=${record.id}`)
    this.handleList()
  };

  handleModalClose = () => {
    this.setState({ visible: false })
  };

  handleChanagePassModalClose = () => {
    this.setState({ changeVisible: false })
  };

  handleCalendarModalClose = (_, record) => {
    this.setState({ calendarVisible: false })
  }


  render () {

    const onSearch = (value, _e, info) => console.log(info?.source, value)

    return (
      <div>
        <div style={{ display: 'flex' }}>

          <Button type="primary" onClick={() => this.setState({ visible: true })}>
            创建
          </Button>

          <DutyManageCreateModal visible={this.state.visible} onClose={this.handleModalClose} />

          <CalendarApp visible={this.state.calendarVisible} onClose={this.handleCalendarModalClose} name={this.state.calendarName} dutyId={this.state.calendarDutyId} />

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: '1000px'
          }}>

            <Search
              allowClear
              placeholder="输入搜索关键字"
              onSearch={onSearch}
              enterButton
              style={{ width: 300 }} />
          </div>

        </div>

        <div style={{ overflowX: 'auto', marginTop: 10 }}>
          <Table
            columns={this.state.columns}
            dataSource={this.state.list}
          />
        </div>
      </div>
    )

  }

}

export default DutyManage