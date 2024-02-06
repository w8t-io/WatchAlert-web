import { Input, Table, Button, Popconfirm } from 'antd'
import React from 'react'
import UserRoleCreateModal from './UserRoleCreateModal'
const { Search } = Input

class UserRole extends React.Component {

  state = {
    changeVisible: false,
    selectedUserId: null,
    visible: false,
    list: [],
    columns: [
      {
        title: 'ID',
        dataIndex: 'roleId',
        key: 'roleId',
        width: 50,
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
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
                onConfirm={() => this.handleDelete(_, record)}>
                <a style={{ cursor: record.role === 'admin' ? 'not-allowed' : 'pointer' }}>删除</a>
              </Popconfirm>
              <Button
                type="link" >
                更新
              </Button>
            </div>
          ) : null,
      },
    ]
  }


  async componentDidMount () {
    this.handleList()
  }

  handleList = async () => {
    // const res = await axios.get("http://localhost:9001/api/v1/auth/listUser")
    // this.setState({
    //   list: res.data.data,
    // })
  };

  handleDelete = async (_, record) => {
    // await axios.post(`http://localhost:9001/api/v1/auth/deleteUser?userid=${record.userid}`)
    this.handleList()
  };

  handleModalClose = () => {
    this.setState({ visible: false })
  };

  handleChanagePassModalClose = () => {
    this.setState({ changeVisible: false })
  };


  render () {

    const onSearch = (value, _e, info) => console.log(info?.source, value)

    return (
      <div>
        <div style={{ display: 'flex' }}>

          <Button type="primary" onClick={() => this.setState({ visible: true })}>
            创建
          </Button>

          <UserRoleCreateModal visible={this.state.visible} onClose={this.handleModalClose} />

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

export default UserRole