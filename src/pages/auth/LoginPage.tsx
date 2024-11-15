import { Button, Card, Checkbox, Divider, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography

interface valuesForm {
    email: string;
    password: string;
    remember: boolean;
}

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm()

    const handLogin = (values: valuesForm) => {
        console.log(values);
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
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!"
                        }
                    ]}
                >

                    <Input.Password placeholder="Password" allowClear />
                </Form.Item>
                <div className="row">
                    <div className="col">
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            label={null}
                        >
                            <Checkbox>
                                remember 30 days
                            </Checkbox>
                        </Form.Item>
                    </div>
                    <div className="col text-end">
                        <Link to={"/admin/forgot"}>
                            forgot password
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
                    Login
                </Button>

                <Divider>
                    <Paragraph type="secondary" style={{ margin: 0 }}>
                        Or sign in with
                    </Paragraph>
                </Divider>
                <div className="text-center">
                    <Paragraph>
                        Don't have an account? <Link to={"/admin/sign-up"}>Sign Up</Link>
                    </Paragraph>
                </div>
            </Form>
        </Card >
    )
}

export default LoginPage;