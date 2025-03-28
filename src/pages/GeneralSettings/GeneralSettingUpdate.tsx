import { previewImage } from "@/helpers/uploadFile";
import { Button, Card, Form, FormInstance, Input, Space, Upload } from "antd";
import { useEffect, useState } from "react";
import { TbMinus, TbPlus } from "react-icons/tb";
import { IGeneralSetting } from ".";
import { v4 as uuidv4 } from 'uuid';


interface IProp {
    form: FormInstance<any>;
    onFinish: (values: any) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
    initialData: IGeneralSetting;
}

const GeneralSettingUpdate = (props: IProp) => {
    const { onFinish, onCancel, form, isLoading, initialData } = props;
    const [logo, setLogo] = useState<any[]>([]);
    const [slides, setSlides] = useState<any[]>([]);

    useEffect(() => {
        const valueForm = {
            title: initialData.title,
            email: initialData.email,
            phone: initialData.phone
        }
        form.setFieldsValue(initialData);
        if (initialData.logo.length > 0) {
            const images = initialData.slides.map((url: string) => {
                return {
                    uid: uuidv4(),
                    name: url,
                    status: 'done',
                    url,
                }
            });
            setSlides(images)
        }
        if (initialData.logo) {
            const logoFile = [
                {
                    uid: uuidv4(),
                    name: initialData.logo,
                    status: 'done',
                    url: initialData.logo,
                }
            ]
            setLogo(logoFile);
        }
    }, [initialData]);

    return (
        <Card
            title="Cập nhật cài đặt chung"
            className="shadow-sm"
            extra={
                <Space>
                    <Button type="primary" onClick={() => form.submit()} loading={isLoading}>
                        Lưu
                    </Button>
                    <Button onClick={onCancel} loading={isLoading}>Hủy</Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(value) => onFinish({ ...value, logo, slides })}
                disabled={isLoading}
            >
                <div className="row g-3">
                    <div className="col-md-2">
                        <Form.Item label="Logo" name="logo">
                            <Upload
                                maxCount={1}
                                multiple={false}
                                fileList={logo}
                                accept="image/*"
                                listType="picture-card"
                                onChange={previewImage(setLogo)}
                            >
                                {logo.length < 1 && "Upload"}
                            </Upload>
                        </Form.Item>
                    </div>
                    <div className="col-md-10">
                        <Form.Item label="Hình ảnh slider" name="sliders">
                            <Upload
                                multiple
                                maxCount={5}
                                fileList={slides}
                                accept="image/*"
                                listType="picture-card"
                                onChange={previewImage(setSlides)}
                            >
                                {slides.length < 5 && "Upload"}
                            </Upload>
                        </Form.Item>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-md-4">
                        <Form.Item
                            label="Tên cửa hàng"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng không để trống!' }]}
                        >
                            <Input placeholder="Nhập tên cửa hàng" />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item
                            label="Email cửa hàng"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng không để trống!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input placeholder="Nhập email cửa hàng" />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item
                            label="Số điện thoại cửa hàng"
                            name="phone"
                            rules={[
                                { required: true, message: 'Vui lòng không để trống!' },
                                { pattern: /^[0-9]+$/, message: 'Chỉ được nhập số!' }
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </div>
                </div>
                <Card title="Cở sở">
                    <Form.List name="address" initialValue={[""]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div className="d-flex align-items-center mb-3" key={key}>
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                            style={{ flex: 1, marginBottom: 0 }}
                                        >
                                            <Input placeholder="Nhập địa chỉ của hàng" />
                                        </Form.Item>
                                        {fields.length > 1 && (
                                            <Button
                                                onClick={() => remove(name)}
                                                icon={<TbMinus />}
                                                type="text"
                                                className="ms-2"
                                            />
                                        )}
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<TbPlus />}
                                        block
                                    >
                                        Thêm địa chỉ
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Card>
            </Form>
        </Card>
    );
};

export default GeneralSettingUpdate;