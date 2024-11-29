import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, GetProp, Input, InputNumber, message, notification, Radio, Select, Space, TreeSelect, Typography, Upload, UploadFile, UploadProps } from 'antd'
import { useEffect, useState } from 'react'
import type { UploadRequestOption } from "rc-upload/lib/interface";
import handleAPI, { handleUploadFileAPI } from '@/apis/handleAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Loading from '@/components/Loading';
import { tree } from '@/helpers/createTree';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface slider {
    name: string,
    uid: string
}

interface IDataUpdate {
    title: string;
    thumbnail: string;
    price: string;
    discountPercentage: number;
    description: string;
    quantity: number;
    categoryId: string;
    status: string;
    slider: string[];
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

const UpdateProduct = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();

    const [dataUpdate, setDataUpdate] = useState<IDataUpdate>();
    const [thumbnail, setThumbnail] = useState<string>("");
    const [slider, setSlider] = useState<slider[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [listCategory, setListCategory] = useState<any[]>();
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchProduct();
    }, []);

    useEffect(() => {
        getData()
    }, []);

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

    useEffect(() => {
        if (dataUpdate) {
            const arrSlider = dataUpdate.slider.map((item) => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: "done",
                    url: item
                }
            })


            setThumbnail(dataUpdate.thumbnail);
            setSlider(arrSlider);
            const init = {
                title: dataUpdate.title,
                price: dataUpdate.price,
                discountPercentage: dataUpdate.discountPercentage,
                quantity: dataUpdate.quantity,
                categoryId: dataUpdate.categoryId,
                status: dataUpdate.status,
            }
            setDescription(dataUpdate.description);
            form.setFieldsValue(init);
        }
    }, [dataUpdate]);

    const fetchProduct = async () => {
        const api = `/products/${id}`;
        try {
            const res = await handleAPI(api);
            if (res.data && res) {
                setDataUpdate(res.data);
            }
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    const onFinish = async (value: any) => {
        setLoadingForm(true);
        const { categoryId, discountPercentage,
            price, status, quantity, title } = value
        const dataSlider = slider.map(item => item.name)
        const api = `/products/${id}`;
        try {
            const res = await handleAPI(api,
                {
                    categoryId, discountPercentage,
                    price, status, quantity,
                    title, thumbnail,
                    description: description,
                    slider: dataSlider
                },
                "patch")
            if (res && res.data) {
                message.success("Cập nhập phẩm thành công!");
                fetchProduct();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: JSON.stringify(res.message)
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingForm(false)
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
        } finally {
            setLoading(false);
        }
    };

    const handleUploadFileSlider = async (options: UploadRequestOption<any>) => {
        const { file, onSuccess, onError } = options;
        try {
            const res = await handleUploadFileAPI(file);
            if (res && res.data) {
                const uploadedFile = {
                    name: res.data.fileUpload,
                    uid: (file as UploadFile).uid,
                    status: "done",
                    url: res.data.fileUpload
                };

                setSlider((slider) => [...slider, uploadedFile]);
                onSuccess && onSuccess("ok");
                message.success("Upload thành công ảnh slider!");
                setLoadingSlider(false);
            } else {
                throw new Error("Không nhận được dữ liệu hợp lệ từ API");
            }
        } catch (error: any) {
            onError && onError(error);
            message.error("Có lỗi xảy ra khi upload ảnh slider!");
        }
        finally {
            setLoadingSlider(false);
        }
    }

    const handRemove = (file: UploadFile, type: string) => {
        if (type === "thumbnail") {
            setThumbnail("");
        }
        if (type === "slider") {
            const newSlider = slider.filter(item => item.uid !== file.uid)
            setSlider(newSlider);
        }
    }
    return (!dataUpdate ? <Loading /> :
        <>
            <div className="container p-4  rounded" style={{ backgroundColor: "white" }}>
                <Title level={4}>Cập nhập sản phẩm</Title>
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={onFinish}
                    disabled={loadingForm}
                >
                    <div className="row">
                        <div className="col-8">
                            <div className="row">
                                <div className="col-4">
                                    <Form.Item
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
                                            fileList={thumbnail ? [{
                                                uid: uuidv4(),
                                                name: thumbnail,
                                                status: "done",
                                                url: thumbnail
                                            }] : []}
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
                                            fileList={slider}
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
                                        onClick={() => navigate("/products")}
                                        size='middle'>Trở lại
                                    </Button>

                                    <Button
                                        loading={loadingForm}
                                        onClick={() => form.submit()}
                                        type='primary'
                                        size='middle'
                                    >Cập nhập
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
                        </div>
                    </div>
                </Form >
            </div >
        </>
    )
}

export default UpdateProduct