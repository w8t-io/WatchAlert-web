import { Button, Input, Table, Space, Popconfirm, Dropdown, Tag } from 'antd'
import axios from 'axios'
import React from 'react'
import AlertRuleCreateModal from './AlertRuleCreateModal'
const { Search } = Input


class AlertRules extends React.Component {

  state = {
    visible: false,
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
        width: 100,
        render: (text, record) => (
          <span>
            {Object.entries(record.datasourceId).map(([key, value]) => (
              <Tag color="processing" key={key}>{`${value}`}</Tag>
            ))}
          </span>
        ),
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
  }


  async handleList () {

    const res = await axios.get("http://localhost:9001/api/v1/rule/ruleList")
    this.setState({
      list: res.data.data
    })

  }

  // 删除
  async handleDelete (_, record) {

    await axios.post(`http://localhost:9001/api/v1/rule/ruleDelete?id=${record.ruleId}`)
    this.handleList()

  }

  componentDidMount () {
    this.handleList()
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

    const onMenuClick = (e) => {
      console.log('click', e)
    }

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={() => this.setState({ visible: true })}>
            创建
          </Button>

          <AlertRuleCreateModal visible={this.state.visible} onClose={this.handleModalClose} />

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

export default AlertRules