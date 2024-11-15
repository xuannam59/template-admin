import { Button, Card, Checkbox, Divider, Form, Input, message, notification, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";

const { Title, Paragraph } = Typography

interface valuesForm {
    email: string;
    password: string;
}

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm()

    const handLogin = async (values: valuesForm) => {
        setIsLoading(true);
        const api = "/auth/login"
        try {
            const res: any = await handleAPI(api, values, "post");
            if (res.data) {
                message.success("Đăng nhập thành công");
                localStorage.setItem("access_token", res.data.access_token);
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                    duration: 5
                });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <div className="text-center">
                <Title level={2}>Login</Title>
                <Paragraph type={"secondary"}>welcome back! please enter your detail </Paragraph>
            </div>
            <Form
                layout="vertical"
                form={form}
                onFinish={handLogin}
                disabled={isLoading}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{
                        required: true,
                        message: 'Please input your email!'
                    },
                    {
                        type: "email",
                        message: 'email is not in correct format!'
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
                            message: "Vui lòng nhập mật khẩu!"
                        }
                    ]}
                >

                    <Input.Password placeholder="Mật khẩu" allowClear />
                </Form.Item>
                <div className="row mb-3">
                    <div className="col">
                        <Checkbox>
                            remember 30 days
                        </Checkbox>
                    </div>
                    <div className="col text-end">
                        <Link to={"/admin/forgot"}>
                            Quên mật khẩu
                        </Link>
                    </div>
                </div>

                <Button
                    onClick={() => form.submit()}
                    style={{
                        width: "100%"
                    }}
                    type="primary"
                    size="large"
                >
                    Đăng nhập
                </Button>

                <Divider>
                    <Paragraph type="secondary" style={{ margin: 0 }}>
                        Or
                    </Paragraph>
                </Divider>
                <div className="text-center">
                    <Paragraph>
                        Chưa có tài khoản? <Link to={"/admin/sign-up"}>Sign Up</Link>
                    </Paragraph>
                </div>
            </Form>
        </Card >
    )
}

export default LoginPage;