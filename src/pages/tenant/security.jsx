import React, { useEffect, useState } from 'react'
import {Form, Switch} from "antd";
import {updateTenant} from "../../api/tenant";

const MyFormItemContext = React.createContext([])

function toArr(str) {
    return Array.isArray(str) ? str : [str]
}

// 表单
const MyFormItem = ({ name, ...props }) => {
    const prefixPath = React.useContext(MyFormItemContext)
    const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
    return <Form.Item name={concatName} {...props} />
}

export const TenantSecurity = ({tenantInfo})=>{
    const [form] = Form.useForm()
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        if (tenantInfo) {
            setEnabled(tenantInfo.removeProtection)
        }
    }, [tenantInfo, form])

    const handleSwitchChange = async (checked) => {
        setEnabled(checked);
        try {
            const params = {
                ...tenantInfo,
                removeProtection: checked,
            }

            await updateTenant(params)
        } catch (error) {
            console.error(error)
        }
    };

    return(
        <>
            <MyFormItem
                name="removeProtection"
                label="删除保护"
                tooltip="启用/禁用"
                valuePropName="checked"
            >
                <Switch checked={enabled} value={enabled} onChange={handleSwitchChange} />
            </MyFormItem>
        </>
    )
}