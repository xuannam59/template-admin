import { VND } from "@/helpers/handleCurrency";
import { IOrder } from "@/pages/Order";
import { Descriptions, Divider, Drawer, Image, Table, TableColumnsType, Tag, Typography } from "antd";
import dayjs from "dayjs";

interface IProps {
    isOpenDetail: boolean,
    dataDetail: IOrder | undefined,
    onClose: () => void;
}
const { Text } = Typography;
const OrderDetail = (props: IProps) => {
    const { isOpenDetail, onClose, dataDetail } = props;

    const renderStatus = (status: string | undefined) => {
        switch (status) {
            case "pending":
                return <Tag>Đang đóng hàng</Tag>;
            case "shipping":
                return <Tag color="processing">Đang giao hàng</Tag>;
            case "success":
                return <Tag color="success">Giao hàng thành công</Tag>;
            case "cancel":
                return <Tag color="error">Huỷ đơn hàng</Tag>;
            case "return":
                return <Tag color="purple">Trả hàng</Tag>;
            default:
                return <Tag color="warning">Không xác định</Tag>;
        }
    };

    const columns: TableColumnsType<IOrder["products"][number]> = [
        {
            title: "Sản phẩm",
            dataIndex: "title",
            key: "title",
            render: (text: string) => (
                <Text ellipsis={{ tooltip: text }} style={{ width: 200, display: "block" }}>
                    {text}
                </Text>
            ),
        },
        {
            key: "quantity",
            title: "Số lượng",
            dataIndex: "quantity",
            align: "center"
        },
        {
            key: "color",
            title: "Màu sắc",
            dataIndex: "color",
            align: "center",
            render: (color: string) => <Tag color={color} style={{ height: 16 }} />
        },
        {
            title: "Hình ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (text: string) => <Image src={text} width={50} />,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price: number) => VND.format(price),
        },
    ];

    return (
        <>
            <Drawer
                title={`Thông tin đơn đặt hàng`}
                onClose={onClose}
                open={isOpenDetail}
                width={"50vw"}
            >
                <Descriptions
                    size="middle"
                    title={`Mã đơn hàng: ${dataDetail?._id}`}

                    column={2}
                >
                    <Descriptions.Item label="Người nhận">{dataDetail?.receiver}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đơn hàng">
                        {renderStatus(dataDetail?.status)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataDetail?.phoneNumber}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ giao" span={2}>
                        <Text ellipsis={{ tooltip: dataDetail?.address }}>
                            {dataDetail?.address}
                        </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt">
                        {dayjs(dataDetail?.createdAt).format("DD/MM/YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày dự kiến nhận">
                        {dayjs(dataDetail?.createdAt).add(4, "day").format("DD/MM/YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái thanh toán">
                        <Tag color={dataDetail?.paymentStatus ? "green" : "red"}>
                            {dataDetail?.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức thanh toán">
                        {dataDetail?.paymentMethod === "cod" ?
                            "Thanh toán nhận hàng" : "Thanh toán chuyển khoản"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">
                        <Text strong>{VND.format(dataDetail ? dataDetail.totalAmount : 0)}</Text>
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Table
                    columns={columns}
                    dataSource={dataDetail?.products}
                    rowKey={(record) => record.title}
                    pagination={false}
                />
            </Drawer>
        </>
    )
}

export default OrderDetail;