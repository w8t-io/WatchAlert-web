import { Select, Input, Table, Button, Popconfirm, message, Tag } from 'antd'
import axios from 'axios'
import React from 'react'
import { CopyOutlined } from '@ant-design/icons'
import DutyManageCreateModal from './DutyManageCreateModal'
import CalendarApp from './CalendarApp'
import backendIP from './config'
import Base from './Base'
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
    axios.post(`http://${backendIP}/api/w8t/dutyManage/dutyManageDelete?id=${record.id}`)
      .then((res) => {
        if (res.status === 200) {
          message.success("删除成功")
          this.handleList()
        }
      })
      .catch(() => {
        message.error("删除失败")
      })
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
      <Base name='值班管理'>
        <div>
          <div style={{ display: 'flex' }}>

            <Button type="primary" onClick={() => this.setState({ visible: true })}>
              创建
            </Button>

            <DutyManageCreateModal visible={this.state.visible} onClose={this.handleModalClose} handleList={this.handleList} />

            <CalendarApp visible={this.state.calendarVisible} onClose={this.handleCalendarModalClose} name={this.state.calendarName} dutyId={this.state.calendarDutyId} handleList={this.handleList} />

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

          <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
            <Table
              columns={this.state.columns}
              dataSource={this.state.list}
              scroll={{
                x: 1500,
                y: 'calc(60vh - 64px - 40px)'
              }}
            />
          </div>
        </div>
      </Base>
    )

  }

}

export default DutyManage