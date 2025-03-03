import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, ColorPicker, Form, Input, InputNumber, message, notification, Radio, Select, Space, TreeSelect, Typography, Upload } from 'antd'
import { useEffect, useState, } from 'react'
import { v4 as uuidv4 } from 'uuid';
import handleAPI, { handleUploadFileAPI } from '@/apis/handleAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { tree } from '@/helpers/createTree';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import { computerConfiguration } from '@/constants/appInfos';
import { IProducts } from '.';

const { Title } = Typography;

const CreateUpdateProduct = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const [thumbnail, setThumbnail] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [listCategory, setListCategory] = useState<any[]>();
    const [description, setDescription] = useState("");
    const [productDetail, setProductDetail] = useState<IProducts>();
    const { id } = useParams();
    const configurationOptions = computerConfiguration.reduce((acc, item) => {
        acc[item.key] = item.value.map(value => ({ label: value, value }));
        return acc;
    }, {} as Record<string, { label: string, value: string }[]>);

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
        const api = `/categories`
        try {
            const res = await handleAPI(api)
            if (res && res.data) {
                const categories = res.data.result.map((item: any) => {
                    return {
                        _id: item._id,
                        title: item.title,
                        value: item._id,
                        parentId: item.parentId ? item.parentId : ""
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
                    cost: data.cost,
                    price: data.price,
                    discountPercentage: data.discountPercentage,
                    status: data.status,
                    versions: data.versions,
                    categoryId: data.categoryId._id,
                    ram: data.ram,
                    chip: data.chip,
                    ssd: data.ssd,
                    gpu: data.gpu
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
                if (data.thumbnail) {
                    const thumbnailFile = [
                        {
                            uid: uuidv4(),
                            name: data.thumbnail,
                            status: 'done',
                            url: data.thumbnail,
                        }
                    ]
                    setThumbnail(thumbnailFile);
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
        const data: any = {
            ...values,
            description: description
        }

        try {
            const thumbnailFile = thumbnail[0]
            if (thumbnailFile && thumbnailFile.originFileObj) {
                const url = await handleUploadFileAPI(thumbnailFile.originFileObj, "images/products");
                if (url.data) {
                    data.thumbnail = url.data.fileUpload;
                } else {
                    notification.error({
                        message: thumbnailFile.name,
                        description: url.message && Array.isArray(url.message) ?
                            url.message.toString() :
                            url.message,
                        duration: 3
                    })
                }
            } else if (thumbnailFile) {
                data.thumbnail = thumbnailFile.url;
            }


            if (fileList.length > 0) {
                const urls: string[] = [];
                for (const file of fileList) {
                    if (file.originFileObj) {
                        const url = await handleUploadFileAPI(file.originFileObj, "images/products");
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
            console.log(data);

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

    const handleChange = (setState: React.Dispatch<React.SetStateAction<UploadFile[]>>) =>
        ({ fileList: newFileList }: UploadChangeParam<UploadFile>) =>
            setState(newFileList.map((item) => ({
                ...item,
                url: item.originFileObj ? URL.createObjectURL(item.originFileObj) : item.url,
                status: 'done'
            })));

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
                                <div className="col-4">
                                    <Form.Item
                                        label="Thumbnail"
                                    >
                                        <Upload
                                            fileList={thumbnail}
                                            accept='image/*'
                                            listType='picture-card'
                                            onChange={handleChange(setThumbnail)}
                                        >
                                            {thumbnail.length < 1 &&
                                                "Upload"
                                            }
                                        </Upload>
                                    </Form.Item>
                                </div>
                                <div className="col">
                                    <Form.Item
                                        label="Hình ảnh"
                                    >
                                        <Upload
                                            multiple
                                            fileList={fileList}
                                            accept='image/*'
                                            listType='picture-card'
                                            onChange={handleChange(setFileList)}>
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
                                        label="Chip"
                                        name="chip"
                                    >
                                        <Select options={configurationOptions.chip} placeholder='Chip' />
                                    </Form.Item>
                                </div>
                                <div className="col">
                                    <Form.Item
                                        label="RAM"
                                        name="ram"
                                    >
                                        <Select options={configurationOptions.ram} placeholder='RAM' />
                                    </Form.Item>
                                </div>
                                <div className="col">
                                    <Form.Item
                                        label="SSD"
                                        name="ssd"
                                    >
                                        <Select options={configurationOptions.ssd} placeholder='SSD' />
                                    </Form.Item>
                                </div>
                                <div className="col">
                                    <Form.Item
                                        label="GPU"
                                        name="gpu"
                                    >
                                        <Input placeholder='GPU' />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-5">
                                    <Form.Item
                                        label="Giá nhập"
                                        name="cost"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng không để trống"
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder='Giá nhập'
                                            min={0}
                                            style={{ width: '100%' }}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            addonAfter="VND"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-5">
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
                                <div className="col-2">
                                    <Form.Item
                                        label="% giảm giá"
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
                            <Card className='mt-3' title={"Danh mục sản phẩm"}>
                                <Form.Item
                                    name="categoryId"
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
                                        treeData={listCategory}
                                    />
                                </Form.Item>
                            </Card>

                            <Card className='mt-3' title={"Trạng thái"}>
                                <Form.Item
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
                            <Card className='mt-3' title="Phiên bản">
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