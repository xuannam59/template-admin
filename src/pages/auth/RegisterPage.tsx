import { Button, Card, Checkbox, Divider, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

interface valuesForm {
    username: string
    email: string;
    password: string;
    confirmPassword: string;
}

const { Title, Paragraph } = Typography
const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm()

    const handLogin = (values: valuesForm) => {
        console.log(values);
    }

    return (
        <Card >
            <div className="text-center">
                <Title level={2}>Sign up</Title>
            </div>
            <Form
                layout="vertical"
                form={form}
                onFinish={handLogin}
                disabled={isLoading}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{
                        required: true,
                        message: 'Please input your name!'
                    },]}
                >
                    <Input placeholder="Name" maxLength={100} />
                </Form.Item>

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

                <Form.Item
                    label="Confirm password"
                    name="confirmPassword"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!"
                        }
                    ]}
                >

                    <Input.Password placeholder="Password" allowClear />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "Please input your phone!"
                        }
                    ]}
                >

                    <Input placeholder="phone" allowClear />
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
                    Sign up
                </Button>

                <Divider>
                    <Paragraph type="secondary" style={{ margin: 0 }}>
                        Or sign up with
                    </Paragraph>
                </Divider>
                <div className="text-center">
                    <Paragraph>
                        Already have an account <Link to={"/admin/login"}>Login In</Link>
                    </Paragraph>
                </div>
            </Form>
        </Card>
    )
}

export default RegisterPage;