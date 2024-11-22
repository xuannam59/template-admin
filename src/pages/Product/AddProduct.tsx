import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, GetProp, Input, InputNumber, message, Modal, notification, Radio, Select, Slider, Space, Typography, Upload, UploadFile, UploadProps } from 'antd'
import { useState } from 'react'
import type { UploadRequestOption } from "rc-upload/lib/interface";
import handleAPI, { handleUploadFileAPI } from '@/apis/handleAPI';
import { useNavigate } from 'react-router-dom';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface slider {
    name: string,
    uid: string
}

const { Title } = Typography;

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
        message.error('Image must smaller than 1MB!');
    }
    return isJpgOrPng && isLt2M;
};

const AddProduct = () => {
    const [form] = Form.useForm();
    const [thumbnail, setThumbnail] = useState<string>("");
    const [slider, setSlider] = useState<slider[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');


    const navigate = useNavigate();

    const onFinish = async (value: any) => {
        const { categoryId, description, discountPercentage,
            price, status, quantity, title } = value
        const dataSlider = slider.map(item => item.name)
        const api = "/products";
        try {
            const res = await handleAPI(api,
                {
                    categoryId, description, discountPercentage,
                    price, status, quantity,
                    title, thumbnail,
                    slider: dataSlider
                },
                "post")
            if (res && res.data) {
                message.success("Tạo sản phẩm thành công!");
                navigate("/products");
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: JSON.stringify(res.message)
                })
            }
        } catch (error) {
            console.log(error)
        }

    }

    const handleChange = (info: any, type?: string) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
            });
        }
    }

    const handleUploadFileThumbnail = async (options: UploadRequestOption<any>) => {
        const { file, onSuccess, onError } = options;
        try {
            const res = await handleUploadFileAPI(file);
            if (res && res.data) {
                setThumbnail(res.data.fileUpload);
                onSuccess && onSuccess("ok");
                message.success("Upload thành công ảnh thumbnail!");
            } else {
                throw new Error("Không nhận được dữ liệu hợp lệ từ API");
            }
        } catch (error: any) {
            onError && onError(error);
            message.error("Có lỗi xảy ra khi upload ảnh thumbnail!");
        }
    };

    const handRemove = (file: UploadFile, type: string) => {
        if (type === "thumbnail") {
            setThumbnail("");
        }
        if (type === "slider") {
            const newSlider = slider.filter(item => item.uid !== file.uid)
            setSlider(newSlider);
        }
    }

    const handleUploadFileSlider = async (options: UploadRequestOption<any>) => {
        const { file, onSuccess, onError } = options;
        try {
            const res = await handleUploadFileAPI(file);
            if (res && res.data) {
                setSlider((slider) => [...slider, {
                    name: res.data.fileUpload,
                    uid: (file as UploadFile).uid
                }]);
                onSuccess && onSuccess("ok");
                message.success("Upload thành công ảnh slider!");
            } else {
                throw new Error("Không nhận được dữ liệu hợp lệ từ API");
            }
        } catch (error: any) {
            onError && onError(error);
            message.error("Có lỗi xảy ra khi upload ảnh slider!");
        }
    }

    const handlePreview = async (file: any) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };


    return (
        <>
            <div className="container p-4  rounded" style={{ backgroundColor: "white" }}>
                <Title level={4}>Tạo mới sản phẩm</Title>
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={onFinish}
                >
                    <div className="row">
                        <div className="col-8">
                            <div className="row">
                                <div className="col-4">
                                    <Form.Item
                                        name={"thumbnail"}
                                        label="Thumbnail"
                                    >
                                        <Upload
                                            accept='image/*'
                                            name="thumbnail"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileThumbnail}
                                            onChange={handleChange}
                                            onRemove={(file) => handRemove(file, "thumbnail")}
                                            beforeUpload={beforeUpload}
                                            onPreview={handlePreview}
                                        >
                                            <div >
                                                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </Form.Item>
                                </div>
                                <div className="col-8">
                                    <Form.Item
                                        name={"slider"}
                                        label="Slider"
                                    >
                                        <Upload
                                            accept='image/*'
                                            name="slider"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            multiple={true}
                                            customRequest={handleUploadFileSlider}
                                            onChange={(info) => handleChange(info, "slider")}
                                            onRemove={(file) => handRemove(file, "slider")}
                                            beforeUpload={beforeUpload}
                                        >
                                            <div >
                                                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
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
                                <div className="col">
                                    <Form.Item
                                        label="Số lượng"
                                        name="quantity"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng không để trống"
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder='Số lượng'
                                            min={0}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng không để trống"
                                    }
                                ]}
                            >
                                <Input.TextArea placeholder='Mô tả' rows={10} />
                            </Form.Item>
                        </div>
                        <div className="col-4">
                            <Card className='mt-4' size='small'>
                                <Space>
                                    <Button
                                        onClick={() => { }}
                                        size='middle'>Huỷ
                                    </Button>

                                    <Button
                                        onClick={() => form.submit()}
                                        type='primary'
                                        size='middle'
                                    >Tạo mới
                                    </Button>
                                </Space>
                            </Card>
                            <Card className='mt-3'>
                                <Form.Item
                                    name="categoryId"
                                    label="Danh mục sản phẩm"
                                    className='mb-0'
                                >
                                    <Select placeholder="Danh mục sản phẩm" options={[
                                        { label: "Vui lòng chọn danh mục cha", disabled: true }
                                    ]} />
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
                        </div>
                    </div>
                </Form >
            </div >
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default AddProduct