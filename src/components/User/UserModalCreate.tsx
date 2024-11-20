import handleAPI from "@/apis/handleAPI"
import { Divider, Form, Input, message, Modal, notification, Select } from "antd"
import { useState } from "react"

interface IProps {
    isModalOpenCreate: boolean
    setIsModalOpenCreate: React.Dispatch<React.SetStateAction<boolean>>
    fetchUser: any
}

const UserModalCreate = (props: IProps) => {
    const { isModalOpenCreate, setIsModalOpenCreate, fetchUser } = props
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm()

    const onFinish = async (value: any) => {
        setIsLoading(true)
        const api = '/users'
        const res = await handleAPI(api, value, "post");
        if (res && res.data) {
            onCancel();
            fetchUser();
            message.success("Tạo mới thành công");
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
        setIsModalOpenCreate(false);
    }
    return (
        <Modal
            title="Tạo mới người dùng"
            open={isModalOpenCreate}
            onOk={() => form.submit()}
            onCancel={onCancel}
            okText={"Tạo mới"}
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
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng không để trống"
                        }, {
                            type: "email",
                            message: "Email không đúng định dạng"
                        }
                    ]}
                >

                    <Input placeholder="Email" type="email" />
                </Form.Item>
                <Form.Item
                    name={"password"}
                    label={"Mật khẩu"}
                    rules={[{
                        required: true,
                        message: "Vui lòng không để trống"
                    }]}
                >

                    <Input.Password placeholder="Mật khẩu" />
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

export default UserModalCreate