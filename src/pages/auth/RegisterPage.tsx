import { Button, Card, Checkbox, Divider, Form, Input, message, notification, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";

interface valuesForm {
    name: string
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

const { Title, Paragraph } = Typography
const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const handRegister = async (values: valuesForm) => {
        setIsLoading(true);
        const api = "/auth/register"
        try {
            const res: any = await handleAPI(api, values, "post");
            if (res.data) {
                message.success("Đăng ký thành công");
                navigate("/admin/login");
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                    duration: 5
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card >
            <div className="text-center">
                <Title level={2}>Sign up</Title>
            </div>
            <Form
                layout="vertical"
                form={form}
                onFinish={handRegister}
                disabled={isLoading}
            >
                <Form.Item
                    label="Tên Người dùng"
                    name="name"
                    rules={[{
                        required: true,
                        message: 'Không được để trống!'
                    },]}
                >
                    <Input placeholder="Tên Người dùng" maxLength={100} />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{
                        required: true,
                        message: 'Không được để trống!'
                    },
                    {
                        type: "email",
                        message: 'Email không đúng định dạnh!'
                    }
                    ]}
                >
                    <Input placeholder="Email" allowClear maxLength={100} type="email" />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Không được để trống!"
                        }
                    ]}
                >

                    <Input.Password placeholder="Mật khẩu" allowClear />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    rules={[
                        {
                            required: true,
                            message: "Không được để trống!"
                        }
                    ]}
                >

                    <Input.Password placeholder="Xác nhận mật khẩu" allowClear />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "Không được để trống!"
                        }
                    ]}
                >

                    <Input placeholder="Số điện thoại" allowClear />
                </Form.Item>
                <Button
                    onClick={() => form.submit()}
                    style={{
                        width: "100%"
                    }}
                    type="primary"
                    size="large"
                    loading={isLoading}
                >
                    Đặng ký
                </Button>

                <Divider>
                    <Paragraph type="secondary" style={{ margin: 0 }}>
                        Or
                    </Paragraph>
                </Divider>
                <div className="text-center">
                    <Paragraph>
                        Đã có tài khoản? <Link to={"/admin/login"}>Login In</Link>
                    </Paragraph>
                </div>
            </Form>
        </Card>
    )
}

export default RegisterPage;