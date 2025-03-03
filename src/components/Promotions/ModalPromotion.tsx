import handleAPI, { handleUploadFileAPI } from "@/apis/handleAPI";
import { IPromotions } from "@/pages/Promotions";
import { DatePicker, Form, GetProps, Input, InputNumber, message, Modal, notification, Select, Upload, UploadProps } from "antd"
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current <= dayjs().endOf('day');
};

interface IProps {
    isVisible: boolean;
    onClose: () => void;
    loadData: () => void;
    promotion?: IPromotions;
}

const ModalPromotion = (props: IProps) => {
    const { isVisible, onClose, promotion, loadData } = props

    const [isLoading, setIsLoading] = useState(false);
    const [imageUpload, setImageUpload] = useState<any[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (promotion) {
            form.setFieldsValue({
                ...promotion,
                startAt: dayjs(promotion.startAt),
                endAt: dayjs(promotion.endAt),
            })
            if (promotion.image) {
                setImageUpload([{
                    uuid: "-1",
                    url: promotion.image,
                    status: "done"
                }])
            }
        }

    }, [promotion]);


    const onFinish = async (values: any) => {
        const { title, descriptions, code,
            value, quantityAvailable, type,
            startAt, endAt, maxValue, minValue } = values;
        setIsLoading(true);
        if (imageUpload.length === 0) {
            message.error('Please upload one image');
        } else {
            if (new Date(endAt).getTime() < new Date(startAt).getTime()) {
                notification.error({
                    message: "Error date",
                    description: "the end date must be greater than the start date",
                    duration: 2
                })
            } else {
                const data = {
                    title, code, value,
                    quantityAvailable, type, maxValue, minValue,
                    descriptions: descriptions ?? "",
                    startAt: new Date(startAt),
                    endAt: new Date(endAt),
                    image: "",
                }
                data.image =
                    imageUpload.length > 0 && imageUpload[0].originFileObj
                        ? (await handleUploadFileAPI(imageUpload[0].originFileObj, "images/promotions")).data.fileUpload
                        : imageUpload[0].url;

                const res = await handleAPI(
                    `/promotions/${promotion ? promotion._id : ""}`,
                    data,
                    promotion ? "patch" : "post"
                );
                if (res.data) {
                    message.success(promotion ? "Update successfully" : "Create successfully");
                    loadData()
                    onCancel();
                } else {
                    notification.error({
                        message: "Error",
                        description: res.message && Array.isArray(res.message) ? res.message.toString() : res.message,
                        duration: 3
                    })
                }

            }
        }
        setIsLoading(false);
    }
    const onCancel = () => {
        form.resetFields();
        setImageUpload([]);
        onClose();
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

    return (
        <Modal
            title={promotion ? "Update" : "Create"}
            open={isVisible}
            onOk={() => form.submit()}
            onCancel={onCancel}
            maskClosable={false}
            okButtonProps={{
                loading: isLoading
            }}
            okText={promotion ? "Update" : "Create"}
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
                layout="vertical"
                onFinish={onFinish}
                disabled={isLoading}
            >
                <Form.Item
                    label="Title"
                    name={"title"}
                    rules={[{
                        required: true,
                        message: "Please input your title"
                    }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Descriptions"
                    name={"descriptions"}
                >
                    <Input.TextArea rows={1} />
                </Form.Item>
                <div className="row">
                    <div className="col">
                        <Form.Item
                            label="CODE"
                            name={"code"}
                            rules={[{
                                required: true,
                                message: "Please input your CODE"
                            }]}
                        >
                            <Input />
                        </Form.Item>

                    </div>
                    <div className="col">
                        <Form.Item
                            label="Value"
                            name={"value"}
                            rules={[{
                                required: true,
                                message: "Please input your value"
                            }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>

                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Form.Item
                            label="Maximum discount"
                            name={"maxValue"}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </div>
                    <div className="col">
                        <Form.Item
                            label="Minimum value"
                            name={"minValue"}
                            rules={[{
                                required: true,
                                message: "Please input your"
                            }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Form.Item
                            label="Quantity available"
                            name={"quantityAvailable"}
                            rules={[{
                                required: true,
                                message: "Please input your quantity"
                            }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>
                    </div>
                    <div className="col">
                        <Form.Item
                            label="Type"
                            name={"type"}
                            initialValue={'discount'}
                        >
                            <Select options={[
                                {
                                    label: "DISCOUNT",
                                    value: "discount"
                                },
                                {
                                    label: "PERCENT",
                                    value: "percent"
                                }
                            ]} />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Form.Item
                            label="Start"
                            name={"startAt"}
                            rules={[{
                                required: true,
                                message: "Please input your start"
                            }]}
                        >
                            <DatePicker
                                disabledDate={disabledDate}
                                showTime
                                format={"DD/MM/YYYY HH:mm:ss"}
                            />
                        </Form.Item>
                    </div>
                    <div className="col">
                        <Form.Item
                            label="End"
                            name={"endAt"}
                            rules={[{
                                required: true,
                                message: "Please input your end"
                            }]}
                        >
                            <DatePicker
                                disabledDate={disabledDate}
                                showTime
                                format={"DD/MM/YYYY HH:mm:ss"}
                            />
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    )
}

export default ModalPromotion