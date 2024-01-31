import { Button, Input, Table, Tag, Popconfirm, Dropdown } from 'antd'
import axios from 'axios'
import React from 'react'
import DatasourceCreateModal from './DatasourceCreateModal'
const { Search } = Input

class Datasources extends React.Component {
  state = {
    visible: false,
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '数据源类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
        render: enabled => (
          enabled ?
            <Tag color="success">启用</Tag> :
            <Tag color="error">禁用</Tag>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) =>
          this.state.list.length >= 1 ? (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(_, record)}>
                <a>删除</a>
              </Popconfirm>

              <Button
                type="link" >
                更新
              </Button>
            </div>
          ) : null,
      },
    ]
  };

  async fetchData () {
    const { current, pageSize } = this.state.pagination
    const res = await axios.get('http://localhost:9001/api/v1/alert/dataSourceList', {
      params: {
        page: current,
        size: pageSize,
      },
    })
    this.setState(prevState => ({
      list: res.data.data,
      pagination: {
        ...prevState.pagination,
        total: res.data.total,
      },
    }))
    console.log(res.data.data)
  }

  componentDidMount () {
    this.fetchData()
  }

  async handleDelete (_, record) {
    const res = await axios.post(`http://localhost:9001/api/v1/alert/dataSourceDelete?id=${record.id}`)
    this.fetchData()
  }

  handleModalClose = () => {
    this.setState({ visible: false })
  };

  render () {
    const onSearch = (value, _e, info) => console.log(info?.source, value)

    const items = [
      {
        key: '1',
        label: '批量删除',
      },
    ]

    const onMenuClick = e => {
      console.log('click', e)
    }

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={() => this.setState({ visible: true })}>
            创建
          </Button>

          <DatasourceCreateModal visible={this.state.visible} onClose={this.handleModalClose} />

          <Search allowClear placeholder="input search text" onSearch={onSearch} enterButton />

          <div style={{ marginLeft: 'auto' }}>
            <Dropdown.Button menu={{ items, onClick: onMenuClick }}>更多操作</Dropdown.Button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: 10 }}>
          <Table
            dataSource={this.state.list}
            columns={this.state.columns}
            pagination={this.state.pagination}
            onChange={pagination => {
              this.setState(
                prevState => ({
                  pagination: {
                    ...prevState.pagination,
                    current: pagination.current,
                  },
                }),
                () => {
                  this.fetchData()
                }
              )
            }}
          />
        </div>

      </div>
    )
  }
}

export default Datasources