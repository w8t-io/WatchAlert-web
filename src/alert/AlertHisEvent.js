import { Select, Input, Table, Space, Tooltip, message, Tag } from 'antd'
import axios from 'axios'
import React from 'react'
import backendIP from '../utils/config'
import Base from '../utils/Base'
import { CopyOutlined } from '@ant-design/icons'

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
        width: 'auto',
      },
      {
        title: '指纹',
        dataIndex: 'fingerprint',
        key: 'fingerprint',
        width: 'auto',
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
        width: 300,
        render: (text, record) => (
          <span>{this.showMoreTags([], record)}</span>
        ),
      },
      {
        title: '事件详情',
        dataIndex: 'annotations',
        key: 'annotations',
        width: 300,
        render: (text, record) => (
          <span>
            {/* {record.annotations && record.annotations.substring(0, 100)}...... */}
            <span>
              {record.annotations && (
                <span>
                  {record.annotations.substring(0, 100)}......
                  <CopyOutlined
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      navigator.clipboard.writeText(record.annotations);
                      message.success('已复制到剪贴板');
                    }}
                  />
                </span>
              )}
            </span>
          </span>
        )
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


  async handleList() {

    const res = await axios.get(`http://${backendIP}/api/w8t/event/hisEvent`)
    console.log(res.data.data)
    this.setState({
      list: res.data.data
    })

  }

  componentDidMount() {
    this.handleList()
  }

  showMoreTags = (tags, record, visibleCount = 5) => {
    if (Object.entries(record.metric).length <= visibleCount) {
      // 如果标签数量小于或等于可见数量，直接显示所有标签
      return Object.entries(record.metric).map(([key, value]) => {
        // 截取value的前20个字符，并添加省略号如果value长度超过20
        const truncatedKey = key.length > 20 ? key.substring(0, 20) + '...' : key;
        const truncatedValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
        return (
          <Tag color="processing" key={key}>{`${truncatedKey}: ${truncatedValue}`}</Tag>
        );
      });
    } else {
      // 否则，显示指定数量的标签，并通过弹窗显示剩余标签
      const visibleTags = Object.entries(record.metric).slice(0, visibleCount);
      const hiddenTags = Object.entries(record.metric).slice(0);

      return [
        ...visibleTags.map(([key, value]) => {
          // 截取value的前20个字符，并添加省略号如果value长度超过20
          const truncatedKey = key.length > 20 ? key.substring(0, 20) + '...' : key;
          const truncatedValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
          return (
            <Tag color="processing" key={key}>{`${truncatedKey}: ${truncatedValue}`}</Tag>
          );
        }),
        <Tooltip title={<this.TagsList tags={hiddenTags} />} key="more-tags">
          <Tag color="processing">+{hiddenTags.length} 所有</Tag>
        </Tooltip>,
      ];
    }
  };

  TagsList = ({ tags }) => {
    const tagListStyle = {
      overflow: 'auto', // 如果内容超出视图区域，显示滚动条
      maxHeight: '50vh', // 可选：设置弹窗的最大高度
    };
    return (
      <div style={tagListStyle}>
        {tags.map(([key, value]) => (
          <Tag color="processing" key={key}>{`${key}: ${value}`}</Tag>
        ))}
      </div>
    );
  };

  handleModalClose = () => {
    this.setState({ visible: false })
  };


  render() {

    const onSearch = (value, _e, info) => console.log(info?.source, value)

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          width: '500px'
        }}>
          <Select
            placeholder="数据源类型"
            style={{
              flex: 1,
              width: 200
            }}
            allowClear
            options={[
              {
                value: 'Prometheus',
                label: 'Prometheus',
              },
              {
                value: 'AliCloudSLS',
                label: 'AliCloudSLS',
              },
              {
                value: 'Loki',
                label: 'Loki',
              }
            ]}
          />

          <Select
            placeholder="告警等级"
            style={{
              flex: 1,
              width: 150
            }}
            allowClear
            options={[
              {
                value: '0',
                label: 'P0级告警',
              },
              {
                value: '1',
                label: 'P1级告警',
              },
              {
                value: '2',
                label: 'P2级告警',
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

        <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
          <Table
            columns={this.state.columns}
            dataSource={this.state.list}
            scroll={{
              x: 1700,
              y: 'calc(65vh - 65px - 40px)'
            }}
          />
        </div>
      </div>
    )

  }

}

export default AlertHisEvent