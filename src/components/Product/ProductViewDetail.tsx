import { IProducts } from "@/pages/Product";
import { Badge, Descriptions, Divider, Drawer, Image, Tag } from "antd";
import dayjs from "dayjs";

interface IProps {
    isOpenDetail: boolean,
    dataViewDetail: IProducts | undefined,
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
                    <Descriptions.Item label="Hình ảnh" span={2}>
                        {dataViewDetail?.images.map((url) => (
                            <Image
                                key={url}
                                width={100}
                                src={url}
                            />
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã sản phẩm" span={2}>{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sản phẩm" span={2}>
                        {dataViewDetail?.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Danh mục" span={2}>{dataViewDetail?.categoryId.title}</Descriptions.Item>
                    <Descriptions.Item label="Màu sắc"> {dataViewDetail?.versions.map((item) => (
                        <Tag
                            key={item.color}
                            color={item.color}
                            style={{ width: "20px", height: "20px", borderRadius: 100 }}
                        />
                    ))}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{dataViewDetail?.versions.reduce(
                        (accumulator, currentValue) => accumulator + currentValue.quantity, 0
                    )}</Descriptions.Item>
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