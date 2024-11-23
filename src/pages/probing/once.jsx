import React, { useEffect, useState } from "react";
import {
    Alert,
    Tabs,
    Form,
    Input,
    Select,
    Button,
    Collapse,
    Table, Descriptions, Tag, Popconfirm, Progress, Spin,
} from "antd";
import Marquee from "react-fast-marquee";
import { ProbingOnce } from "../../api/probing";
import moment from "moment/moment";

const { Panel } = Collapse;

const MyFormItemContext = React.createContext([]);

const MyFormItem = ({ name, ...props }) => {
    const prefixPath = React.useContext(MyFormItemContext);
    const concatName = name !== undefined ? [...prefixPath, ...(Array.isArray(name) ? name : [name])] : undefined;
    return <Form.Item name={concatName} {...props} />;
};

export const OnceProbing = () => {
    const [probingType, setProbingType] = useState("HTTP");
    const [methodType, setMethodType] = useState("GET");
    const [responseData, setResponseData] = useState(null); // 存储响应数据
    const [form] = Form.useForm();
    const [loading,setLoading]=useState(false)

    const tabs = [
        { key: "1", label: "HTTP" },
        { key: "2", label: "ICMP" },
        { key: "3", label: "TCP" },
        { key: "4", label: "SSL" },
    ];

    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleChangeProbingType = (key) => {
        const types = { 1: "HTTP", 2: "ICMP", 3: "TCP", 4: "SSL" };
        setProbingType(types[key]);
    };

    const validateInput = (_, value) => {
        const urlPattern = /^(https?:\/\/)/; // HTTP(S) URL 校验
        const domainIpPattern = /^(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})$/; // 域名或IP校验
        const tcpPattern = /^(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}):\d+$/; // TCP: IP/域名:port
        const domainPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/; // 仅域名校验（SSL）
        if (probingType === "HTTP" && !urlPattern.test(value)) {
            return Promise.reject("请输入有效的 http(s)://URL");
        }
        if (probingType === "ICMP" && !domainIpPattern.test(value)) {
            return Promise.reject("请输入有效的 域名或IP");
        }
        if (probingType === "TCP" && !tcpPattern.test(value)) {
            return Promise.reject("请输入有效的 IP/域名:port");
        }
        if (probingType === "SSL" && !domainPattern.test(value)) {
            return Promise.reject("请输入有效的 域名");
        }
        return Promise.resolve();
    };

    const validateJson = (_, value) => {
        if (value && !isValidJson(value)) {
            return Promise.reject('请输入有效的 JSON 格式');
        }
        return Promise.resolve();
    };

    const isValidJson = (str) => {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    };


    const handleSubmit = async () => {
        const values = await form.validateFields();
        const params = {
            ruleType: probingType,
            probingEndpointConfig: {
                endpoint: values.endpoint,
                strategy: {
                    timeout: parseInt(values.timeout, 10),
                },
                http: {
                    method: methodType,
                },
                icmp: {
                    interval: parseInt(values.interval, 10),
                    count: parseInt(values.count, 10),
                },
            },
        };

        try {
            setLoading(true)
            const res = await ProbingOnce(params);
            setLoading(false)
            // 假设返回的 res 是数组格式
            setResponseData(res.data);
        } catch (error) {
            console.error("请求失败:", error);
        }
    };

    const HTTPColumns = [
        {
            title: '端点',
            key: 'endpoint',
            width: 'auto',
            render: () => (
                <div>
                    {responseData.address || '-'}
                </div>
            ),
        },
        {
            title: '状态码',
            key: 'statusCode',
            width: 'auto',
            render: () => {
                const statusCode = responseData.StatusCode;
                const isSuccess = statusCode >= 200 && statusCode < 300;

                return (
                    <span style={{
                        color: isSuccess ? 'green' : 'red',
                        fontWeight: 'bold',
                    }}>
                {statusCode || '-'}
            </span>
                );
            },
        },
        {
            title: '响应延迟',
            key: 'latency',
            width: 'auto',
            render: () => (
                <>
                    {responseData.Latency && responseData.Latency+"ms" || '-'}
                </>
            ),
        },
    ]
    const ICMPColumns = [
        {
            title: '端点',
            key: 'endpoint',
            width: 'auto',
            render: () => (
                <div>
                    {responseData.address || '-'}
                </div>
            ),
        },
        {
            title: '丢包率',
            key: 'packetLoss',
            width: 'auto',
            render: () => {
                const packetLoss = responseData.PacketLoss;

                // 根据丢包率设置Tag样式和文本
                if (packetLoss === undefined || packetLoss === null || packetLoss === "") {
                    return <Tag color="gray">未知</Tag>;
                }

                return (
                    <Tag color={packetLoss < 80 ? 'green' : 'red'}>
                        {`${packetLoss}%`}
                    </Tag>
                );
            },
        },
        {
            title: '最短 RT',
            key: 'minRtt',
            width: 'auto',
            render: () => (
                <>
                    {responseData.MinRtt && responseData.MinRtt+"ms" || '-'}
                </>
            ),
        },
        {
            title: '最长 RTT',
            key: 'maxRtt',
            width: 'auto',
            render: () => (
                <>
                    {responseData.MaxRtt && responseData.MaxRtt+"ms" || '-'}
                </>
            ),
        },
        {
            title: '平均 RTT',
            key: 'avgRtt',
            width: 'auto',
            render: () => (
                <>
                    {responseData.AvgRtt && responseData.AvgRtt+"ms" || '-'}
                </>
            ),
        },
    ]
    const TCPColumns = [
        {
            title: '端点',
            key: 'endpoint',
            width: 'auto',
            render: (record) => (
                <div>
                    {responseData.address || '-'}
                </div>
            ),
        },
        {
            title: '探测状态',
            key: 'isSuccessful',
            width: 'auto',
            render: (record) => {
                const status = responseData.IsSuccessful;
                // 根据状态值设置标签样式和文本
                const statusTag = status === true
                    ? <Tag color="green">成功</Tag>
                    : status === false
                        ? <Tag color="red">失败</Tag>
                        : <Tag color="gray">未知</Tag>;

                return statusTag;
            },
        },
        {
            title: '错误信息',
            key: 'errorMessage',
            width: 'auto',
            render: (record) => (
                <>
                    {responseData.ErrorMessage || '-'}
                </>
            ),
        },
    ]
    const SSLColumns = [
        {
            title: '端点',
            key: 'endpoint',
            width: 'auto',
            render: (record) => (
                <div>
                    {responseData.address || '-'}
                </div>
            ),
        },
        {
            title: '签发时间',
            key: 'startTime',
            width: 'auto',
            render: (record) => (
                <>
                    {responseData.StartTime || '-'}
                </>
            ),
        },
        {
            title: '结束时间',
            key: 'expireTime',
            width: 'auto',
            render: (record) => (
                <>
                    {responseData.ExpireTime || '-'}
                </>
            ),
        },
        {
            title: '有效时间',
            key: 'timeProgress',
            width: 'auto',
            render: (record) => {
                const startTime = responseData.StartTime;
                const endTime = responseData.ExpireTime;

                if (!startTime || !endTime) {
                    return '-'; // 数据不足时显示占位符
                }

                const totalDays = moment(endTime).diff(moment(startTime), 'days');
                const remainingDays = moment(endTime).diff(moment(), 'days');
                const progress = Math.max(0, Math.min(100, (remainingDays / totalDays) * 100)); // 进度百分比

                return (
                    <div>
                        <Progress
                            percent={progress.toFixed(2)}
                            status={progress > 20 ? 'active' : 'exception'}
                            strokeColor={progress > 20 ? '#52c41a' : '#ff4d4f'}
                            showInfo={false} // 隐藏默认信息
                        />
                        <div style={{textAlign: 'center', fontSize: 12}}>
                            剩余 {remainingDays > 0 ? remainingDays : 0} 天 / 总共 {totalDays} 天
                        </div>
                    </div>
                );
            }
        },
        {
            title: '响应延迟',
            key: 'avgRtt',
            width: 'auto',
            render: (record) => (
                <>
                    {responseData.ResponseTime + "ms" || '-'}
                </>
            ),
        },
    ]
    const cols = {"HTTP": HTTPColumns, "ICMP": ICMPColumns, "TCP": TCPColumns, "SSL": SSLColumns}
    const defaultValues = {
        timeout: 5, // 超时时间默认值
        count: 10, // 请求包数量默认值
        interval: 1, // 请求间隔默认值
    };
    const message = {
        "HTTP": "请输入端点，如：https://github.com",
        "ICMP": "请输入端点，如：127.0.0.1 / github.com",
        "TCP": "请输入端点，如：127.0.0.1:80",
        "SSL": "请输入端点，如：github.com"
    }

    return (
        <Spin spinning={loading} tip="加载中...">
            <div style={{ marginTop: "-15px" }}>
                <Alert
                    banner
                    type="info"
                    message={
                        <Marquee pauseOnHover gradient={false}>
                            模拟真实用户从不同网络条件访问在线服务，持续对网络质量、网站性能、文件传输等场景进行可用性监测和性能监测。
                        </Marquee>
                    }
                />
                <Tabs defaultActiveKey="1" items={tabs} onChange={handleChangeProbingType} />
            </div>
            <div
                style={{
                    textAlign: "left",
                    marginTop: "-15px",
                    maxHeight: height - 300,
                    overflow: "auto",
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: "10px" }}
                    initialValues={defaultValues}
                >
                    <MyFormItem
                        name="endpoint"
                        label=""
                        rules={[
                            { required: true, message: message[probingType] },
                            { validator: validateInput },
                        ]}
                    >
                        <Input
                            addonBefore={
                                probingType === "HTTP" ? (
                                    <Select
                                        value={methodType}
                                        options={[
                                            { value: "GET", label: "GET" },
                                            { value: "POST", label: "POST" },
                                        ]}
                                        onChange={setMethodType}
                                    />
                                ) : null
                            }
                            placeholder={message[probingType]}
                            addonAfter={
                                <Button
                                    type="link"
                                    onClick={handleSubmit}
                                    style={{
                                        borderLeft: "none",
                                        borderTopRightRadius: "0px",
                                        borderBottomRightRadius: "0px",
                                        height: "100%",
                                        fontSize: "13px",
                                    }}
                                >
                                    拨测一下 ➡️
                                </Button>
                            }
                            style={{
                                borderTopRightRadius: "0px",
                                borderBottomRightRadius: "0px",
                            }}
                        />
                    </MyFormItem>

                    <Collapse style={{ marginTop: "10px" }}>
                        <Panel header="高级选项" key="1">
                            <MyFormItem name="timeout" label="超时时间 (秒)">
                                <Input type="number" placeholder="请输入超时时间" />
                            </MyFormItem>
                            {(probingType === "HTTP") && (
                                <MyFormItem
                                    name="headers"
                                    label="请求头"
                                    rules={[{ validator: validateJson }]}
                                >
                                    <Input.TextArea
                                        placeholder='请输入请求头，格式为 JSON，例如 {"Authorization": "Bearer token"}'
                                        rows={3}
                                    />
                                </MyFormItem>
                            )}
                            {(probingType === "HTTP" && methodType === "POST") && (
                                <MyFormItem
                                    name="body"
                                    label="请求体"
                                    rules={[{ validator: validateJson }]}
                                >
                                    <Input.TextArea
                                        placeholder='请输入请求体，格式为 JSON，例如 {"key": "value"}'
                                        rows={5}
                                    />
                                </MyFormItem>
                            )}
                            {probingType === "ICMP" && (
                                <div>
                                    <MyFormItem name="count" label="请求包数量">
                                        <Input type="number" min={1} placeholder="请输入请求包数量"/>
                                    </MyFormItem>
                                    <MyFormItem name="interval" label="请求间隔">
                                        <Input type="number" min={1} placeholder="请输入请求间隔时间"/>
                                    </MyFormItem>
                                </div>
                            )}
                        </Panel>
                    </Collapse>

                    {responseData && (
                        <div style={{ marginTop: "20px" }}>
                            <Table
                                columns={cols[probingType]}
                                dataSource={[responseData]}
                                pagination={false}
                                bordered
                                showHeader={true}
                                rowKey="key"
                                size="small"
                            />
                        </div>
                    )}

                </Form>
            </div>
        </Spin>
    );
};
