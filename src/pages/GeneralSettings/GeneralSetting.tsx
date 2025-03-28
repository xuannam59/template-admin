import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permissions'
import { Button, Card, Image, Space, Typography } from 'antd'
import { TbEdit } from 'react-icons/tb'
import { IGeneralSetting } from '.';

const { Title, Text } = Typography;

interface IProp {
    setIsEditing: (value: boolean) => void;
    initialData: IGeneralSetting;
}

const GeneralSetting = (props: IProp) => {
    const { initialData, setIsEditing } = props;
    return (
        <Card
            title="Cài đặt chung"
            className="shadow-sm"
            extra={
                <Access
                    permission={ALL_PERMISSIONS.SETTINGS.UPDATE}
                >
                    <Button
                        type="primary"
                        icon={<TbEdit />}
                        onClick={() => setIsEditing(true)}
                    >
                        Cập nhật
                    </Button>
                </Access>
            }
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Tên cửa hàng */}
                <div>
                    <Title level={5} style={{ margin: 0 }}>
                        Tên cửa hàng
                    </Title>
                    <Text strong>{initialData.title}</Text>
                </div>

                {/* Logo và Slides */}
                <div className="row g-3">
                    <div className="col-md-3">
                        <Title level={5} style={{ margin: 0 }}>
                            Logo
                        </Title>
                        <Image
                            src={initialData.logo}
                            alt="Logo cửa hàng"
                            width={150}
                            style={{ borderRadius: '8px', marginTop: 8 }}
                        />
                    </div>
                    <div className="col-md-9">
                        <Title level={5} style={{ margin: 0 }}>
                            Hình ảnh slider
                        </Title>
                        <Space size="middle" style={{ marginTop: 8 }}>
                            {initialData.slides.length > 0 ? (
                                initialData.slides.map((slide, index) => (
                                    <Image
                                        key={index}
                                        src={slide}
                                        alt={`Slide ${index + 1}`}
                                        width={120}
                                        height={80}
                                        style={{
                                            borderRadius: '8px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ))
                            ) : (
                                <Text type="secondary">Chưa có hình ảnh slider</Text>
                            )}
                        </Space>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <Title level={5} style={{ margin: 0 }}>
                        Email
                    </Title>
                    <Text>{initialData.email}</Text>
                </div>

                {/* Số điện thoại */}
                <div>
                    <Title level={5} style={{ margin: 0 }}>
                        Số điện thoại
                    </Title>
                    <Text>{initialData.phone}</Text>
                </div>
            </Space>
        </Card>
    )
}

export default GeneralSetting