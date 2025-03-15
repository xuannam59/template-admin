import handleAPI, { handleUploadFileAPI } from '@/apis/handleAPI';
import { tree } from '@/helpers/createTree';
import { ICategories } from '@/pages/Category';
import { Form, Input, message, Modal, notification, Radio, TreeSelect, Upload, UploadProps } from 'antd';
import { useEffect, useState } from 'react'

interface IProps {
    isVisible: boolean
    onClose: any;
    selectData: ICategories | undefined;
    fetchCategories: any,
}

const ModalCategory = (props: IProps) => {
    const { isVisible, fetchCategories, onClose, selectData } = props
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<any[]>([]);
    const [listCategory, setListCategory] = useState<any[]>();
    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        if (selectData) {
            const data = {
                title: selectData.title,
                parentId: selectData.parentId ? selectData.parentId : undefined,
                description: selectData.description,
                status: selectData.status,
                displayMode: selectData.displayMode
            }
            console.log(selectData);
            if (selectData.image) {
                setImageUpload([{
                    uuid: "-1",
                    url: selectData.image,
                    status: "done"
                }])
            }
            form.setFieldsValue(data);
        }
    }, [selectData]);
    const getData = async () => {
        const api = `/categories`
        try {
            const res = await handleAPI(api)
            if (res && res.data) {
                const categories = res.data.result.map((item: any) => {
                    return {
                        _id: item._id,
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

    const onFinish = async (values: any) => {
        setIsLoading(true)
        const api = `/categories/${selectData ? selectData._id : ""}`;
        try {
            const data = {
                title: values.title,
                parentId: values.parentId,
                description: values.description,
                status: values.status,
                displayMode: values.displayMode,
                image: ""
            }

            data.image =
                imageUpload.length > 0 && imageUpload[0].originFileObj
                    ? (await handleUploadFileAPI(imageUpload[0].originFileObj, "images/categories")).data.fileUpload
                    : imageUpload[0]?.url ?? "";
            console.log(data);
            const res = await handleAPI(api, data, `${selectData ? "patch" : "post"}`);
            if (res && res.data) {
                message.success(`${selectData ? "Cập nhật" : "Tạo"} danh mục thành công`);
                getData();
                fetchCategories();
                onCancel();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message && Array.isArray(res.message) ? res.message.toString() : res.message,
                });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const items = newFileList.map((item) =>
            item.originFileObj
                ? {
                    ...item,
                    url: item.originFileObj
                        ? URL.createObjectURL(item.originFileObj)
                        : '',
                    status: 'done',
                }
                : { ...item }
        );

        setImageUpload(items);
    };

    const onCancel = () => {
        form.resetFields();
        setImageUpload([]);
        onClose();
    }
    return (
        <>
            <Modal
                title={selectData ? "Cập nhật danh mục" : "Tạo mới danh mục"}
                open={isVisible}
                onOk={() => form.submit()}
                onCancel={onCancel}
                okText={selectData ? "Cập nhật" : "Tạo mới"}
                cancelText={"Huỷ"}
                maskClosable={false}
                okButtonProps={{
                    loading: isLoading
                }}
                style={{ top: 50 }}
            >
                <Upload
                    accept='image/*'
                    fileList={imageUpload}
                    maxCount={1}
                    multiple={false}
                    listType='picture-card'
                    className='mb-2'
                    onChange={handleChange}
                >
                    {imageUpload.length === 0 ? 'Upload' : null}
                </Upload>
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinish}
                    disabled={isLoading}
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
                        className='mb-2'
                        initialValue={"active"}
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
                    <Form.Item
                        label="Chế độ hiển thị"
                        name="displayMode"
                        className='mb-0'
                        initialValue={false}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng không để trống"
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={true}>Hiển thị</Radio>
                            <Radio value={false}>Không hiển thị</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ModalCategory