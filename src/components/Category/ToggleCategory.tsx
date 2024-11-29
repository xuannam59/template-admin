import handleAPI from '@/apis/handleAPI';
import { tree } from '@/helpers/createTree';
import { ICDataType } from '@/pages/Category';
import { Form, Input, message, Modal, notification, Radio, Select, TreeSelect } from 'antd';
import { useEffect, useState } from 'react'

interface IProps {
    isModalOpen: boolean
    onClose: any;
    selectData: ICDataType | undefined;
    fetchCategories: any,

}

const ToggleCategory = (props: IProps) => {
    const { isModalOpen, fetchCategories, onClose, selectData } = props
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [listCategory, setListCategory] = useState<any[]>();
    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        if (selectData) {
            const data = {
                title: selectData.title,
                parentId: selectData?.parentId ?? "",
                description: selectData.description,
                status: selectData.status
            }
            console.log(selectData);
            form.setFieldsValue(data);
        }
    }, [selectData]);
    const getData = async () => {
        const api = `/categories?current=1&pageSize=1000`
        try {
            const res = await handleAPI(api)
            if (res && res.data) {
                const categories = res.data.result.map((item: any) => {
                    return {
                        id: item._id,
                        title: item.title,
                        value: item._id,
                        parentId: item.parentId ? item.parentId._id : ""
                    }
                })
                const categoryTree = tree(categories, "");
                setListCategory(categoryTree);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onFinish = async (values: ICDataType) => {
        setIsLoading(true)
        const api = `/categories/${selectData ? selectData.id : ""}`;
        try {
            const res = await handleAPI(api, values, `${selectData ? "patch" : "post"}`);
            if (res && res.data) {
                if (selectData) {
                    message.success("Cập nhập danh mục thành công");
                    getData();
                    fetchCategories();
                    onCancel();
                } else {
                    message.success("Tạo danh mục thành công");
                    getData();
                    fetchCategories();
                    onCancel();
                }
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: JSON.stringify(res.message)
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const onCancel = () => {
        form.resetFields();
        onClose();
    }
    return (
        <>
            <Modal
                title={selectData ? "Cập nhập danh mục" : "Tạo mới danh mục"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={onCancel}
                okText={selectData ? "Cập nhập" : "Tạo mới"}
                cancelText={"Huỷ"}
                maskClosable={false}
                okButtonProps={{
                    loading: isLoading
                }}
            >
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinish}
                    initialValues={{
                        "status": "active"
                    }}
                >
                    <Form.Item
                        label="Tên danh mục"
                        name={"title"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng không để trống"
                            }
                        ]}
                    >
                        <Input placeholder='Tên danh mục' />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục cha"
                        name={"parentId"}
                    >
                        <TreeSelect
                            placeholder="Lữa chọn danh mục cha"
                            treeDefaultExpandAll
                            treeData={listCategory}
                        />
                    </Form.Item>
                    <Form.Item
                        label="mô tả"
                        name={"description"}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        className='mb-0'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng không để trống"
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={"active"}>Hoạt động</Radio>
                            <Radio value={"inactive"}>Dừng hoạt động</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ToggleCategory