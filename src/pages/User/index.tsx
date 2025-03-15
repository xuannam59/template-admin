import handleAPI from "@/apis/handleAPI";
import Access from "@/components/Share/Access";
import UserImport from "@/components/User/data/UserImport";
import InputSearch from "@/components/User/InputSearch";
import ModalUser from "@/components/User/ModalUser";
import UserHeaderTable from "@/components/User/UserHeaderTable";
import UserViewDetail from "@/components/User/UserViewDetail";
import { ALL_PERMISSIONS } from "@/constants/permissions";
import { Button, message, Modal, notification, Space, Table, TableColumnsType, TableProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import { Link } from "react-router-dom";


export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    age: number;
    gender: string;
    role: {
        _id: string,
        title: string
    };
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("");
    const [filter, setFilter] = useState("");
    const [listUser, setListUser] = useState([]);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUser | undefined>(undefined);
    const [isVisible, setIsVisible] = useState(false);
    const [dataSelected, setDataSelected] = useState<any>(undefined);
    const [isModalOpenImport, setIsModalOpenImport] = useState(false);


    useEffect(() => {
        fetchUser();
    }, [current, pageSize, sortQuery, filter]);

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            let query = `current=${current}&pageSize=${pageSize}${filter ? filter : ""}${sortQuery ? `&sort=${sortQuery}` : "&sort=-createdAt"}`;
            const res = await handleAPI(`/users?${query}`);
            if (res.data && res) {
                setListUser(res.data.result);
                setTotal(res.data.meta.totalItems);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }

    const handleRemove = async (id: string) => {
        setIsLoading(true)
        const res = await handleAPI(`/users/${id}`, "", "delete");
        if (res && res.data) {
            fetchUser();
            message.success("Xoá user thành công");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setIsLoading(false)
    }

    const columns: TableColumnsType<IUser> = [
        {
            title: 'STT',
            render: (_, _1, index) => {
                return (index + 1) + (current - 1) * pageSize
            },
            fixed: 'left',
            width: 60
        },
        {
            title: 'ID',
            fixed: 'left',
            width: 60,
            render: (user: IUser) => {
                return <Link to={''} onClick={() => {
                    setDataViewDetail(user);
                    setIsOpenDetail(true)
                }}
                >{user._id}</Link>
            }
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            width: 300
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 150
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: (role) => {
                return <span>{role.title}</span>
            },
            width: 100
        },
        {
            title: 'Ngày cập nhập',
            dataIndex: 'updatedAt',
            render: (text) => {
                return dayjs(text).format("DD/MM/YYYY")
            },
            width: 150
        },
        {
            title: 'Action',
            fixed: "right",
            render: (text, record) => {
                return (
                    <>
                        <Space>
                            <Access
                                permission={ALL_PERMISSIONS.USERS.UPDATE}
                                hideChildren
                            >
                                <Button
                                    type="text"
                                    onClick={() => {
                                        setIsVisible(true)
                                        setDataSelected(record)
                                    }}
                                    icon={<TbEdit color="" size={20}
                                        className="text-info"
                                    />}
                                />
                            </Access>
                            <Access
                                permission={ALL_PERMISSIONS.USERS.DELETE}
                                hideChildren
                            >
                                <Button
                                    type="text"
                                    onClick={() => Modal.confirm({
                                        title: "Xác nhận",
                                        content: "Bạn chắc chắn muốn xoá?",
                                        onOk: () => handleRemove(record._id)
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

    const onChange: TableProps<IUser>['onChange'] = (pagination, filters, sorter: any, extra) => {
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

    return (<>
        <Access
            permission={ALL_PERMISSIONS.USERS.GET}
        >
            <div className="container p-4 rounded" style={{ backgroundColor: "white" }}>
                <div className="row">
                    <div className="col-12 mb-3">
                        <InputSearch
                            setSearchFilter={setFilter}
                        />
                    </div>
                    <div className="col-12">
                        <Table
                            title={() => <UserHeaderTable
                                setFilter={setFilter}
                                setSortQuery={setSortQuery}
                                setIsVisible={setIsVisible}
                                setIsModalOpenImport={setIsModalOpenImport}
                                listUser={listUser}
                            />}
                            loading={isLoading}
                            columns={columns}
                            dataSource={listUser}
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
            <UserViewDetail
                isOpenDetail={isOpenDetail}
                onClose={() => {
                    setDataViewDetail(undefined);
                    setIsOpenDetail(false)
                }}
                dataViewDetail={dataViewDetail}
            />
            <ModalUser
                isVisible={isVisible}
                onClose={() => {
                    setDataSelected(undefined)
                    setIsVisible(false)
                }}
                fetchUser={fetchUser}
                dataSelected={dataSelected}
            />
            <UserImport
                setIsModalOpenImport={setIsModalOpenImport}
                isModalOpenImport={isModalOpenImport}
                fetchUser={fetchUser}
            />
        </Access>
    </>)
}

export default UserPage;