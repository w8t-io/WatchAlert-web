import { Button, Input, Table, Popconfirm } from 'antd'
import React from 'react'
import RuleTemplateGroupCreateModal from './RuleTemplateGroupCreateModal'
import { Link } from 'react-router-dom'
import { deleteRuleTmplGroup, getRuleTmplGroupList } from '../../../api/ruleTmpl'

const { Search } = Input

class RuleTemplateGroup extends React.Component {

    state = {
        selectedRow: null,
        updateVisible: false,
        visible: false,
        list: [],
        // 表头
        columns: [
            {
                title: '模版组名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Link to={`/ruleTemplateGroup/${record.name}/templates`}>{text}</Link>
                        </div>
                    </div>
                ),
            },
            {
                title: '模版数',
                dataIndex: 'number',
                key: 'number',
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: (text) => {
                    if (!text) {
                        return '-'
                    }
                    return text
                }
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
                        </div>
                    ) : null,
            },
        ]
    }

    handleList = async () => {
        const res = await getRuleTmplGroupList()
        this.setState({
            list: res.data
        })
    }

    async handleDelete(_, record) {
        const params = {
            name: record.name
        }
        await deleteRuleTmplGroup(params)
        this.handleList()
    }

    componentDidMount() {
        this.handleList()
    }


    handleModalClose = () => {
        this.setState({ visible: false })
    }

    handleUpdateModalClose = () => {
        this.setState({ updateVisible: false })
    }

    handleUpdateModalOpen = (record) => {
        this.setState({
            selectedRow: record,
            updateVisible: true,
        })
    }

    render() {

        const onSearch = (value, _e, info) => console.log(info?.source, value)

        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Search
                            allowClear
                            placeholder="输入搜索关键字"
                            onSearch={onSearch}
                            style={{ width: 300 }}
                        />
                    </div>
                    <div>
                        <Button type="primary" onClick={() => this.setState({ visible: true })}>
                            创建
                        </Button>
                    </div>
                </div>

                <div >
                    <RuleTemplateGroupCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.handleList} />

                    <RuleTemplateGroupCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' handleList={this.handleList} />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        width: '1000px'
                    }}>
                    </div>
                </div>

                <div style={{ overflowX: 'auto', marginTop: 10 }}>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.list}
                    />
                </div>
            </>
        )

    }

}

export default RuleTemplateGroup