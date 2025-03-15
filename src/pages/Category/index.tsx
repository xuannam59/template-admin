import handleAPI from '@/apis/handleAPI';
import ModalCategory from '@/components/Category/ModalCategory';
import Access from '@/components/Share/Access';
import TableData from '@/components/Table/TableData';
import { ALL_PERMISSIONS } from '@/constants/permissions';
import { tree } from '@/helpers/createTree';
import { Button, Image, message, Modal, notification, Space, TableColumnsType, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { TbEdit, TbTrash } from 'react-icons/tb';
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
    const [isVisible, setIsVisible] = useState(false);
    const [dataSeleted, setDataSelected] = useState<ICategories | undefined>(undefined);
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
                    width={40}
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
            render: (category: ICategories) => {
                return (
                    <>
                        <Space>
                            <Access
                                permission={ALL_PERMISSIONS.CATEGORIES.UPDATE}
                                hideChildren
                            >
                                <Button
                                    type="text"
                                    onClick={() => {
                                        setIsVisible(true)
                                        setDataSelected(category)
                                    }}
                                    icon={<TbEdit color="" size={20}
                                        className="text-info"
                                    />}
                                />
                            </Access>
                            <Access
                                permission={ALL_PERMISSIONS.CATEGORIES.DELETE}
                                hideChildren
                            >
                                <Button
                                    type="text"
                                    onClick={() => Modal.confirm({
                                        title: "Xác nhận",
                                        content: "Bạn chắc chắn muốn xoá?",
                                        onOk: () => handleRemove(category._id)
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
    ]

    const handleRemove = async (id: string) => {
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
            <Access
                permission={ALL_PERMISSIONS.CATEGORIES.GET}
            >
                <div className="container  p-4 rounded" style={{ backgroundColor: "white" }}>
                    <div className="row">
                        <div className="col">
                            <TableData
                                api='categories'
                                columns={columns}
                                isLoading={isLoading}
                                dataSource={listCategory}
                                setCurrent={() => 1}
                                setPageSize={() => 1}
                                setFilterQuery={setFilterQuery}
                                setSortQuery={() => { }}
                                openAddNew={() => { setIsVisible(true) }}
                                checkStrictly
                                permissionCreate={ALL_PERMISSIONS.CATEGORIES.CREATE}
                                permissionDelete={ALL_PERMISSIONS.CATEGORIES.DELETE}
                            />
                        </div>
                    </div>
                </div>
                <ModalCategory
                    isVisible={isVisible}
                    onClose={() => {
                        setIsVisible(false);
                        setDataSelected(undefined)
                    }}
                    selectData={dataSeleted}
                    fetchCategories={fetchCategories}
                />
            </Access>
        </>
    )
}

export default CategoryPage