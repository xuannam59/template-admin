import handleAPI from '@/apis/handleAPI';
import { uploadImage } from '@/helpers/uploadFile';
import { Form, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import GeneralSetting from './GeneralSetting';
import GeneralSettingUpdate from './GeneralSettingUpdate';

export interface IGeneralSetting {
    _id: string;
    title: string;
    logo: string;
    slides: string[];
    email: string;
    phone: string;

    updatedBy?: {
        _id: string;
        email: string;
    }
}

const GeneralSettingPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [initialData, setInitialData] = useState<IGeneralSetting>({
        _id: "123",
        title: 'Tên cửa hàng ban đầu',
        logo: 'path/to/logo.png',
        slides: [],
        email: 'contact@store.com',
        phone: '0123-456-789',
    });

    useEffect(() => {
        FetchData()
    }, []);

    const FetchData = async () => {
        setIsLoading(true);
        const api = 'general-setting'
        const res = await handleAPI(api);
        if (res.data) {
            setInitialData(res.data);
        }
        setIsLoading(false);
    }


    const onFinish = async (values: any) => {
        setIsLoading(true);
        const { logo, slides } = values
        const data = {
            ...values,
            logo: "",
            sliders: []
        }

        data.logo = await uploadImage(logo, "general", true);
        data.slides = await uploadImage(slides, "general");

        const res = await handleAPI(`general-setting/${initialData._id}`, data, "patch");
        if (res.data) {
            onCancel()
            FetchData();
            message.success("Cập nhập thành công!");
        } else {
            notification.error({
                message: "cập nhập thất bại",
                description: res.message && Array.isArray(res.message) ? res.message.toString() : res.message
            })
        }
        setIsLoading(false);
    };

    const onCancel = () => {
        setIsEditing(false);
        form.resetFields();
    };

    return (
        <>
            <div className="container mt-4">
                {isEditing ?
                    <GeneralSettingUpdate
                        onFinish={onFinish}
                        onCancel={onCancel}
                        form={form}
                        isLoading={isLoading}
                        initialData={initialData}
                    /> :
                    <GeneralSetting
                        initialData={initialData}
                        setIsEditing={setIsEditing}
                    />
                }
            </div>
        </>
    )
}

export default GeneralSettingPage