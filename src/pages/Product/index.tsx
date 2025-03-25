import handleAPI from '@/apis/handleAPI'
import ProductViewDetail from '@/components/Product/ProductViewDetail'
import Access from '@/components/Share/Access'
import TableData from '@/components/Table/TableData'
import { ALL_PERMISSIONS } from '@/constants/permissions'
import { Button, Image, message, Modal, notification, Space, TableColumnsType, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { TbEdit, TbTrash } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router-dom'

export interface IProducts {
    _id: string;
    title: string;
    images: string[];
    cost: number
    price: number;
    thumbnail: string;
    sold: number;
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
const { Text } = Typography
const ProductPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listProduct, setListProduct] = useState<IProducts[]>([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("-createdAt");
    const [filterQuery, setFilterQuery] = useState("");
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IProducts | undefined>(undefined);

    const navigate = useNavigate();
    useEffect(() => {
        fetchProducts();
    }, [current, pageSize, sortQuery, filterQuery]);


    const fetchProducts = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}&sort=${sortQuery}`;
        if (filterQuery) {
            query += `&slug=${filterQuery}`;
        }
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

    const handleRemove = async (id: string) => {
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
            minWidth: 120,
            render: (text, record) => {
                return (<>
                    <div style={{ maxWidth: "250px" }}>
                        <Text
                            ellipsis
                            onClick={() => {
                                setDataViewDetail(record);
                                setIsOpenDetail(true);
                            }}

                        >
                            <Link to="">
                                {text}
                            </Link>
                        </Text>
                    </div>
                </>
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
                    <>{item.chip} {item.ram} RAM {item.ssd} SSD {item.gpu ? `${item.gpu} GPU` : ""}</>
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
            dataIndex: "sold",
            minWidth: 150,
            align: "center",
            render: (sold: number) => {
                return <>
                    {
                        <Tag color='green'>{sold}</Tag>
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
            render: (product: IProducts) => {
                return (
                    <>
                        <Space>
                            <Access
                                permission={ALL_PERMISSIONS.PRODUCTS.UPDATE}
                                hideChildren
                            >
                                <Button
                                    type="text"
                                    onClick={() => {
                                        navigate(`/products/update/${product._id}`);
                                    }}
                                    icon={<TbEdit color="" size={20}
                                        className="text-info"
                                    />}
                                />
                            </Access>
                            <Access
                                permission={ALL_PERMISSIONS.PRODUCTS.DELETE}
                                hideChildren
                            >
                                <Button
                                    type="text"
                                    onClick={() => Modal.confirm({
                                        title: "Xác nhận",
                                        content: "Bạn chắc chắn muốn xoá?",
                                        onOk: () => handleRemove(product._id)
                                    })}
                                    icon={<TbTrash size={20}
                                        className="text-danger"
                                    />}
                                />
                            </Access>
                        </Space>
                    </>
                )
            }
        },
    ];


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
        <Access
            permission={ALL_PERMISSIONS.PRODUCTS.GET}
        >
            <div className="container p-2 rounded" style={{ backgroundColor: "white" }}>
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
                            setFilterQuery={setFilterQuery}
                            setSortQuery={setSortQuery}
                            setCurrent={setCurrent}
                            setPageSize={setPageSize}
                            dataExport={dataExport}
                            permissionCreate={ALL_PERMISSIONS.PRODUCTS.CREATE}
                            permissionDelete={ALL_PERMISSIONS.PRODUCTS.DELETE}
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
        </Access>
    )
}

export default ProductPage