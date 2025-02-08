import handleAPI from '@/apis/handleAPI'
import ProductViewDetail from '@/components/Product/ProductViewDetail'
import TableData from '@/components/Table/TableData'
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons'
import { Image, message, notification, Popconfirm, TableColumnsType, TableProps, Tag } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export interface IProducts {
    _id: string;
    title: string;
    images: string[];
    price: number;
    thumbnail: string;
    discountPercentage: number;
    categoryId: {
        _id: string;
        title: string;
    },
    versions: {
        color: string;
        quantity: number;
    }[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    createdBy?: {
        _id: string;
        email: string;
    };
    chip: string;
    ram: string;
    ssd: string;
    gpu: string;
    updatedBy?: {
        _id: string;
        email: string;
    };
}

const ProductPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listProduct, setListProduct] = useState<IProducts[]>([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState("");
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IProducts | undefined>(undefined);

    const navigate = useNavigate();
    useEffect(() => {
        fetchProducts();
    }, [current, pageSize, sortQuery, filterQuery]);


    const fetchProducts = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}${filterQuery ? `&slug=/${filterQuery}/i` : ""}${sortQuery ? `&sort=${sortQuery}` : "&sort=-createdAt"}`;
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
    }

    const columns: TableColumnsType<IProducts> = [
        {
            title: 'STT',
            render: (_, record, index) => {
                return (index + 1) + (current - 1) * pageSize
            },
            fixed: 'left',
            width: 60
        },
        {
            title: 'Ảnh',
            fixed: 'left',
            align: "center",
            width: 60,
            render: (item: IProducts) => {
                return <Image
                    src={item.thumbnail}
                    width={50}
                />
            }
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'title',
            sorter: true,
            fixed: 'left',
            ellipsis: true,
            render: (text, record) => {
                const maxLength = 26;
                const displayText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
                return (
                    <Link
                        to={''}
                        onClick={() => {
                            setDataViewDetail(record);
                            setIsOpenDetail(true);
                        }}
                    >
                        {displayText}
                    </Link>
                );
            }
        },
        {
            title: 'Danh mục',
            minWidth: 120,
            render: (item: IProducts) => {
                return (
                    <>{item.categoryId.title}</>
                )
            },
        },
        {
            title: 'Thông số kỹ thuật',
            minWidth: 160,
            render: (item: IProducts) => {
                return (
                    <>{item.chip} {item.ram}GB RAM {item.ssd}GB SSD {item.gpu ? `${item.gpu} GPU` : ""}</>
                )
            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            minWidth: 100,
            sorter: true,
            render: (text) => {
                return <>
                    {text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                </>
            }
        },
        {
            title: '% giảm giá',
            dataIndex: 'discountPercentage',
            minWidth: 120,
            render: (item) => {
                return <>
                    {(Math.round(item * 100) / 100).toFixed(2)}%
                </>
            }
        },
        {
            title: 'Giá mới',
            minWidth: 120,
            render: (item: IProducts) => {
                const newPrice = Math.floor(item.price * (1 - item.discountPercentage / 100));
                return <>
                    {newPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                </>
            }
        },
        {
            title: "Màu sắc",
            minWidth: 100,
            render: (item: IProducts) => {
                return item.versions.map(item => <Tag
                    key={item.color}
                    color={item.color}
                    style={{ width: "20px", height: "20px", borderRadius: 100 }}
                />)
            }
        },
        {
            title: 'Số lượng đã bán',
            dataIndex: "sales",
            minWidth: 150,
            align: "center",
            render: (sales: number) => {
                return <>
                    {
                        <Tag color='green'>{sales}</Tag>
                    }
                </>
            }
        },
        {
            title: 'Số lượng',
            minWidth: 100,
            align: "center",
            render: (item: IProducts) => {
                const quantity = item.versions.reduce(
                    (accumulator, currentValue) => accumulator + currentValue.quantity, 0
                )
                return <>
                    {
                        <Tag color='cyan'>
                            {quantity}
                        </Tag>
                    }
                </>
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            minWidth: 100,
            render: (item) => {
                return <Tag color={item === "active" ? "#87d068" : "#f50"}>
                    {item === "active" ? "Đang bán" : "Tạm dừng bán"}
                </Tag>
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            minWidth: 120,
            render: (text) => {
                return dayjs(text).format("DD/MM/YYYY HH:mm:ss")
            }
        },
        {
            title: 'Ngày cập nhập',
            dataIndex: 'updatedAt',
            minWidth: 120,
            render: (text) => {
                return dayjs(text).format("DD/MM/YYYY HH:mm:ss")
            }
        },
        {
            title: 'Người tạo',
            minWidth: 120,
            render: (item: IProducts) => {
                return <>{item.createdBy?.email}</>
            }
        },
        {
            title: 'Hàng động',
            minWidth: 120,
            fixed: "right",
            render: (item: IProducts) => {
                return (
                    <>
                        <div className="d-flex gap-4">
                            <EditTwoTone
                                style={{ fontSize: '18px', cursor: "pointer" }}
                                twoToneColor="#f57800"
                                onClick={() => {
                                    navigate(`/products/update/${item._id}`);
                                }}
                            />

                            <Popconfirm
                                placement="bottomRight"
                                title={"Xoá sản phẩm"}
                                description={"Bạn chắc chắn muốn xoá sản phẩm này"}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => {
                                    handelDelete(item._id);
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

    const onChange: TableProps<IProducts>['onChange'] = (pagination, filters, sorter: any, extra) => {
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

    const dataExport = listProduct.map((item) => {
        return {
            "ID": item._id,
            "Tên sản phẩm": item.title,
            "Giá": `${item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}`,
            "Phần trăm giảm giá": `${item.discountPercentage}%`,
            "Số lượng": item.versions.reduce((x, currentValue) => x + currentValue.quantity, 0),
            "Ngày tạo": dayjs(item.createdAt).format("DD/MM/YYYY"),
            "Ngày cập nhập": dayjs(item.updatedAt).format("DD/MM/YYYY"),
        }
    })

    return (
        <div className="container p-4 rounded" style={{ backgroundColor: "white" }}>
            <div className="row">
                <div className="col">
                    <TableData
                        api='products'
                        columns={columns}
                        openAddNew={() => { navigate("/products/create") }}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        isLoading={isLoading}
                        dataSource={listProduct}
                        onChange={onChange}
                        setFilterQuery={setFilterQuery}
                        setSortQuery={setSortQuery}
                        setCurrent={setCurrent}
                        dataExport={dataExport}
                    />
                </div>
            </div>
            <ProductViewDetail
                isOpenDetail={isOpenDetail}
                onClose={() => {
                    setDataViewDetail(undefined);
                    setIsOpenDetail(false)
                }}
                dataViewDetail={dataViewDetail}
            />
        </div>
    )
}

export default ProductPage