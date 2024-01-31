import { Button, Input, Table, Space, Popconfirm, Dropdown, Flex } from 'antd'
import axios from 'axios'
import React from 'react'
import SilenceRuleCreateModal from './SilenceRuleCreateModal'
const { Search } = Input


class SilenceRules extends React.Component {

  state = {
    visible: false,
    list: [],
    // 表头
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
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
      },
      {
        title: '评论',
        dataIndex: 'comment',
        key: 'comment',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
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
              <Button type="link">
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

          <SilenceRuleCreateModal visible={this.state.visible} onClose={this.handleModalClose} />

          <Search
            allowClear
            placeholder="input search text"
            onSearch={onSearch}
            enterButton />

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
          />
        </div>

      </div>
    )

  }

}

export default SilenceRules