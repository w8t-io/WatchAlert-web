import { Button, Input, Table, Space, Popconfirm, Dropdown, Flex } from 'antd'
import axios from 'axios'
import React from 'react'
const { Search } = Input


class AlertRules extends React.Component {

  state = {
    list: [],
    // 表头
    columns: [
      {
        title: 'ID',
        dataIndex: 'ruleId',
        key: 'ruleId',
      },
      {
        title: '规则名称',
        dataIndex: 'ruleName',
        key: 'ruleName',
      },
      {
        title: '数据源类型',
        dataIndex: 'datasourceType',
        key: 'datasourceType',
      },
      {
        title: '数据源',
        dataIndex: 'datasourceId',
        key: 'datasourceId',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
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
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(_, record)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ]
  }


  async fatchData () {

    const res = await axios.get("http://localhost:9001/api/v1/rule/ruleList")
    this.setState({
      list: res.data.data
    })

  }

  componentDidMount () {
    this.fatchData()
  }

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
          <Button type="primary">
            创建
          </Button>

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

        <Table dataSource={this.state.list} columns={this.state.columns} />
      </div>
    )

  }

}

export default AlertRules