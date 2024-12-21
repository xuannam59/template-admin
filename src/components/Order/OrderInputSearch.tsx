import { replaceName } from "@/helpers/replaceName";
import { Button, Form, Input } from "antd"

interface IProps {
    setFilterQuery: React.Dispatch<React.SetStateAction<string>>
}

const OrderInputSearch = (props: IProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        let query = "";
        if (values.title) {
            const title = replaceName(values.title);
            query += `&slug=/${title}/i`;
        }
        props.setFilterQuery(query);
    }
    return (<>
        <Form
            form={form}
            name={"advance_search"}
            layout="vertical"
            onFinish={onFinish}
        >
            <div className="row align-items-center">
                <div className="col">
                    <Form.Item
                        name={"title"}
                        label={"Tên khách hàng"}
                    >
                        <Input placeholder="Tên khách hàng"
                            onKeyDown={(e) => {
                                if (e.code === "Enter") {
                                    form.submit()
                                }
                            }} />
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

export default OrderInputSearch