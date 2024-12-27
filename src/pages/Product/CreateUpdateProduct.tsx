import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, ColorPicker, Form, Input, InputNumber, message, notification, Radio, Space, TreeSelect, Typography, Upload, UploadProps } from 'antd'
import { useEffect, useState, } from 'react'
import { v4 as uuidv4 } from 'uuid';
import handleAPI, { handleUploadFileAPI } from '@/apis/handleAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { tree } from '@/helpers/createTree';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const { Title } = Typography;

const CreateUpdateProduct = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [listCategory, setListCategory] = useState<any[]>();
    const [description, setDescription] = useState("");
    const [productDetail, setProductDetail] = useState<any>();
    const { id } = useParams();

    const navigate = useNavigate();
    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        if (id) {
            getDetailProduct(id);
        }
    }, [id]);

    const getData = async () => {
        const api = `/categories?current=1&pageSize=1000`
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

    const getDetailProduct = async (id: string) => {
        try {
            const res = await handleAPI(`/products/${id}`);
            if (res.data) {
                const data = res.data
                const valueForm = {
                    title: data.title,
                    price: data.price,
                    discountPercentage: data.discountPercentage,
                    status: data.status,
                    versions: data.versions,
                    categoryId: data.categoryId,
                }
                form.setFieldsValue(valueForm);
                if (data.images.length > 0) {
                    const images = data.images.map((url: string) => {
                        return {
                            uid: uuidv4(),
                            name: url,
                            status: 'done',
                            url,
                        }
                    });
                    setFileList(images)
                }
                setProductDetail(res.data);
                setDescription(data.description ?? "");
            } else {
                navigate("/products");
                notification.error({
                    message: "Không tìm thấy sản phẩm",
                    description: res.message && Array.isArray(res.message) ?
                        res.message.toString() :
                        res.message,
                    duration: 3
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onFinish = async (values: any) => {
        setLoading(true);
        const { categoryId, discountPercentage,
            price, status, title, versions } = values

        const data: any = {
            categoryId, discountPercentage,
            price, status,
            title, versions,
            description: description,
        }

        try {
            if (fileList.length > 0) {
                const urls: string[] = [];
                for (const file of fileList) {
                    if (file.originFileObj) {
                        const url = await handleUploadFileAPI(file.originFileObj);
                        if (url.data) {
                            urls.push(url.data.fileUpload)
                        } else {
                            notification.error({
                                message: file.name,
                                description: url.message && Array.isArray(url.message) ?
                                    url.message.toString() :
                                    url.message,
                                duration: 3
                            })
                        }
                    } else {
                        urls.push(file.url);
                    }
                }
                data.images = urls;
            }

            const res = await handleAPI(
                `/products/${productDetail ? productDetail._id : ""}`,
                data,
                `${productDetail ? 'patch' : "post"}`
            )
            if (res && res.data) {
                message.success(`${productDetail ? "Cập nhập" : "Tạo"} sản phẩm thành công!`);
                productDetail ? navigate(0) : navigate("/products")
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: JSON.stringify(res.message)
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
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

        setFileList(items);
    }


    return (
        <>
            <div className="container p-4  rounded" style={{ backgroundColor: "white" }}>
                <Title level={4}>{`${productDetail ? "Cập nhập" : "Tạo sản"} phẩm!`}</Title>
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={onFinish}
                    disabled={loading}
                >
                    <div className="row">
                        <div className="col-8">
                            <div className="row">
                                <div className="col">
                                    <Form.Item
                                        label="Hình ảnh"
                                    >
                                        <Upload
                                            multiple
                                            fileList={fileList}
                                            accept='image/*'
                                            listType='picture-card'
                                            onChange={handleChange}>
                                            Upload
                                        </Upload>
                                    </Form.Item>
                                </div>
                            </div>

                            <Form.Item
                                label="Tiêu đề"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng không để trống"
                                    }
                                ]}
                            >
                                <Input placeholder='Tiêu đề' />
                            </Form.Item>

                            <div className="row">
                                <div className="col">
                                    <Form.Item
                                        label="Giá"
                                        name="price"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng không để trống"
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder='Giá'
                                            min={0}
                                            style={{ width: '100%' }}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            addonAfter="VND"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col">
                                    <Form.Item
                                        label="Phần trăm giảm giá"
                                        name="discountPercentage"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng không để trống"
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder='Phần trăm giảm giá'
                                            min={0}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <Card
                                title="Miêu tả"
                                bordered={false}
                                size="small"
                                style={{ marginBottom: 20 }}
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={setDescription}
                                />
                            </Card>

                        </div>
                        <div className="col-4">
                            <Card className='mt-4' size='small'>
                                <Space>
                                    <Button
                                        onClick={() => {
                                            navigate("/products");
                                            form.resetFields();
                                        }}
                                        size='middle'>Huỷ
                                    </Button>

                                    <Button
                                        onClick={() => form.submit()}
                                        type='primary'
                                        size='middle'
                                        loading={loading}
                                    >{productDetail ? "Cập nhập" : "Tạo mới"}
                                    </Button>
                                </Space>
                            </Card>
                            <Card className='mt-3'>
                                <Form.Item
                                    name="categoryId"
                                    label="Danh mục sản phẩm"
                                    className='mb-0'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng không để trống"
                                        }
                                    ]}
                                >
                                    <TreeSelect
                                        placeholder="Lữa chọn danh mục"
                                        treeDefaultExpandAll
                                        treeData={listCategory}
                                    />
                                </Form.Item>
                            </Card>

                            <Card className='mt-3'>
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
                            </Card>
                            <Card className='mt-3'>
                                <Form.List name="versions" initialValue={[{ color: "", quantity: 0 }]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <div key={key} className='row align-items-center'>
                                                    <div className="col">
                                                        <Form.Item
                                                            {...restField}
                                                            label="Màu"
                                                            name={[name, "color"]}
                                                            // style={{ marginBottom: 0 }}
                                                            rules={[{ required: true, message: "Please select a color" }]}
                                                            getValueFromEvent={(color) => `#${color.toHex()}`
                                                            }
                                                        >
                                                            <ColorPicker />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="col">

                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "quantity"]}
                                                            label="Số lượng"
                                                            rules={[{
                                                                required: true,
                                                                message: "Please input your quantity"
                                                            }]}
                                                        >
                                                            <InputNumber min={0} />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="col text-center">
                                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                                    </div>
                                                </div>
                                            ))}
                                            <Form.Item style={{ marginBottom: 0 }}>
                                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                                                    Thêm phiên bản
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Card>
                        </div>
                    </div>
                </Form >
            </div >
        </>
    )
}

export default CreateUpdateProduct