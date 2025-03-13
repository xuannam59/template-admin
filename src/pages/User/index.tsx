import handleAPI from "@/apis/handleAPI";
import UserImport from "@/components/User/data/UserImport";
import UserHeaderTable from "@/components/User/UserHeaderTable";
import InputSearch from "@/components/User/InputSearch";
import UserModalCreate from "@/components/User/UserModalCreate";
import UserModalUpdate from "@/components/User/UserModalUpdate";
import UserViewDetail from "@/components/User/UserViewDetail";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { message, notification, Popconfirm, Table, TableColumnsType, TableProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export interface IUDataType {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: {
        _id: string,
        name: string
    };
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
    const [dataViewDetail, setDataViewDetail] = useState<IUDataType | undefined>(undefined);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
    const [dataSelect, setDataSelect] = useState<any>(undefined);
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

    const handelDelete = async (id: string) => {
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

    const columns: TableColumnsType<IUDataType> = [
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
                    setDataViewDetail(record);
                    setIsOpenDetail(true)
                }}
                >{text}</Link>
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
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: (_, record) => {
                return <span>{record.role.name}</span>
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
                                    setIsModalOpenUpdate(true)
                                    setDataSelect(record)
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

    const onChange: TableProps<IUDataType>['onChange'] = (pagination, filters, sorter: any, extra) => {
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
                            setIsModalOpenCreate={setIsModalOpenCreate}
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
        <UserModalCreate
            isModalOpenCreate={isModalOpenCreate}
            setIsModalOpenCreate={setIsModalOpenCreate}
            fetchUser={fetchUser}
        />
        <UserModalUpdate
            isModalOpenUpdate={isModalOpenUpdate}
            onclose={() => {
                setDataSelect(undefined)
                setIsModalOpenUpdate(false)
            }}
            fetchUser={fetchUser}
            dataSelect={dataSelect}
        />
        <UserImport
            setIsModalOpenImport={setIsModalOpenImport}
            isModalOpenImport={isModalOpenImport}
            fetchUser={fetchUser}
        />
    </>)
}

export default UserPage;