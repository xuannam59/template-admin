import { IPDataType } from "@/pages/Product";
import { Badge, Descriptions, Divider, Drawer, Image } from "antd";
import dayjs from "dayjs";

interface IProps {
    isOpenDetail: boolean,
    dataViewDetail: IPDataType | undefined,
    onClose: any
}

const ProductViewDetail = (props: IProps) => {
    const { isOpenDetail, onClose, dataViewDetail } = props;

    return (
        <>
            <Drawer
                title={`Chức năng xem chi tiết`}
                onClose={onClose}
                open={isOpenDetail}
                width={"50vw"}
            >
                <Descriptions
                    size="middle"
                    title={`Thông tin sản phẩm: ${dataViewDetail?.title}`}
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Thumbnail" span={2}>
                        <Image
                            key={dataViewDetail?.thumbnail}
                            width={100}
                            src={dataViewDetail?.thumbnail}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Slider" span={2}>
                        {dataViewDetail?.slider.map((item) => (
                            <Image
                                key={item}
                                width={100}
                                src={item}
                            />
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="ID" span={2}>{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sản phẩm" span={2}>
                        {dataViewDetail?.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Danh mục">{dataViewDetail?.categoryId.title}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Giá">
                        {dataViewDetail?.price.toLocaleString('it-IT', {
                            style: 'currency', currency: 'VND'
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="% giảm giá">
                        {dataViewDetail?.discountPercentage}%
                    </Descriptions.Item>
                    <Descriptions.Item label="CreatedAt">
                        {dayjs(dataViewDetail?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="UpdatedAt">
                        {dayjs(dataViewDetail?.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
                <Divider />


            </Drawer>
        </>
    )
}

export default ProductViewDetail;