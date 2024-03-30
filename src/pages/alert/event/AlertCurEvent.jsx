import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Tag, Tooltip } from 'antd';
import { CreateSilenceModal } from '../../silence/SilenceRuleCreateModal'
import { getCurEventList } from '../../../api/event';

export const AlertCurEvent = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [silenceVisible, setSilenceVisible] = useState(false);
    const [list, setList] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [annotations, setAnnotations] = useState('');
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
    }, []);

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
            const res = await getCurEventList()
            let sortedList = []
            if (res.data.length >= 1) {
                sortedList = res.data.sort((a, b) => b.first_trigger_time - a.first_trigger_time);
            } else {
                sortedList = res.data
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

    return (
        <div>
            <Drawer
                title="事件详情"
                onClose={onCloseDrawer}
                open={drawerOpen}
            >
                {annotations}
            </Drawer>

            <CreateSilenceModal visible={silenceVisible} onClose={handleSilenceModalClose} type="createForCurEvent" selectedRow={selectedRow} />

            <div style={{ overflowX: 'auto', marginTop: 10, height: '67.5vh' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    scroll={{
                        x: 1500,
                        y: 'calc(67.5vh - 67.5px - 40px)'
                    }}
                />
            </div>
        </div>
    );
};
