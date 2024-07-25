import { Button, Input, Table, Popconfirm } from 'antd'
import React from 'react'
import NoticeTemplateCreateModal from './NoticeTemplateCreateModal'
import { getNoticeTmplList, deleteNoticeTmpl } from '../../../api/noticeTmpl'
import { searchNoticeTmpl } from '../../../api/noticeTmpl'
import { ReactComponent as FeiShuIcon } from '../img/feishu.svg'
import { ReactComponent as DingdingIcon } from '../img/dingding.svg'
import { ReactComponent as EmailIcon } from '../img/Email.svg'
const { Search } = Input

class NoticeTemplate extends React.Component {

    state = {
        selectedRow: null,
        updateVisible: false,
        visible: false,
        list: [],
        // 表头
        columns: [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width: 'auto',
            },
            {
                title: '模版类型',
                dataIndex: 'noticeType',
                key: 'noticeType',
                width: 'auto',
                render: (text, record) => {
                    if (record.noticeType === 'FeiShu') {
                        return (
                            <div style={{display: 'flex'}}>
                                <FeiShuIcon style={{height: '25px', width: '25px'}}/>
                                <div style={{marginLeft: "5px",marginTop: '5px', fontSize:'12px' }}>飞书</div>
                            </div>
                        )
                    } else if (record.noticeType === 'DingDing') {
                        return (
                            <div style={{display: 'flex'}}>
                                <DingdingIcon style={{height: '25px', width: '25px'}}/>
                                <div style={{marginLeft: "5px",marginTop: '5px', fontSize:'12px' }}>钉钉</div>
                            </div>
                        )
                    } else if (record.noticeType === 'Email') {
                        return (
                            <div style={{display: 'flex'}}>
                                <EmailIcon style={{height: '25px', width: '25px'}}/>
                                <div style={{marginLeft: "5px",marginTop: '5px', fontSize:'12px' }}>邮件</div>
                            </div>
                        )
                    }
                    return '-'
                },
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
                title: '操作',
                dataIndex: 'operation',
                width: 150,
                fixed: 'right',
                render: (_, record) =>
                    this.state.list.length >= 1 ? (
                        <div>
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => this.handleDelete(_, record)}>
                                <a>删除</a>
                            </Popconfirm>

                            <Button
                                type="link" onClick={() => this.handleUpdateModalOpen(record)}>
                                更新
                            </Button>
                        </div>
                    ) : null,
            },
        ]
    }

    handleUpdateModalClose = () => {
        this.setState({ updateVisible: false })
    }

    handleUpdateModalOpen = (record) => {
        this.setState({
            selectedRow: record,
            updateVisible: true,
        })
    };

    async handleDelete(_, record) {
        const params = {
            "id": record.id
        }
        await deleteNoticeTmpl(params)
        this.handleList()
    }

    handleList = async () => {
        const res = await getNoticeTmplList()
        this.setState({
            list: res.data
        })

    }

    handleModalClose = () => {
        this.setState({ visible: false })
    };

    componentDidMount() {
        this.handleList()
    }

    onSearch = async (value) => {
        try {
            const params = {
                query: value,
            }
            const res = await searchNoticeTmpl(params)
            this.setState({
                list: res.data,
            })
        } catch (error) {
            console.error(error)
        }
    }

    render() {

        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Search
                            allowClear
                            placeholder="输入搜索关键字"
                            onSearch={this.onSearch}
                            style={{ width: 300 }} />
                    </div>
                    <div>
                        <Button type="primary" onClick={() => this.setState({ visible: true })}>
                            创建
                        </Button>
                    </div>
                </div>

                <NoticeTemplateCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.handleList} />

                <NoticeTemplateCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' handleList={this.handleList} />

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

export default NoticeTemplate