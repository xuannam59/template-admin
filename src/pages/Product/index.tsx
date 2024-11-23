import handleAPI from '@/apis/handleAPI'
import ProductHeaderTable from '@/components/Product/ProductHeaderTable'
import ProductInputSearch from '@/components/Product/ProductInputSearch'
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons'
import { Avatar, Button, Image, message, notification, Popconfirm, Table, TableColumnsType, TableProps, Typography } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const { Title } = Typography

export interface IPDataType {
    _id: string;
    title: string;
    thumbnail: string;
    price: number;
    discountPercentage: number;
    quantity: number,
    sliders: string[],
    status: string,
    createdAt: Date;
    updatedAt: Date;
}

const ProductPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listProduct, setListProduct] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        fetchProducts();
    }, [current, pageSize, sortQuery, filterQuery]);


    const fetchProducts = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}${filterQuery ? filterQuery : ""}${sortQuery ? `&sort=${sortQuery}` : "&sort=-createdAt"}`;
        try {
            const res = await handleAPI(`/products?${query}`);
            if (res && res.data) {
                setListProduct(res.data.result);
                setTotal(res.data.meta.totalItems);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handelDelete = async (id: string) => {
        setIsLoading(true)
        const res = await handleAPI(`/products/${id}`, "", "delete");
        if (res && res.data) {
            fetchProducts();
            message.success("Xoá sản phẩm thành công");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setIsLoading(false)
    }

    const columns: TableColumnsType<IPDataType> = [
        {
            title: 'STT',
            render: (_, record, index) => {
                return (index + 1) + (current - 1) * pageSize
            },
            fixed: 'left',
            width: 60
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
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            fixed: 'left',
            render: (text, record) => {
                return <Avatar
                    src={text}
                    size={37}
                />
            }
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'title',
            sorter: true,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: true,
            render: (text, record) => {
                return <>
                    {text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                </>
            }
        },
        {
            title: 'Phần trăm giảm giá',
            dataIndex: 'discountPercentage',
            sorter: true,
            render: (text, record) => {
                return <>
                    {(Math.round(text * 100) / 100).toFixed(2)}%
                </>
            }
        },
        {
            title: 'Ngày cập nhập',
            dataIndex: 'updatedAt',
            render: (text) => {
                return dayjs(text).format("DD/MM/YYYY")
            }
        },
        {
            title: 'Action',
            fixed: "right",
            render: (text, record) => {
                return (
                    <>
                        <div className="d-flex gap-3">
                            <EditTwoTone
                                style={{ fontSize: '18px', cursor: "pointer" }}
                                twoToneColor="#f57800"
                                onClick={() => {
                                    navigate(`/products/update-product/${record._id}`);
                                }}
                            />

                            <Popconfirm
                                placement="bottomRight"
                                title={"Xoá người dùng"}
                                description={"Bạn chắc chắn muốn xoá người dùng này"}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => {
                                    handelDelete(record._id);
                                }}
                            >
                                <DeleteTwoTone
                                    style={{ fontSize: '18px', cursor: "pointer" }}
                                    twoToneColor="#ff4d4f"
                                />
                            </Popconfirm>
                        </div>
                    </>
                )
            }
        },
    ];

    const onChange: TableProps<IPDataType>['onChange'] = (pagination, filters, sorter: any, extra) => {
        if (pagination.current && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination.pageSize && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
        if (sorter.field && sorter) {
            let sort1 = (sorter.order === "ascend" ? "" : "-") + sorter.field;
            setSortQuery(sort1);
        } else {
            setSortQuery("");
        }
    }
    return (
        <div className="container p-4 rounded" style={{ backgroundColor: "white" }}>
            <Title level={3}>Quản lý Sản phẩm</Title>
            <div className="row">
                <div className="col-12 mb-3">
                    <ProductInputSearch
                        setFilterQuery={setFilterQuery}
                    />
                </div>
                <div className="col-12">
                    <Table
                        title={() => <ProductHeaderTable
                            setFilterQuery={setFilterQuery}
                            setSortQuery={setSortQuery}
                            listProduct={listProduct}
                        />}
                        loading={isLoading}
                        columns={columns}
                        dataSource={listProduct}
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
                            y: 70 * 8
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductPage