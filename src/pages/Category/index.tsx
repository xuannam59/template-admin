import handleAPI from '@/apis/handleAPI';
import CategoryHeaderTable from '@/components/Category/CategoryHeaderTable';
import CategoryInputSearch from '@/components/Category/CategoryInputSearch';
import ToggleCategory from '@/components/Category/ToggleCategory';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { message, notification, Popconfirm, Table, TableColumnsType, TableProps, Tag, Typography } from 'antd'
import dayjs from 'dayjs';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export interface ICDataType {
    _id: string;
    title: string;
    description: string;
    parentId: {
        _id: string,
        title: string
    };
    status: string,
    createdAt: Date;
    updatedAt: Date;
}

const { Title } = Typography

const CategoryPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listCategory, setListCategory] = useState<ICDataType[]>([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectData, setSelectData] = useState<ICDataType | undefined>(undefined);
    useEffect(() => {
        fetchCategories();
    }, [current, pageSize, sortQuery, filterQuery]);


    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            let query = `current=${current}&pageSize=${pageSize}${filterQuery ? filterQuery : ""}${sortQuery ? `&sort=${sortQuery}` : "&sort=-createdAt"}`;
            const res = await handleAPI(`/categories?${query}`);
            if (res.data && res) {
                setListCategory(res.data.result);
                setTotal(res.data.meta.totalItems);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }

    const columns: TableColumnsType<ICDataType> = [
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
                return <Link to={''}
                >{text}</Link>
            }
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'title',
            width: 200,
            sorter: true,
        },
        {
            title: 'Danh mục cha',
            width: 200,
            render: (text, record) => {
                return <>
                    {record.parentId ? record.parentId.title : ""}
                </>
            }
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 300
        },
        {
            title: 'Trạng thái',
            width: 100,
            render: (text, record) => {
                return <>
                    <Tag color={record.status === "active" ? "green" : "red"}>
                        {record.status.toUpperCase()}
                    </Tag>
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
                                    setSelectData(record);
                                    setIsModalOpen(true)
                                }}
                            />

                            <Popconfirm
                                placement="bottomRight"
                                title={"Xoá người danh mục"}
                                description={"Bạn chắc chắn muốn xoá danh mục này"}
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
    ]

    const handelDelete = async (id: string) => {
        setIsLoading(true)
        const res = await handleAPI(`/categories/${id}`, "", "delete");
        if (res && res.data) {
            fetchCategories();
            message.success("Xoá danh mục thành công");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setIsLoading(false)
    }

    const onChange: TableProps<ICDataType>['onChange'] = (pagination, filters, sorter: any, extra) => {
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
        <>
            <div className="container  p-4 rounded" style={{ backgroundColor: "white" }}>
                <Title level={3}>Quản lý danh mục</Title>
                <div className="row">
                    <div className="col-12 mb-3">
                        <CategoryInputSearch
                            setFilterQuery={setFilterQuery}
                        />
                    </div>
                    <div className="col-12">
                        <Table
                            title={() => <CategoryHeaderTable
                                setFilterQuery={setFilterQuery}
                                setSortQuery={setSortQuery}
                                setIsModalOpen={setIsModalOpen}
                            />}
                            columns={columns}
                            loading={isLoading}
                            dataSource={listCategory}
                            onChange={onChange}
                            rowKey={"_id"}
                            pagination={{
                                current: current,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
                                pageSizeOptions: [8, 15, 20, 50],
                                showTotal: (total, range) => {
                                    return <div>{range[0]}-{range[1]} trên {total}rows</div>
                                }
                            }}
                            scroll={{
                                x: 'max-content',
                                y: 55 * 8
                            }}
                        />
                    </div>
                </div>
            </div>
            <ToggleCategory
                isModalOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectData(undefined)
                }}
                selectData={selectData}
                fetchCategories={fetchCategories}
            />
        </>
    )
}

export default CategoryPage