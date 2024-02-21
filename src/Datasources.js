import { Button, Input, Table, Tag, Popconfirm, Dropdown, Select, message } from 'antd'
import axios from 'axios'
import React from 'react'
import DatasourceCreateModal from './DatasourceCreateModal'
import backendIP from './config'
const { Search } = Input

class Datasources extends React.Component {
  state = {
    selectedRow: null,
    updateVisible: false,
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
                type="link"
                onClick={() => this.handleUpdateModalOpen(record)}>
                更新
              </Button>
            </div>
          ) : null,
      },
    ]
  };

  fetchData = async () => {
    const { current, pageSize } = this.state.pagination
    const res = await axios.get(`http://${backendIP}/api/w8t/datasource/dataSourceList`, {
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
  }

  componentDidMount () {
    this.fetchData()
  }

  async handleDelete (_, record) {
    axios.post(`http://${backendIP}/api/w8t/datasource/dataSourceDelete?id=${record.id}`)
      .then((res) => {
        if (res.status === 200) {
          message.success("删除成功")
          this.fetchData()
        }
      })
      .catch(() => {
        message.error("删除失败")
      })
  }

  handleModalClose = () => {
    this.setState({ visible: false })
  };

  handleUpdateModalClose = () => {
    this.setState({ updateVisible: false })
  }

  handleUpdateModalOpen = (record) => {
    this.setState({
      selectedRow: record,
      updateVisible: true,
    })
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
    }

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={() => this.setState({ visible: true })}>
            创建
          </Button>

          <DatasourceCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.fetchData} />

          <DatasourceCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type="update" handleList={this.fetchData} />


          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: '1000px'
          }}>
            <Select
              placeholder="数据源类型"
              style={{
                // flex: 1,
                width: 150
              }}
              allowClear
              options={[
                {
                  value: 'Prometheus',
                  label: 'Prometheus',
                },
              ]}
            />

            <Select
              placeholder="状态"
              style={{
                // flex: 1,
                width: 150
              }}
              allowClear
              options={[
                {
                  value: 'true',
                  label: '启用',
                },
                {
                  value: 'false',
                  label: '禁用',
                },
              ]}
            />

            <Search
              allowClear
              placeholder="输入搜索关键字"
              onSearch={onSearch}
              enterButton
              style={{ width: 300 }} />
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Dropdown.Button menu={{ items, onClick: onMenuClick }}>更多操作</Dropdown.Button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
          <Table
            dataSource={this.state.list}
            columns={this.state.columns}
            pagination={this.state.pagination}
            scroll={{
              x: 1500,
              y: 'calc(60vh - 64px - 40px)'
            }}
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