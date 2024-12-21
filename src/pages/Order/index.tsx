import OrderInputSearch from "@/components/Order/OrderInputSearch";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Popconfirm, Table, TableColumnsType, Typography } from "antd"
import { useState } from "react";
import { Link } from "react-router-dom";

interface IODataType {
    _id: string;
    name: string;
    phone: string;
    address: string;
    email: string;
    products: {
        _id: string,
        title: string,
        quantity: number,
        money: number,
        thumbnail?: string,
    }[];
    paymentMethod: string;
    totalAmount: number;
    createdAt?: string;
    updatedAt?: string;
}

const { Title } = Typography

const OrderPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [filterQuery, setFilterQuery] = useState("");
    const [listOrder, setListOrder] = useState<IODataType[]>([
        {
            _id: "123123123123",
            name: "Lê Minh Xuân Nam",
            phone: "0962305358",
            address: "Đình cả nội duệ",
            email: "leeminhnam2k2@gmail.com",
            products: [
                {
                    _id: " ",
                    title: " ",
                    quantity: 0,
                    money: 0,
                    thumbnail: ""
                }
            ],
            paymentMethod: "Thanh toán khi nhân hàng",
            totalAmount: 5000,
        }
    ]);

    const columns: TableColumnsType<IODataType> = [
        {
            title: 'STT',
            render: (_, record, index) => {
                return (index + 1) + (current - 1) * pageSize
            },
            fixed: 'left',
            minWidth: 60
        },
        {
            title: 'ID',
            dataIndex: '_id',
            fixed: 'left',
            width: 60,
            render: (text, record) => {
                return <Link to={''} onClick={() => {
                    // setDataViewDetail(record);
                    // setIsOpenDetail(true)
                }}
                >{text}</Link>
            }
        },
        {
            title: "Tên khách hàng",
            dataIndex: "name",
            minWidth: 100
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            minWidth: 120,
            render: (data) => {
                return <>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data)}
                </>
            },
            sorter: true
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "paymentMethod",
            minWidth: 100
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
        },
        {
            title: "Số điên thoại",
            dataIndex: "phone",
            minWidth: 120,
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            minWidth: 120,
            sorter: true,
            fixed: "right"
        }
    ]

    const onChange = () => {

    }
    return (
        <div className="container p-4 rounded" style={{ backgroundColor: "white" }}>
            <Title level={3}>Quản lý đơn hàng</Title>
            <div className="row">
                <div className="col-12 mb-3">
                    <OrderInputSearch
                        setFilterQuery={setFilterQuery}
                    />
                </div>
                <div className="col-12">
                    <Table
                        loading={isLoading}
                        columns={columns}
                        dataSource={listOrder}
                        onChange={onChange}
                        rowKey={"_id"}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                            pageSizeOptions: [8, 15, 20, 50],
                            showTotal: (total, range) => { return <div>{range[0]}-{range[1]} trên {total}rows</div> }
                        }}
                        scroll={{
                            x: 'max-content',
                            y: 55 * 8
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default OrderPage