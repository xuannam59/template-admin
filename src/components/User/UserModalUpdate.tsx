import handleAPI from "@/apis/handleAPI"
import { Divider, Form, Input, message, Modal, notification, Select } from "antd"
import { useEffect, useState } from "react"

interface IProps {
    isModalOpenUpdate: boolean
    fetchUser: any
    dataSelect: any
    onclose: () => void
}

const UserModalUpdate = (props: IProps) => {
    const { isModalOpenUpdate, fetchUser, dataSelect, onclose } = props
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(dataSelect)
    }, [dataSelect]);

    const onFinish = async (value: any) => {
        setIsLoading(true)
        const api = `/users/${dataSelect._id}`
        const res = await handleAPI(api, value, "patch");
        if (res && res.data) {
            onCancel();
            fetchUser();
            message.success("Cập nhập thành công");
        } else {
            notification.error({
                message: "Error Creation",
                description: res.message
            })
        }
        setIsLoading(false)
    }
    const onCancel = () => {
        form.resetFields();
        onclose()
    }
    return (
        <Modal
            forceRender
            title="Cập nhập người dùng"
            open={isModalOpenUpdate}
            onOk={() => form.submit()}
            onCancel={onCancel}
            okText={"Cập nhập"}
            cancelText={"Huỷ"}
            maskClosable={false}
            okButtonProps={{
                loading: isLoading
            }}
        >
            <Divider />

            <Form
                form={form}
                disabled={isLoading}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name={"name"}
                    label={"Họ Tên"}
                    rules={[{
                        required: true,
                        message: "Vui lòng không để trống"
                    }]}
                >
                    <Input placeholder="Họ Tên" />
                </Form.Item>
                <Form.Item
                    name={"email"}
                    label={"Email"}
                >
                    <Input placeholder="Email" type="email" disabled />
                </Form.Item>
                <Form.Item
                    name={"role"}
                    label={"Vai trò"}
                    rules={[{
                        required: true,
                        message: "Vui lòng không để trống"
                    }]}
                >
                    <Select placeholder="Vai trò" options={[
                        {
                            label: "USER",
                            value: "USER"
                        },
                        {
                            label: "ADMIN",
                            value: "ADMIN"
                        }
                    ]} />
                </Form.Item>
                <Form.Item
                    name={"phone"}
                    label={"Số điện thoại"}
                >

                    <Input placeholder="Số điện thoại" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UserModalUpdate