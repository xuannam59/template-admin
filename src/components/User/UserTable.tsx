import { Table, TableColumnsType, TableProps, Typography } from "antd";
import InputSearch from "./InputSearch";
import { useEffect, useState } from "react";
import handleAPI from "@/apis/handleAPI";
import HeaderTable from "./HeaderTable";
import { Link } from "react-router-dom";
import UserViewDetail from "./UserViewDetail";
import UserModalCreate from "./UserModalCreate";
import dayjs from "dayjs";
import UserImport from "./data/UserImport";

export interface DataType {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const { Title } = Typography

const UserTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("");
    const [filter, setFilter] = useState("");
    const [listUser, setListUser] = useState([]);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<DataType | undefined>(undefined);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenImport, setIsModalOpenImport] = useState(false);


    useEffect(() => {
        fetchUser();
    }, [current, pageSize, sortQuery, filter]);

    const fetchUser = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}${filter ? filter : ""}${sortQuery ? `&sort=${sortQuery}` : ""}`;
        const res = await handleAPI(`/users?${query}`);
        if (res.data && res) {
            setListUser(res.data.result);
            setTotal(res.data.meta.totalItems);
        }
        setIsLoading(false);
    }
    const columns: TableColumnsType<DataType> = [
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
            width: 100
        },
    ];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter: any, extra) => {
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
            <Title level={3}>Quản lý người dùng</Title>
            <div className="row">
                <div className="col-12 mb-3">
                    <InputSearch
                        setSearchFilter={setFilter}
                    />
                </div>
                <div className="col-12">
                    <Table
                        title={() => <HeaderTable
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
        <UserImport
            setIsModalOpenImport={setIsModalOpenImport}
            isModalOpenImport={isModalOpenImport}
            fetchUser={fetchUser}
        />
    </>)
}

export default UserTable;