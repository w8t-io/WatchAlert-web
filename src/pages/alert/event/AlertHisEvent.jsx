import React, { useState, useEffect } from 'react';
import {Select, Table, message, Tag, Space, DatePicker, Tooltip, Button, Drawer, Input, Row, Col} from 'antd';
import dayjs from 'dayjs';
import { getHisEventList } from '../../../api/event';
import {getDatasourceList} from "../../../api/datasource";
import { ReactComponent as P0 } from "./img/P0.svg"
import { ReactComponent as P1 } from "./img/P1.svg"
import { ReactComponent as P2 } from "./img/P2.svg"
const { RangePicker } = DatePicker

export const AlertHisEvent = () => {
    const { Search } = Input
    const [list, setList] = useState([]);
    const [selectedSourceType, setSelectedSourceType] = useState('');
    const [selectedAlertLevel, setSelectedAlertLevel] = useState('');
    const [startTimestamp, setStartTimestamp] = useState(null)
    const [endTimestamp, setEndTimestamp] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [annotations, setAnnotations] = useState('');
    const [searchQuery,setSearchQuery] = useState('');
    const [datasourceList,setDatasourceList] = useState([])
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
            render: (text, record) => (
                <span>
                    {getDatasourceNamesById(record.datasource_id).split(', ').map((name, index) => (
                        <Tag color="processing" key={index}>{name}</Tag>
                    ))}
                </span>
            ),
        },
        {
            title: '告警等级',
            dataIndex: 'severity',
            key: 'severity',
            width: 100,
            render: (text) => {
                return (
                    <div style={{display: 'flex'}}>
                        {text === "P0" && (
                            <P0 style={{ height: "25px", width: "25px" }} />
                        )}
                        {text === "P1" && (
                            <P1 style={{ height: "25px", width: "25px" }} />
                        )}
                        {text === "P2" && (
                            <P2 style={{ height: "25px", width: "25px" }} />
                        )}
                        <div style={{marginLeft: "5px", marginTop: '3px',fontSize :'12px'}}>{text}</div>
                    </div>
                )
            },
        },
        {
            title: '事件标签',
            dataIndex: 'metric',
            key: 'metric',
            width: 300,
            render: (text, record) => (
                <>
                    {record && (
                        <span>{showMoreTags([], record)}</span>
                    )}
                </>
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
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        handleListDatasource()
        // 定义一个处理窗口大小变化的函数
        const handleResize = () => {
            setHeight(window.innerHeight);
        };

        // 监听窗口的resize事件
        window.addEventListener('resize', handleResize);

        // 在组件卸载时移除监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const showDrawer = (record) => {
        setDrawerOpen(true);
        setAnnotations(record)
    };
    const onCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        handleList(pagination.current, pagination.pageSize);
    }, [searchQuery, selectedSourceType, selectedAlertLevel, startTimestamp, endTimestamp]);

    const showMoreTags = (tags, record, visibleCount = 5) => {
        if (record && Object?.entries(record?.metric).length <= visibleCount) {
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
                query: searchQuery,
                index: pageIndex,
                size: pageSize,
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
                current: res.data.index,
                total: res.data.total,
            });
            setList(res.data.list);
        } catch (error) {
            message.error(error);
        }
    };

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

    const handleListDatasource = async () => {
        try {
            const res = await getDatasourceList()
            setDatasourceList(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const getDatasourceNamesById = (datasourceId) => {
        const datasource = datasourceList.find(ds => ds.id === datasourceId);
        return datasource ? datasource.name : 'Unknown';
    };

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
                width: '100vh'
            }}>
                <Search
                    allowClear
                    placeholder="输入搜索关键字"
                    onSearch={(record) => setSearchQuery(record)}
                    style={{width: 335}}
                />

                <Select
                    placeholder="告警等级"
                    allowClear
                    onChange={(record) => setSelectedAlertLevel(record)}
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
                    onChange={(record) => setSelectedSourceType(record)}
                    options={[
                        {
                            value: 'Prometheus',
                            label: 'Prometheus',
                        },
                        {
                            value: 'VictoriaMetrics',
                            label: 'VictoriaMetrics',
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
                        {
                            value: 'KubernetesEvent',
                            label: 'KubernetesEvent',
                        },
                        {
                            value: 'ElasticSearch',
                            label: 'ElasticSearch',
                        },
                    ]}
                />

                <Space direction="vertical">
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

            <div style={{ overflowX: 'auto', marginTop: 10 }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    pagination={{
                        current: pagination.current ?? 1,
                        pageSize: pagination.pageSize ?? 10,
                        total: pagination.total ?? 0,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: handleShowTotal,
                    }}
                    onChange={handlePageChange}
                    scroll={{
                        y: height-400
                    }}
                />
            </div>
        </div>
    );
};