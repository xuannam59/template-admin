import handleAPI from '@/apis/handleAPI';
import ToggleCategory from '@/components/Category/ToggleCategory';
import TableData from '@/components/Table/TableData';
import { tree } from '@/helpers/createTree';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Image, message, notification, Popconfirm, TableColumnsType, Tag } from 'antd'
import dayjs from 'dayjs';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export interface ICategories {
    _id: string;
    title: string;
    description: string;
    parentId: string;
    status: string;
    displayMode: boolean;
    image: string;
    createdAt: Date;
    createdBy: {
        _id: string,
        email: string
    };
    updatedAt: Date;
    children: ICategories[];
}


const CategoryPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listCategory, setListCategory] = useState<ICategories[]>([]);
    const [filterQuery, setFilterQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectData, setSelectData] = useState<ICategories | undefined>(undefined);
    useEffect(() => {
        fetchCategories();
    }, [filterQuery]);


    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            let query = `${filterQuery ? `&slug=/${filterQuery}/i` : ""}`
            const res = await handleAPI(`/categories?${query}`);
            if (res.data && res) {
                const data = res.data.result.map((item: any) => {
                    return {
                        _id: item._id,
                        title: item.title,
                        updatedAt: item.updatedAt,
                        status: item.status,
                        image: item.image,
                        displayMode: item.displayMode,
                        description: item?.description ?? "",
                        parentId: item?.parentId ?? "",
                    }
                })
                const result: any = tree(data);
                setListCategory(result);
                console.log(result);
                // setListCategory(res.data.result);
                // setTotal(res.data.meta.totalItems);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }

    const columns: TableColumnsType<ICategories> = [
        {
            title: 'Tên danh mục',
            dataIndex: 'title',
            minWidth: 150,
            render: (text: string) => {
                return <Link to={''}
                >{text}</Link>
            }
        },
        {
            title: 'Ảnh',
            dataIndex: "image",
            align: "center",
            width: 60,
            render: (image: string) => {
                return <Image
                    src={image}
                    width={20}
                />
            }
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            minWidth: 150
        },
        {
            title: 'Chế độ hiển thị',
            dataIndex: "displayMode",
            width: 100,
            render: (displayMode: boolean) => {
                return <>
                    <Tag color={displayMode ? "#87d068" : "#2db7f5"}>
                        {displayMode ? "Hiển thị" : "Không hiển thị"}
                    </Tag>
                </>
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
            width: 100,
            render: (status: string) => {
                return <>
                    <Tag color={status === "active" ? "green" : "red"}>
                        {status.toUpperCase()}
                    </Tag>
                </>
            }
        },
        {
            title: 'Ngày cập nhập',
            dataIndex: 'updatedAt',
            width: 200,
            render: (text) => {
                return dayjs(text).format("DD/MM/YYYY")
            }
        },
        {
            title: 'Action',
            fixed: "right",
            render: (item: ICategories) => {
                return (
                    <>
                        <div className="d-flex gap-3">
                            <EditTwoTone
                                style={{ fontSize: '18px', cursor: "pointer" }}
                                twoToneColor="#f57800"
                                onClick={() => {
                                    setSelectData(item);
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

    return (
        <>
            <div className="container  p-4 rounded" style={{ backgroundColor: "white" }}>
                <div className="row">
                    <div className="col">
                        <TableData
                            api='categories'
                            columns={columns}
                            isLoading={isLoading}
                            dataSource={listCategory}
                            setCurrent={() => 1}
                            setFilterQuery={setFilterQuery}
                            setSortQuery={() => { }}
                            openAddNew={() => { setIsModalOpen(true) }}
                            checkStrictly
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