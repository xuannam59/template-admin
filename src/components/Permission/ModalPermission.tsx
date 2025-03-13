import handleAPI from "@/apis/handleAPI";
import { ALL_MODULES } from "@/constants/permissions";
import { IPermission } from "@/pages/Permission";
import { Form, Input, message, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";

interface IProps {
    isVisible: boolean;
    onClose: () => void;
    loadData: () => void;
    dataSelected?: IPermission;
}
const ModalPermission = (props: IProps) => {
    const { isVisible, onClose, loadData, dataSelected } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const optionModule = Object.values(ALL_MODULES).map(value => ({
        value,
        label: value
    }));

    useEffect(() => {
        if (dataSelected) {
            form.setFieldsValue(dataSelected);
        }
    }, [dataSelected]);

    const onFinish = async (value: any) => {
        setIsLoading(true);
        const api = `permissions/${dataSelected ? dataSelected._id : ""}`;
        const res = await handleAPI(api, value, dataSelected ? "patch" : "post");
        if (res.data) {
            loadData();
            message.success(`${dataSelected ? "Cập nhật" : "Tạo"} thành công!`);
            onCancel();
        } else {
            notification.error({
                message: `${dataSelected ? "Cập nhật" : "Tạo"} thất bại!`,
                description: res.message && Array.isArray(res.message) ? res.message.toString() : res.message,
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
            okButtonProps={{
                loading: isLoading
            }}
            okText={dataSelected ? "Cập nhật" : "Tạo mới"}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                disabled={isLoading}
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
                <div className="row">
                    <div className="col">
                        <Form.Item
                            label="Phương thức"
                            name={"method"}
                            rules={[{
                                required: true,
                                message: "Please input your title"
                            }]}
                        >
                            <Select
                                options={[
                                    { value: 'GET', label: 'GET' },
                                    { value: 'POST', label: 'POST' },
                                    { value: 'PATCH', label: 'PATCH' },
                                    { value: 'DELETE', label: 'DELETE' },
                                ]}
                            />
                        </Form.Item>
                    </div>
                    <div className="col">
                        <Form.Item
                            label="Module"
                            name={"module"}
                            rules={[{
                                required: true,
                                message: "Please input your title"
                            }]}
                        >
                            <Select
                                options={optionModule}
                            />
                        </Form.Item>
                    </div>
                </div>
                <Form.Item
                    label="Api path"
                    name={"apiPath"}
                    rules={[{
                        required: true,
                        message: "Please input your title"
                    }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalPermission