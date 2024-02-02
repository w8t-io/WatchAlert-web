import { Select, Input, Table, Space, Popconfirm, Dropdown, Tag } from 'antd'
import axios from 'axios'
import React from 'react'
const { Search } = Input

class AlertHisEvent extends React.Component {

  state = {
    visible: false,
    list: [],
    columns: [
      {
        title: '规则名称',
        dataIndex: 'rule_name',
        key: 'rule_name',
        width: 100,
      },
      {
        title: '指纹',
        dataIndex: 'fingerprint',
        key: 'fingerprint',
        width: 150,
      },
      {
        title: '数据源',
        dataIndex: 'datasource_id',
        key: 'datasource_id',
        width: 250,
      },
      {
        title: '告警等级',
        dataIndex: 'severity',
        key: 'severity',
        width: 100,
      },
      {
        title: '事件标签',
        dataIndex: 'metric',
        key: 'metric',
        width: 150,
        render: (text, record) => (
          <span>
            {Object.entries(record.metric).map(([key, value]) => (
              <Tag color="processing" key={key}>{`${key}: ${value}`}</Tag>
            ))}
          </span>
        ),
      },
      {
        title: '事件详情',
        dataIndex: 'annotations',
        key: 'annotations',
      },
      {
        title: '触发时间',
        dataIndex: 'first_trigger_time',
        key: 'first_trigger_time',
        width: 180,
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
      {
        title: '恢复时间',
        dataIndex: 'recover_time',
        key: 'recover_time',
        width: 180,
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
    ]
  }


  async handleList () {

    const res = await axios.get("http://localhost:9001/api/v1/alert/hisEvent")
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

    return (
      <div>
        <div style={{ display: 'flex' }}>


          <Select
            placeholder="数据源类型"
            style={{
              flex: 1,
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

          <Select
            placeholder="告警等级"
            style={{
              flex: 1,
            }}
            allowClear
            options={[
              {
                value: '1',
                label: '一级告警',
              },
              {
                value: '2',
                label: '二级告警',
              },
              {
                value: '3',
                label: '三级告警',
              },
            ]}
          />

          <Search
            allowClear
            placeholder="input search text"
            onSearch={onSearch}
            enterButton />

        </div>

        <div style={{ overflowX: 'auto', marginTop: 10 }}>
          <Table
            columns={this.state.columns}
            dataSource={this.state.list}
            scroll={{
              x: 1500,
              y: 300,
            }}
          />
        </div>
      </div>
    )

  }

}

export default AlertHisEvent