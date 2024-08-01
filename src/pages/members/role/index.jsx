import { Input, Table, Button, Popconfirm, message } from 'antd'
import React from 'react'
import UserRoleCreateModal from './UserRoleCreateModal'
import { deleteRole, getRoleList } from '../../../api/role'
const { Search } = Input

class UserRole extends React.Component {

    state = {
        selectedRow: null,
        updateVisible: false,
        changeVisible: false,
        selectedUserId: null,
        visible: false,
        list: [],
        columns: [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
                width: 'auto',
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                width: 'auto',
                render: (text) => {
                    if (!text) {
                        return '-'
                    }
                    return text
                }
            },
            {
                title: '创建时间',
                dataIndex: 'create_at',
                key: 'create_at',
                width: 'auto',
                render: (text) => {
                    const date = new Date(text * 1000)
                    return date.toLocaleString()
                },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 150,
                render: (_, record) =>
                    this.state.list.length >= 1 ? (
                        <div>
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => this.handleDelete(_, record)}
                                disabled={record.name === 'admin'}>
                                <a style={{ cursor: record.name === 'admin' ? 'not-allowed' : 'pointer',
                                    color: record.name === 'admin' ? 'rgba(0, 0, 0, 0.25)' : '#1677ff'}}
                                >删除</a>
                            </Popconfirm>
                            <Button
                                disabled={record.name === 'admin'}
                                type="link" onClick={() => this.handleUpdateModalOpen(record)}>
                                更新
                            </Button>
                        </div>
                    ) : null,
            },
        ]
    }

    async componentDidMount() {
        this.handleList()
    }

    handleList = async () => {
        const res = await getRoleList()
        this.setState({
            list: res.data,
        })
    };

    handleDelete = async (_, record) => {
        const params = {
            "id": record.id
        }
        await deleteRole(params)
        this.handleList()
    };

    handleModalClose = () => {
        this.setState({ visible: false })
    };

    handleChanagePassModalClose = () => {
        this.setState({ changeVisible: false })
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

    render() {

        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={() => this.setState({ visible: true })}>
                        创建
                    </Button>
                </div>

                <UserRoleCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.handleList} />

                <UserRoleCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' handleList={this.handleList} />

                <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.list}
                        scroll={{
                            x: 1000,
                            y: 'calc(65vh - 65px - 40px)'
                        }}
                    />
                </div>
            </>
        )

    }

}

export default UserRole