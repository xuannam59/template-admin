import handleAPI from "@/apis/handleAPI"
import { IUser } from "@/pages/User"
import { UserOutlined } from "@ant-design/icons"
import { Avatar, Divider, Form, Input, message, Modal, notification, Select } from "antd"
import { useEffect, useState } from "react"

interface IProps {
    isVisible: boolean
    onClose: () => void;
    fetchUser: any
    dataSelected?: IUser
}

const ModalUser = (props: IProps) => {
    const { isVisible, onClose, fetchUser, dataSelected } = props
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState();
    const [form] = Form.useForm()
    console.log(dataSelected);
    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        if (dataSelected) {
            const data = {
                name: dataSelected.name,
                email: dataSelected.email,
                role: dataSelected?.role?._id,
                phone: dataSelected.phone
            };
            form.setFieldsValue(data)
        }
    }, [dataSelected]);

    const getData = async () => {
        const api = `/roles?current=1&pageSize=1000`
        try {
            const res = await handleAPI(api)
            if (res && res.data) {
                const data = res.data.result.map((item: any) => {
                    return {
                        label: item.title,
                        value: item._id,
                    }
                })
                setRoles(data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onFinish = async (value: any) => {
        const { name, email, password, role, phone } = value
        setIsLoading(true)
        const api = `/users/${dataSelected ? dataSelected._id : ""}`;
        const data = {
            name, email, password, role, phone
        }
        if (dataSelected) {
            delete data.password;
        }
        const res = await handleAPI(api, data, dataSelected ? "patch" : "post");
        if (res && res.data) {
            onCancel();
            fetchUser();
            message.success(dataSelected ? "Cập nhập thành công" : "Tạo mới thành công");
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
        onClose();
    }
    return (
        <Modal
            title={dataSelected ? "Cập nhật người dùng" : "Tạo mới người dùng"}
            open={isVisible}
            onOk={() => form.submit()}
            onCancel={onCancel}
            okText={dataSelected ? "Cập nhật" : "Tạo mới"}
            cancelText={"Huỷ"}
            maskClosable={false}
            okButtonProps={{
                loading: isLoading
            }}
            style={{ top: 50 }}
        >
            {
                dataSelected &&
                <div className="d-flex justify-content-center">
                    <Avatar
                        size={80}
                        icon={<UserOutlined />}
                        src={dataSelected.avatar}
                    />
                </div>
            }
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

                    <Input placeholder="Email" type="email" disabled={dataSelected ? true : false} />
                </Form.Item>
                <Form.Item
                    name={"password"}
                    label={"Mật khẩu"}
                    rules={[{
                        required: dataSelected ? false : true,
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

                    <Select placeholder="Vai trò" options={roles} />
                </Form.Item>
                <Form.Item
                    name={"phone"}
                    label={"Số điện thoại"}
                >

                    <Input placeholder="Số điện thoại" disabled={dataSelected ? true : false} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalUser