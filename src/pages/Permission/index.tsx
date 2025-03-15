import handleAPI from "@/apis/handleAPI";
import ModalPermission from "@/components/Permission/ModalPermission";
import Access from "@/components/Share/Access";
import TableData from "@/components/Table/TableData";
import { ALL_PERMISSIONS } from "@/constants/permissions";
import { Button, message, Modal, notification, Space, TableColumnsType, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";

export interface IPermission {
    _id: string
    title: string
    method: string
    module: string
    apiPath: string
    slug: string
    createdBy: {
        _id: string
        email: string
    }
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

const PermissionPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("-createdAt");
    const [filterQuery, setFilterQuery] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [dataSource, setDataSource] = useState<IPermission[]>([]);
    const [dataSelected, setDataSelected] = useState<IPermission>();

    useEffect(() => {
        getPermissions();
    }, [current, pageSize, sortQuery, filterQuery]);


    const getPermissions = async () => {
        setIsLoading(true);
        const api = `permissions?current=${current}&pageSize=${pageSize}&sort=${sortQuery}`;
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

    const columns: TableColumnsType<IPermission> = [
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
            key: "method",
            title: 'Phương thức',
            dataIndex: "method",
            minWidth: 120,
            render: (method: string) => {
                let color = "";
                switch (method) {
                    case "GET":
                        color = "green";
                        break;
                    case "POST":
                        color = "gold";
                        break;
                    case "PATCH":
                        color = "purple";
                        break;
                    case "DELETE":
                        color = "red";
                        break;
                }
                return <Tag color={color}>{method}</Tag>
            }
        },
        {
            key: "module",
            title: 'Mô -đun',
            dataIndex: "module",
            minWidth: 100,
        },
        {
            key: "apiPath",
            title: 'Api Path',
            dataIndex: "apiPath",
            minWidth: 100,
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
            render: (permission: IPermission) => {
                return permission.createdBy.email;
            },
            minWidth: 100,
        },
        {
            key: "action",
            title: '',
            fixed: "right",
            width: 100,
            render: (permissions: IPermission) => {
                return (<>
                    <Space>
                        <Access
                            permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE}
                            hideChildren
                        >
                            <Button
                                type="text"
                                onClick={() => {
                                    setIsVisible(true)
                                    setDataSelected(permissions)
                                }}
                                icon={<TbEdit color="" size={20}
                                    className="text-info"
                                />}
                            />
                        </Access>
                        <Access
                            permission={ALL_PERMISSIONS.PERMISSIONS.DELETE}
                            hideChildren
                        >
                            <Button
                                type="text"
                                onClick={() => Modal.confirm({
                                    title: "Xác nhận",
                                    content: "Bạn chắc chắn muốn xoá?",
                                    onOk: () => handleRemove(permissions._id)
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
        const api = `permissions/${id}`;
        const res = await handleAPI(api, "", "delete");
        if (res.data) {
            getPermissions();
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
                permission={ALL_PERMISSIONS.PERMISSIONS.GET}
            >
                <TableData
                    api="permissions"
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
                    permissionCreate={ALL_PERMISSIONS.PERMISSIONS.CREATE}
                    permissionDelete={ALL_PERMISSIONS.PERMISSIONS.DELETE}
                />
                <ModalPermission
                    isVisible={isVisible}
                    onClose={() => {
                        setIsVisible(false);
                        setDataSelected(undefined);
                    }}
                    loadData={getPermissions}
                    dataSelected={dataSelected}
                />
            </Access>
        </>
    )
}

export default PermissionPage