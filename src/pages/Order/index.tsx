import handleAPI from "@/apis/handleAPI";
import OrderDetail from "@/components/Order/OrderDetail";
import OrderStatistic from "@/components/Order/OrderStatistic";
import Access from "@/components/Share/Access";
import TableData from "@/components/Table/TableData";
import { ALL_PERMISSIONS } from "@/constants/permissions";
import { Card, DatePicker, notification, Radio, Select, Space, TableColumnsType, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export interface IOrder {
    _id: string
    userId?: string
    receiver: string
    phoneNumber: string
    address: string
    email: string
    totalAmount: number
    products: Array<{
        title: string
        quantity: number
        color: string
        thumbnail: string
        price: number
    }>
    status: string
    paymentStatus: number
    paymentMethod: string
    createdAt: string
    updatedAt: string
}

const { Paragraph, Text } = Typography

const OrderPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortQuery, setSortQuery] = useState("-createdAt");
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [dataDetail, setDataDetail] = useState<IOrder>();
    const [dateSelect, setDateSelect] = useState<"day" | "week" | "month" | "year">("year");
    const [dates, setDates] = useState<{
        start: string,
        end: string
    }>();

    useEffect(() => {
        if (dateSelect) {
            setDates({
                start: dayjs().startOf(dateSelect).format(),
                end: dayjs().endOf(dateSelect).format()
            });
        }
    }, [dateSelect]);

    useEffect(() => {
        getOrder()
    }, [current, pageSize, filterQuery, sortQuery, dates]);

    const getOrder = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}&sort=${sortQuery}`;
        if (filterQuery) {
            query += `&key=${filterQuery}`;
        }
        if (dates?.start && dates?.end) {
            query += `&startDate=${dates.start}&endDate=${dates.end}`;
        }
        try {
            const res = await handleAPI(`orders?${query}`);
            if (res.data) {
                setOrders(res.data.result);
                setTotal(res.data.meta.totalItems);
            } else {
                notification.error({
                    message: "Get orders failure",
                    description: res.message
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const daysDifference = dayjs(dates?.end).diff(dates?.start, "day") + 1;

    const columns: TableColumnsType<IOrder> = [
        {
            title: 'STT',
            render: (_, _1, index) => {
                return (index + 1) + (current - 1) * pageSize
            },
            minWidth: 60
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: "_id",
            render: (_id: string, record) => {
                return <Tag
                    onClick={() => {
                        setIsOpenDetail(true)
                        setDataDetail(record)
                    }}
                ><a>{_id}</a></Tag>
            },
            fixed: 'left',
            minWidth: 60
        },
        {
            title: "Tên khách hàng",
            dataIndex: "receiver",
            align: "center",
            minWidth: 140
        },
        {
            title: "Mô tả sản phẩm",
            dataIndex: "products",
            align: "center",
            width: 300,
            render: (products: IOrder["products"]) => {
                const titleShow = products.reduce((preValue, curValue) =>
                    preValue + curValue.title + ", ", "");
                return <>
                    <Paragraph
                        className="mb-0"
                        ellipsis={{ rows: 1, tooltip: titleShow }}
                        style={{ width: 300 }}
                    >
                        {titleShow}
                    </Paragraph>
                </>
            }
        },
        {
            title: "Số lượng",
            dataIndex: "products",
            align: "center",
            width: 100,
            render: (products: IOrder["products"]) => {
                const quantityShow = products.reduce((preValue, curValue) => preValue + curValue.quantity, 0)
                return <Tag color="lime">
                    {quantityShow}
                </Tag>
            }
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "paymentMethod",
            align: "center",
            minWidth: 200,
            render: (paymentMethod: string) => {
                switch (paymentMethod) {
                    case "cod":
                        return <Tag color="#2db7f5">Thanh toán khi nhận hàng</Tag>
                    case "tt":
                        return <Tag color="#87d068">Thanh toán bằng ngân hàng</Tag>
                    default:
                        return <Tag color="#f50">Không xác định</Tag>;

                }
            }
        },
        {
            title: "Trạng thái thanh toán",
            dataIndex: "paymentStatus",
            align: "center",
            minWidth: 200,
            render: (paymentMethod: number) => {
                switch (paymentMethod) {
                    case 0:
                        return <Tag>Chưa thanh toán</Tag>
                    case 1:
                        return <Tag>Đã thanh toán</Tag>
                    default:
                        return <Tag color="#f50">Không xác định</Tag>;

                }
            }
        },
        {
            title: "Trạng thái đơn hàng",
            dataIndex: "status",
            align: "center",
            minWidth: 150,
            fixed: "right",
            render: (status: string, record) => {
                return <>
                    <Select
                        value={status}
                        style={{ width: 180 }}
                        onChange={(val) => handleChangeSelect(record._id, val)}
                        // disabled={!(status === "pending" || status === "shipping")}
                        options={[
                            { value: "pending", label: <Text>Đang đóng hàng</Text> },
                            { value: "shipping", label: <Text type="warning">Đang giao hàng</Text> },
                            { value: "success", label: <Text type="success">Giao hàng thành công</Text> },
                            { value: "cancel", label: <Text type="danger">Huỷ đơn hàng</Text> },
                            { value: "return", label: 'Trả lại hàng' },
                        ]}
                    />
                </>
            }
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            align: "center",
            minWidth: 120,
            render: (createdAt: string) => {
                return dayjs(createdAt).format("DD/MM/YYYY")
            }
        },
        {
            title: "Ngày dự kiến nhận",
            dataIndex: "createdAt",
            align: "center",
            minWidth: 200,
            render: (createdAt: string) => {
                return dayjs(createdAt).add(4, "day").format("DD/MM/YYYY")
            }
        },
    ];

    const handleChangeSelect = async (id: string, status: string) => {
        setIsLoading(true);
        const api = `orders/update/${id}`;
        const data = {
            status
        }
        try {
            const res = await handleAPI(api, data, "patch");
            if (res.data) {
                setOrders(prev => {
                    prev.forEach(item => {
                        if (item._id === id) {
                            if (status === "success") {
                                item.paymentStatus = 1;
                            }
                            item.status = status;
                        }

                    });
                    return prev;
                })
            } else {
                notification.error({
                    message: "Thay đổi trạng thái thất bại",
                    description: res.message
                })
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            <Access
                permission={ALL_PERMISSIONS.ORDERS.GET}
            >
                <div className="text-end mb-2">
                    <Space>
                        <Radio.Group
                            onChange={e => setDateSelect(e.target.value)}
                            value={dateSelect}
                        >
                            <Radio.Button value={"day"}>
                                Day
                            </Radio.Button>
                            <Radio.Button value={"week"}>
                                Week
                            </Radio.Button>
                            <Radio.Button value={"month"}>
                                Month
                            </Radio.Button>
                            <Radio.Button value={"year"}>
                                Year
                            </Radio.Button>
                        </Radio.Group>
                        <DatePicker.RangePicker
                            format={"DD/MM/YYYY"}
                            onChange={val => {
                                if (val && val.length === 2) {
                                    setDates({
                                        start: dayjs(val[0]).format(),
                                        end: dayjs(val[1]).format()
                                    });
                                } else {
                                    setDateSelect("year");
                                }
                            }}
                        />
                    </Space>
                </div>
                <Card className="mb-2">
                    <div className="row">
                        <OrderStatistic
                            title="Tổng số"
                            value={total}
                            label={`Trong ${daysDifference} ngày`}
                            color="#0F0F0F"
                        />
                        <OrderStatistic
                            title="Tổng số nhận được "
                            value={orders.filter(item => item.status === "success").length}
                            total={orders.reduce((a, b) => {
                                if (b.status === "success") {
                                    return a + b.totalAmount
                                }
                                return a;
                            }, 0)}
                            label={`Trong ${daysDifference} ngày`}
                            desc="Lợi nhuận"
                            color="#E19133"
                        />
                        <OrderStatistic
                            title="Tổng số trả hàng"
                            value={orders.filter(item => item.status === "return").length}
                            label={`Trong ${daysDifference} ngày`}
                            color="#845EBC"
                        />
                        <OrderStatistic
                            title="Trên đường giao"
                            value={orders.filter(item => item.status === "shipping").length}
                            label="Đã đặt"
                            color="#F36960"
                        />
                    </div>
                </Card>
                <div className="container p-2 rounded" style={{ backgroundColor: "white" }}>
                    <div className="row">
                        <div className="col">
                            <TableData
                                api="orders"
                                isLoading={isLoading}
                                columns={columns}
                                dataSource={orders}
                                current={current}
                                setFilterQuery={setFilterQuery}
                                setSortQuery={setSortQuery}
                                setCurrent={setCurrent}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                total={total}
                                hiddenBtnAdd
                                permissionCreate={ALL_PERMISSIONS.ORDERS.CREATE}
                                permissionDelete={ALL_PERMISSIONS.ORDERS.DELETE}
                            />
                        </div>
                    </div>
                </div>
                <OrderDetail
                    isOpenDetail={isOpenDetail}
                    dataDetail={dataDetail}
                    onClose={() => {
                        setDataDetail(undefined);
                        setIsOpenDetail(false)
                    }}
                />
            </Access>
        </>
    )
}

export default OrderPage