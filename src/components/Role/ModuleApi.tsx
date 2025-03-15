import { IPermission } from "@/pages/Permission";
import { Card, Collapse, Form, FormInstance, Switch, Tag, Tooltip, Typography } from "antd";

interface IProp {
    form: FormInstance<any>;
    listPermissions: {
        module: string;
        permissions: IPermission[]
    }[] | null
}
const { Panel } = Collapse;
const { Paragraph, Text } = Typography
const ModuleApi = (props: IProp) => {
    const { form, listPermissions } = props;

    const colorMethod = (value: string) => {
        switch (value) {
            case "GET":
                return "green";
            case "POST":
                return "gold";
            case "PATCH":
                return "purple";
            case "DELETE":
                return "red";
            default:
                return ""
        }
    }

    const handleSwitchAll = (value: boolean, name: string) => {
        const child = listPermissions?.find(item => item.module === name);
        if (child) {
            child.permissions.forEach(item => {
                if (item._id)
                    form.setFieldValue(["permissions", item._id], value);
            })
        }
    }

    const handleSingleCheck = (value: boolean, child: string, parent: string) => {
        form.setFieldValue(["permissions", child], value);

        // check all
        const temp = listPermissions?.find(item => item.module === parent);
        if (temp) {
            const restPermission = temp?.permissions?.filter(item => item._id !== child);
            console.log(restPermission);
            if (restPermission && restPermission.length) {
                const allTrue = restPermission.every(item => form.getFieldValue(["permissions", item._id as string]));
                form.setFieldValue(["permissions", parent], allTrue && value);
            }
        }
    }
    return (
        <Collapse>
            {
                listPermissions?.map((item, index) => (
                    <Panel
                        key={index}
                        forceRender
                        header={<div>{item.module}</div>}
                        extra={<>
                            <Form.Item
                                className="mb-0"
                                name={["permissions", item.module]}
                            >
                                <Switch
                                    onClick={(u, e) => { e.stopPropagation() }}
                                    onChange={(val) => handleSwitchAll(val, item.module)}
                                />
                            </Form.Item>
                        </>}
                    >
                        <div className="row">
                            {
                                item.permissions.map((value, index: number) => (
                                    <div className="col-6" key={index}>
                                        <Card
                                            size="small"
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <Tooltip title={value?.title}>
                                                        <Paragraph className="mb-0">
                                                            {value.title}
                                                        </Paragraph>
                                                        <div className="d-flex">
                                                            <Tag
                                                                className="fw-bold me-2"
                                                                color={colorMethod(value.method)}
                                                            >
                                                                {value.method}
                                                            </Tag>
                                                            <Text ellipsis>{value.apiPath}</Text>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                <div>
                                                    <Form.Item
                                                        className="mb-0"
                                                        name={["permissions", value._id as string]}
                                                        initialValue={false}
                                                    >
                                                        <Switch
                                                            onChange={(val) =>
                                                                handleSingleCheck(val, value._id, item.module)}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            }
                        </div>
                    </Panel>
                ))
            }
        </Collapse>
    )
}

export default ModuleApi