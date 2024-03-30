import React, { useState, useEffect } from 'react';
import { Select, Table, message, Tag, Space, DatePicker, Tooltip, Button, Drawer } from 'antd';
import dayjs from 'dayjs';
import { getHisEventList } from '../../../api/event';
const { RangePicker } = DatePicker

export const AlertHisEvent = () => {
    const [list, setList] = useState([]);
    const [selectedDataSource, setSelectedDataSource] = useState('');
    const [selectedSourceType, setSelectedSourceType] = useState('');
    const [selectedAlertLevel, setSelectedAlertLevel] = useState('');
    const [startTimestamp, setStartTimestamp] = useState(null)
    const [endTimestamp, setEndTimestamp] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [annotations, setAnnotations] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
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
            dataIndex: 'datasource_id',
            key: 'datasource_id',
            width: 'auto',
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
            width: 'auto',
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
            title: '恢复时间',
            dataIndex: 'recover_time',
            key: 'recover_time',
            width: 150,
            render: (text) => {
                const date = new Date(text * 1000)
                return date.toLocaleString()
            },
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
        handleList(pagination.current, pagination.pageSize);
    }, [selectedDataSource, selectedAlertLevel, startTimestamp, endTimestamp]);

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

    const handleList = async (pageIndex, pageSize) => {
        try {
            // 构建请求参数，仅包含非空字段
            const params = {
                datasourceType: selectedSourceType ? selectedSourceType : undefined, // 如果selectedSourceType为空，则不包含该字段
                severity: selectedAlertLevel ? selectedAlertLevel : undefined,
                startAt: startTimestamp ? startTimestamp : undefined,
                endAt: endTimestamp ? endTimestamp : undefined,
                pageIndex: pageIndex,
                pageSize: pageSize,
            };

            // 过滤掉undefined的属性
            const filteredParams = {};
            for (const key in params) {
                if (params[key] !== undefined) {
                    filteredParams[key] = params[key];
                }
            }

            const res = await getHisEventList(filteredParams)
            setPagination({
                ...pagination,
                current: res.data.PageIndex,
                total: res.data.TotalCount,
            });
            setList(res.data.List);
        } catch (error) {
            message.error(error);
        }
    };

    const handleDataSourceChange = (value) => {
        setSelectedSourceType(value)
        setSelectedDataSource(value);
    };

    const handleSeverityChange = (value) => {
        setSelectedAlertLevel(value)
    }

    // 时间选择器
    const onChange = (dates) => {
        if (dates && dates.length === 2) {
            onOk(dates);
        }
    }

    const onOk = (dates) => {
        if (dates && dates[0] && dates[1]) {
            const startTimestamp = dates[0].unix()
            const endTimestamp = dates[1].unix()
            setStartTimestamp(startTimestamp)
            setEndTimestamp(endTimestamp)
        }
    }

    const rangePresets = [
        {
            label: 'Last 1 Days',
            value: [dayjs().add(-1, 'd'), dayjs()],
        },
        {
            label: 'Last 3 Days',
            value: [dayjs().add(-3, 'd'), dayjs()],
        },
        {
            label: 'Last 5 Days',
            value: [dayjs().add(-5, 'd'), dayjs()],
        },
        {
            label: 'Last 7 Days',
            value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
            label: 'Last 14 Days',
            value: [dayjs().add(-14, 'd'), dayjs()],
        },
        {
            label: 'Last 30 Days',
            value: [dayjs().add(-30, 'd'), dayjs()],
        },
        {
            label: 'Last 90 Days',
            value: [dayjs().add(-90, 'd'), dayjs()],
        },
    ];

    const handlePageChange = (page) => {
        setPagination({ ...pagination, current: page.current, pageSize: page.pageSize });
        handleList(page.current, page.pageSize)
    };

    const handleShowTotal = (total, range) =>
        `第 ${range[0]} - ${range[1]} 条 共 ${total} 条`;

    return (
        <div>
            <Drawer
                title="事件详情"
                onClose={onCloseDrawer}
                open={drawerOpen}
            >
                {annotations}
            </Drawer>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                width: '1000px'
            }}>
                <Select
                    placeholder="数据源类型"
                    style={{
                        flex: 1,
                        width: 200
                    }}
                    allowClear
                    // value={selectedDataSource}
                    onChange={handleDataSourceChange}
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
                            value: 'Jaeger',
                            label: 'Jaeger',
                        },
                        {
                            value: 'Loki',
                            label: 'Loki',
                        },
                    ]}
                />

                <Select
                    placeholder="告警等级"
                    style={{
                        flex: 1,
                        width: 150
                    }}
                    allowClear
                    onChange={handleSeverityChange}
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

                <Space direction="vertical" style={{ width: '300vh' }}>
                    <RangePicker
                        showTime={{
                            format: 'HH:mm:ss',
                        }}
                        presets={[
                            {
                                label: <span aria-label="Current Time to End of Day">Now ~ EOD</span>,
                                value: () => [dayjs(), dayjs().endOf('day')],
                            },
                            ...rangePresets,
                        ]}
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={onChange}
                        onOk={onOk}
                    />
                </Space>

            </div>

            <div style={{ overflowX: 'auto', marginTop: 10, height: '64vh' }}>
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
                    onChange={handlePageChange}
                    scroll={{
                        x: 1700,
                        y: 'calc(64vh - 64px - 40px)'
                    }}
                />
            </div>
        </div>
    );
};