import React, { useState, useEffect } from 'react'
import { Button, Input, Table, Popconfirm, Dropdown, message } from 'antd'
import axios from 'axios'
import RuleTemplateCreateModal from './RuleTemplateCreateModal'
import backendIP from '../utils/config'
import Base from '../utils/Base'
import { useParams } from 'react-router-dom'

const { Search } = Input

const RuleTemplate = () => {
  const [selectedRow, setSelectedRow] = useState(null)
  const [viewVisible, setViewVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [list, setList] = useState([])
  const { ruleGroupName } = useParams()

  const columns = [
    {
      title: '模版名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 250,
      render: (text, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a
              style={{ cursor: 'pointer' }}
              onClick={() =>
                handleRuleNameClick(record)
              }>
              {text}
            </a>
          </div>
        </div>
      ),
    },
    {
      title: '数据源类型',
      dataIndex: 'datasourceType',
      key: 'datasourceType',
      width: 150,
    },
    {
      title: '告警事件详情',
      dataIndex: 'annotations',
      key: 'annotations',
      render: (text) => <div>{text.length > 50 ? `${text.slice(0, 50)}......` : text}</div>,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      fixed: 'right',
      render: (_, record) =>
        list.length >= 1 ? (
          <div>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(_, record)}>
              <a>删除</a>
            </Popconfirm>
          </div>
        ) : null,
    },
  ]

  useEffect(() => {
    handleList()
  }, [])

  const handleRuleNameClick = (record) => {
    setViewVisible(true)
    setSelectedRow(record)

  }

  const handleList = async () => {
    const res = await axios.get(`http://${backendIP}/api/w8t/ruleTmpl/ruleTmplList?ruleGroupName=${ruleGroupName}`)
    console.log(res)
    setList(res.data.data)
  }

  // 删除
  const handleDelete = async (_, record) => {
    try {
      const res = await axios.post(`http://${backendIP}/api/w8t/ruleTmpl/ruleTmplDelete?ruleName=${record.ruleName}`)
      if (res.status === 200) {
        message.success('删除成功')
        handleList()
      }
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleViewModalClose = () => {
    setViewVisible(false)
  }

  const handleViewModalOpen = (record) => {
    setViewVisible(true)
    setSelectedRow(record)
  }


  const handleModalClose = () => {
    setVisible(false)
  }

  const onSearch = (value, _e, info) => console.log(info?.source, value)

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Button type="primary" onClick={() => setVisible(true)}>
          创建
        </Button>

        <RuleTemplateCreateModal visible={visible} onClose={handleModalClose} type="create" handleList={handleList} ruleGroupName={ruleGroupName} />

        <RuleTemplateCreateModal visible={viewVisible} onClose={handleViewModalClose} selectedRow={selectedRow} type='view' handleList={handleList} ruleGroupName={ruleGroupName} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: '1000px',
          }}
        >
          <Search allowClear placeholder="输入搜索关键字" onSearch={onSearch} enterButton style={{ width: 300 }} />
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
        <Table
          columns={columns}
          dataSource={list}
          scroll={{
            x: 1000,
            y: 'calc(60vh - 64px - 40px)'
          }} />
      </div>
    </div>
  )
}

export default RuleTemplate