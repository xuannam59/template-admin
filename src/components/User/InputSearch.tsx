import { Button, Form, Input, notification } from "antd"

interface IProps {
    setSearchFilter: any
}

interface valuesForm {
    name?: string,
    email?: string,
    phone?: string
}


const InputSearch = (props: IProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: valuesForm) => {
        let query = "";
        if (values.name) {
            query += `&name=/${values.name}/i`;
        }
        if (values.email) {
            query += `&email=/${values.email}/i`;
        }
        if (values.phone) {
            query += `&phone=/${values.phone}/i`;
        }

        props.setSearchFilter(query);
    }
    return (<>
        <Form
            form={form}
            name={"advance_search"}
            layout="vertical"
            onFinish={onFinish}
        >
            <div className="row align-items-center">
                <div className="col-3">
                    <Form.Item
                        name={"name"}
                        label={"Tên"}
                    >

                        <Input placeholder="Tên" />
                    </Form.Item>
                </div>
                <div className="col-3">
                    <Form.Item
                        name={"email"}
                        label={"Email"}
                    >

                        <Input placeholder="Email" />
                    </Form.Item>
                </div>
                <div className="col-3">
                    <Form.Item
                        name={"phone"}
                        label={"Số điện thoại"}
                    >
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>
                </div>
                <div className="col-3">
                    <div className="row mt-2">
                        <div className="col text-end">
                            <Button type="primary" onClick={() => form.submit()}> Search</Button>
                        </div>
                        <div className="col">
                            <Button onClick={() => {
                                form.resetFields()
                                form.submit()
                            }}> Clear</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </>)
}

export default InputSearch