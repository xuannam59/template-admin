import { IRole } from "@/pages/Role";
import { Card, Checkbox, Form, Input, message, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import ModuleApi from "./ModuleApi";
import handleAPI from "@/apis/handleAPI";
import _ from 'lodash';
import { IPermission } from "@/pages/Permission";

interface IProp {
    isVisible: boolean;
    onClose: () => void;
    loadData: () => void;
    dataSelected?: IRole;
}

const ModalRole = (props: IProp) => {
    const { isVisible, dataSelected, onClose, loadData } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [listPermissions, setListPermissions] = useState<
        {
            module: string;
            permissions: IPermission[]
        }[] | null
    >(null);

    const [form] = Form.useForm();

    useEffect(() => {
        getPermission();
    }, []);

    useEffect(() => {
        if (dataSelected?._id && listPermissions?.length) {
            form.setFieldsValue({
                title: dataSelected.title,
                isActive: dataSelected.isActive,
                description: dataSelected.description
            });

            const userPermissions = groupByPermission(dataSelected.permissions);

            listPermissions.forEach(x => {
                let allCheck = true;
                x.permissions.forEach(y => {
                    const temp = userPermissions.find(z => z.module === x.module);

                    if (temp) {
                        const isExist = temp.permissions.find(k => k._id === y._id);
                        if (isExist) {
                            form.setFieldValue(["permissions", y._id as string], true);
                        } else allCheck = false;
                    } else {
                        allCheck = false;
                    }
                });
                form.setFieldValue(["permissions", x.module], allCheck);
            })
        }
    }, [dataSelected]);

    const groupByPermission = (data: any) => {
        return _(data)
            .groupBy(x => x.module)
            .map((value, key) => {
                return { module: key, permissions: value as IPermission[] };
            })
            .value();
    }

    const getPermission = async () => {
        const api = `permissions?current=1&pageSize=1000`;
        const res = await handleAPI(api);
        if (res.data) {
            setListPermissions(groupByPermission(res.data.result));
        }
    }

    const onFinish = async (value: { title: string, description: string, isActive: boolean, permissions: any[] }) => {
        setIsLoading(true);
        const { title, description, isActive, permissions } = value;
        const checkedPermissions = [];

        if (permissions) {
            for (const key in permissions) {
                if (key.match(/^[0-9a-fA-F]{24}$/) && permissions[key] === true) {
                    checkedPermissions.push(key);
                }
            }
        }

        const data = {
            title: title.trim().toUpperCase(),
            description, isActive,
            permissions: checkedPermissions
        }
        console.log(data);
        const api = `roles/${dataSelected ? dataSelected._id : ""}`;
        const res = await handleAPI(api, data, dataSelected ? "patch" : "post");
        if (res.data) {
            loadData();
            onCancel();
            message.success(dataSelected ? "Cập nhập thành công" : "Tạo mới thành công");
        } else {
            notification.error({
                message: "Lỗi ",
                description: res.message && Array.isArray(res.message) ? res.message.toString() : res.message
            })
        }
        setIsLoading(false);
    }

    const onCancel = () => {
        form.resetFields();
        onClose();
    }

    return (
        <Modal
            title={`${dataSelected ? "Cập nhật" : "Tạo mới"} quyền`}
            open={isVisible}
            onOk={() => form.submit()}
            onCancel={onCancel}
            maskClosable={false}
            width={700}
            okButtonProps={{
                loading: isLoading
            }}
            okText={dataSelected ? "Cập nhật" : "Tạo mới"}
            styles={{
                body: { maxHeight: "65vh", overflowY: "auto" }
            }}
            style={{ top: 50 }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                disabled={isLoading}
                initialValues={{ isActive: true }}
            >
                <Form.Item
                    label="Tiêu đề"
                    name={"title"}
                    rules={[{
                        required: true,
                        message: "Please input your title"
                    }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name={"description"}
                    rules={[{
                        required: true,
                        message: "Please input your title"
                    }]}
                >
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Card
                    title="Quyền hạn"
                    style={{ marginBottom: 20 }}
                    size="small"
                    bordered
                >
                    <ModuleApi
                        form={form}
                        listPermissions={listPermissions}
                    />
                </Card>
                <Form.Item
                    label={null}
                    name={"isActive"}
                    rules={[{
                        required: true,
                        message: "Please input your title"
                    }]}
                    valuePropName="checked"
                >
                    <Checkbox>Trạng thái</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalRole