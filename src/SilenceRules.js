import { Button, Input, Table, Select, Popconfirm, Dropdown, Flex } from 'antd'
import axios from 'axios'
import React from 'react'
import SilenceRuleCreateModal from './SilenceRuleCreateModal'
const { Search } = Input


class SilenceRules extends React.Component {

  state = {
    selectedRow: null,
    updateVisible: false,
    visible: false,
    list: [],
    // 表头
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 230,
      },
      {
        title: '告警指纹',
        dataIndex: 'fingerprint',
        key: 'fingerprint',
      },
      {
        title: '数据源类型',
        dataIndex: 'datasource_type',
        key: 'datasource_type',
      },
      {
        title: '创建人',
        dataIndex: 'create_by',
        key: 'create_by',
      },
      {
        title: '更新时间',
        dataIndex: 'update_at',
        key: 'update_at',
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
      {
        title: '评论',
        dataIndex: 'comment',
        key: 'comment',
      },
      {
        title: '静默开始时间',
        dataIndex: 'starts_at',
        key: 'starts_at',
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
      {
        title: '静默结束时间',
        dataIndex: 'ends_at',
        key: 'ends_at',
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_, record) =>
          this.state.list.length >= 1 ? (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(_, record)}>
                <a>删除</a>
              </Popconfirm>
              <Button type="link"
                onClick={() => this.handleUpdateModalOpen(record)}>
                更新
              </Button>
            </div>
          ) : null,
      },
    ]
  }

  // 获取所有数据
  async handleList () {

    const res = await axios.get("http://localhost:9001/api/v1/silence/silenceList")
    this.setState({
      list: res.data.data
    })

  }

  componentDidMount () {
    this.handleList()
  }

  // 删除
  async handleDelete (_, record) {

    await axios.post(`http://localhost:9001/api/v1/silence/silenceDelete?id=${record.id}`)
    this.handleList()

  }

  // 关闭窗口
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

    const onMenuClick = (e) => {
      console.log('click', e)
    }

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={() => this.setState({ visible: true })}>
            创建
          </Button>

          <SilenceRuleCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' />

          <SilenceRuleCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' />

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
                {
                  value: 'Ali-SLS',
                  label: 'Ali-SLS',
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
            <Dropdown.Button
              menu={{
                items,
                onClick: onMenuClick,
              }}>
              更多操作
            </Dropdown.Button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: 10 }}>
          <Table
            columns={this.state.columns}
            dataSource={this.state.list}
            scroll={{
              x: 1500,
              y: 500,
            }}
          />
        </div>

      </div>
    )

  }

}

export default SilenceRules