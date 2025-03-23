import handleAPI from "@/apis/handleAPI";
import ModalRole from "@/components/Role/ModalRole";
import Access from "@/components/Share/Access";
import TableData from "@/components/Table/TableData";
import { ALL_PERMISSIONS } from "@/constants/permissions";
import { Button, message, Modal, notification, Space, TableColumnsType, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";

export interface IRole {
    _id: string
    title: string
    permissions: Array<string>
    description: string
    isActive: boolean
    slug: string
    createdBy: {
        _id: string
        email: string
    }
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

const { Text } = Typography
const RolePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("createdAt");
    const [filterQuery, setFilterQuery] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [dataSource, setDataSource] = useState<IRole[]>([]);
    const [dataSelected, setDataSelected] = useState<IRole>();

    useEffect(() => {
        getRoles();
    }, [current, pageSize, sortQuery, filterQuery]);


    const getRoles = async () => {
        setIsLoading(true);
        const api = `roles?current=${current}&pageSize=${pageSize}&sort=${sortQuery}`;
        try {
            const res = await handleAPI(api);
            if (res.data) {
                setDataSource(res.data.result);
                setTotal(res.data.meta.totalItems);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const columns: TableColumnsType<IRole> = [
        {
            title: 'STT',
            render: (_, _1, index) => {
                return (index + 1) + (current - 1) * pageSize
            },
            minWidth: 60
        },
        {
            key: "title",
            title: 'Tiêu đề',
            dataIndex: "title",
            minWidth: 100
        },
        {
            key: "description",
            title: 'Mô tả',
            dataIndex: "description",
            minWidth: 100,
            render: (description: string) => {
                return <div style={{ width: 300 }}>
                    <Text ellipsis={{ tooltip: description }}>{description}</Text>
                </div>
            }
        },
        {
            key: "isActive",
            title: 'Trạng thái',
            dataIndex: "isActive",
            minWidth: 100,
            render: (isActive: boolean) => {
                return <Tag color={isActive ? "#87d068" : "#f50"}>{isActive ? "Hoạt động" : "Không Hoạt động"}</Tag>
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: "createdAt",
            render: (createdAt: string) => {
                return dayjs(createdAt).format("DD/MM/YYYY hh:mm:ss");
            },
            minWidth: 100,
        },
        {
            title: 'Người tại',
            render: (role: IRole) => {
                return role.createdBy.email;
            },
            minWidth: 100,
        },
        {
            key: "action",
            title: '',
            fixed: "right",
            width: 100,
            render: (roles: IRole) => {
                return (<>
                    <Space>
                        <Access
                            permission={ALL_PERMISSIONS.ROLES.UPDATE}
                            hideChildren
                        >
                            <Button
                                type="text"
                                onClick={() => {
                                    setIsVisible(true)
                                    setDataSelected(roles)
                                }}
                                icon={<TbEdit color="" size={20}
                                    className="text-info"
                                />}
                            />
                        </Access>
                        <Access
                            permission={ALL_PERMISSIONS.ROLES.DELETE}
                            hideChildren
                        >
                            <Button
                                type="text"
                                onClick={() => Modal.confirm({
                                    title: "Xác nhận",
                                    content: "Bạn chắc chắn muốn xoá?",
                                    onOk: () => handleRemove(roles._id)
                                })}
                                icon={<TbTrash size={20}
                                    className="text-danger"
                                />}
                            />
                        </Access>
                    </Space>
                </>)
            }
        },
    ]

    const handleRemove = async (id: string) => {
        setIsLoading(true);
        const api = `roles/${id}`;
        const res = await handleAPI(api, "", "delete");
        if (res.data) {
            // getRoles();
            message.success("Xoá thành công!");
        } else {
            notification.error({
                message: "Xoá thất bại",
                description: res.message
            })
        }
        setIsLoading(false);
    }

    return (
        <>
            <Access
                permission={ALL_PERMISSIONS.ROLES.GET}
            >
                <TableData
                    api="roles"
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize}
                    setSortQuery={setSortQuery}
                    setFilterQuery={setFilterQuery}
                    openAddNew={() => { setIsVisible(true) }}
                    columns={columns}
                    dataSource={dataSource}
                    isLoading={isLoading}
                    permissionCreate={ALL_PERMISSIONS.ROLES.CREATE}
                    permissionDelete={ALL_PERMISSIONS.ROLES.DELETE}
                />
                <ModalRole
                    isVisible={isVisible}
                    onClose={() => {
                        setIsVisible(false);
                        setDataSelected(undefined)
                    }}
                    loadData={getRoles}
                    dataSelected={dataSelected}
                />
            </Access>
        </>
    )
}

export default RolePage