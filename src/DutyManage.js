import { Select, Input, Table, Button, Popconfirm, Dropdown, Tag } from 'antd'
import axios from 'axios'
import React from 'react'
import DutyManageCreateModal from './DutyManageCreateModal'
import CalendarApp from './CalendarApp'
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
          <a
            style={{ cursor: 'pointer' }}
            onClick={() => this.setState({ selectedId: text, calendarVisible: true, calendarName: record.name, calendarDutyId: record.id })}
          >
            {text}
          </a>
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
                disabled={record.amount_type === 'admin'}>
                <a style={{ cursor: record.amount_type === 'admin' ? 'not-allowed' : 'pointer' }}>删除</a>
              </Popconfirm>
            </div>
          ) : null,
      },
    ]
  }


  async componentDidMount () {
    this.handleList()
  }

  handleList = async () => {
    const res = await axios.get("http://localhost:9001/api/v1/dutyManage/list")
    this.setState({
      list: res.data.data,
    })
  };

  handleDelete = async (_, record) => {
    await axios.post(`http://localhost:9001/api/v1/dutyManage/delete?id=${record.id}`)
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