import React, { useState, useEffect } from 'react';
import {Table, Button, Drawer, Tag, Tooltip, Input, Select} from 'antd';
import { CreateSilenceModal } from '../../silence/SilenceRuleCreateModal'
import { getCurEventList } from '../../../api/event';
import {getRuleList} from "../../../api/rule";

export const AlertCurEvent = () => {
    const { Search } = Input
    const [selectedRow, setSelectedRow] = useState(null);
    const [silenceVisible, setSilenceVisible] = useState(false);
    const [list, setList] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [annotations, setAnnotations] = useState('');
    const [selectedSeverity, setSelectedSeverity] = useState('');
    const [selectedDatasourceType, setSelectedDatasourceType] = useState('');
    const [selectedTimeScope,setSelectedTimeScope] = useState();
    const [searchQuery,setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        index: 1,
        size: 10,
        total: 0,
    });
    const columns = [
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
            dataIndex: 'datasourceId',
            key: 'datasourceId',
            width: 'auto',
            render: (text, record) => (
                <span>
                    <div>{record.datasource_id}</div>
                </span>
            ),
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
                <span>{showMoreTags([], record)}</span>
            ),
        },
        {
            title: '事件详情',
            dataIndex: 'annotations',
            key: 'annotations',
            width: 300,
            render: (text, record) => (
                <span>
                    {record.annotations && (
                        <span>
                            {record.annotations.substring(0, 100)}
                            <Button type="link" onClick={() => { showDrawer(record.annotations) }}>
                                详情
                            </Button>
                        </span>
                    )}
                </span>
            )
        },
        {
            title: '触发时间',
            dataIndex: 'first_trigger_time',
            key: 'first_trigger_time',
            width: 150,
            render: (text) => {
                const date = new Date(text * 1000)
                return date.toLocaleString()
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 100,
            render: (_, record) =>
                list.length >= 1 ? (
                    <div>
                        <Button type="link" onClick={() => handleSilenceModalOpen(record)}>静默</Button>
                    </div>
                ) : null,
        },
    ]

    const showDrawer = (record) => {
        setDrawerOpen(true);
        setAnnotations(record)
    };
    const onCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        handleList();
    }, [searchQuery,selectedTimeScope,selectedDatasourceType,selectedSeverity]);

    const showMoreTags = (tags, record, visibleCount = 5) => {
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
                <Tooltip title={<TagsList tags={hiddenTags} />} key="more-tags">
                    <Tag color="processing">+{hiddenTags.length} 所有</Tag>
                </Tooltip>,
            ];
        }
    };

    const TagsList = ({ tags }) => {
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

    const handleList = async () => {
        try {
            const params = {
                index: pagination.index,
                size: pagination.size,
                query: searchQuery,
                severity: selectedSeverity,
                datasourceType: selectedDatasourceType,
                scope: selectedTimeScope,
            }
            const res = await getCurEventList(params)

            if (res.data.list == null) {
                setList([]);
            }

            let sortedList = []
            if (res.data.list.length >= 1) {
                sortedList = res.data.list.sort((a, b) => b.first_trigger_time - a.first_trigger_time);
            } else {
                sortedList = res.data.list
            }

            setList(sortedList);

        } catch (error) {
            console.error(error)
        }
    };

    const handleSilenceModalClose = () => {
        setSilenceVisible(false);
    };

    const handleSilenceModalOpen = (record) => {
        setSelectedRow(record);
        setSilenceVisible(true);
    };

    const handleShowTotal = (total, range) =>
        `第 ${range[0]} - ${range[1]} 条 共 ${total} 条`;

    return (
        <div>
            <div style={{display: 'flex', gap: '10px'}}>
                <Search
                    allowClear
                    placeholder="输入搜索关键字"
                    onSearch={(record) => setSearchQuery(record)}
                    style={{width: 300}}
                />

                <Select
                    placeholder="告警等级"
                    allowClear
                    onChange={(record) => setSelectedSeverity(record)}
                    options={[
                        {
                            value: 'P0',
                            label: 'P0级告警',
                        },
                        {
                            value: 'P1',
                            label: 'P1级告警',
                        },
                        {
                            value: 'P2',
                            label: 'P2级告警',
                        },
                    ]}
                />

                <Select
                    style={{width: '20vh'}}
                    placeholder="数据源类型"
                    allowClear
                    onChange={(record) => setSelectedDatasourceType(record)}
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
                        },
                        {
                            value: 'Jaeger',
                            label: 'Jaeger',
                        },
                        {
                            value: 'CloudWatch',
                            label: 'CloudWatch',
                        },
                    ]}
                />

                <Select
                    allowClear
                    placeholder="时间范围"
                    options={[
                        {
                            value: '1',
                            label: '近 1 天',
                        },
                        {
                            value: '3',
                            label: '近 3 天'
                        },
                        {
                            value: '5',
                            label: '近 5 天'
                        },
                        {
                            value: '9',
                            label: '近 9 天'
                        },
                        {
                            value: '15',
                            label: '近 15 天'
                        },
                        {
                            value: '20',
                            label: '近 20 天'
                        },
                        {
                            value: '30',
                            label: '近 30 天'
                        },
                    ]}
                    onChange={(record) => { setSelectedTimeScope(record) }}
                />
            </div>

            <Drawer
                title="事件详情"
                onClose={onCloseDrawer}
                open={drawerOpen}
            >
                {annotations}
            </Drawer>

            <CreateSilenceModal visible={silenceVisible} onClose={handleSilenceModalClose} type="createForCurEvent"
                                selectedRow={selectedRow}/>

            <div style={{overflowX: 'auto', marginTop: 10, height: '67.5vh'}}>
                <Table
                    columns={columns}
                    dataSource={list}
                    pagination={{
                        current: pagination.current ?? 1,
                        pageSize: pagination.pageSize ?? 10,
                        total: pagination?.total ?? 0,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: handleShowTotal,
                    }}
                    scroll={{
                        x: 1500,
                        y: 'calc(67.5vh - 67.5px - 40px)'
                    }}
                />
            </div>
        </div>
    );
};
