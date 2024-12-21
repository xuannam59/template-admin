
import handleAPI from "@/apis/handleAPI";
import ModalPromotion from "@/components/Promotions/ModalPromotion";
import { Avatar, Button, message, Modal, notification, Space } from "antd"
import { useEffect, useState } from "react";
import { Table } from 'antd';
import { ColumnProps, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { TbEdit, TbTrash } from "react-icons/tb";
import ProductInputSearch from "@/components/Product/ProductInputSearch";

export interface IPromotions {
    _id: string
    title: string
    code: string
    value: number
    quantityAvailable: number
    descriptions: string;
    type: string
    startAt: string
    endAt: string
    image: string
    createdBy: {
        _id: string
        email: string
    }
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    slug: string
}

const { confirm } = Modal

const Promotions = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [promotions, setPromotions] = useState<IPromotions[]>([]);
    const [selectedPromotion, setSelectedPromotion] = useState<IPromotions>();
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("");
    const [filterQuery, setFilterQuery] = useState("");

    useEffect(() => {
        getPromotions()
    }, [current, pageSize, total, current, pageSize, sortQuery, filterQuery]);

    const getPromotions = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}
        ${filterQuery ? filterQuery : ""}
        ${sortQuery ? `&sort=${sortQuery}` : "&sort=-createdAt"}`;
        try {
            const res = await handleAPI(`/promotions?${query}`);
            if (res.data) {
                setPromotions(res.data.result);
                setTotal(res.data.meta.total);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const handleRemove = async (id: string) => {
        try {
            const res = await handleAPI(`/promotions/${id}`, "", "delete");
            if (res.data) {
                getPromotions();
                message.success("Delete successfully");
            } else {
                notification.error({
                    message: "Error",
                    description: res.message && Array.isArray(res.message) ? res.message.toString() : res.message,
                    duration: 3
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    const onChange: TableProps<IPromotions>['onChange'] = (pagination, filters, sorter: any, extra) => {
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

    const columns: ColumnProps<IPromotions>[] = [
        {
            title: 'STT',
            render: (_, record, index) => {
                return (index + 1) + (current - 1) * pageSize
            },
            fixed: 'left',
            minWidth: 60,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (img: string) => {
                return <Avatar src={img} size={50} />
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: 100
        },
        {
            title: 'Code',
            dataIndex: 'code',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            width: 100
        },
        {
            title: 'Quantity available',
            dataIndex: 'quantityAvailable',
            width: 170
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Start at',
            dataIndex: 'startAt',
            render: (start: Date) => {
                return dayjs(start).format("DD/MM/YYYY HH:mm:ss")
            }
        },
        {
            title: 'End at',
            dataIndex: 'endAt',
            render: (end: Date) => {
                return dayjs(end).format("DD/MM/YYYY HH:mm:ss")
            }
        },
        {
            fixed: "right",
            title: "Action",
            render: (item: IPromotions) => {
                return (
                    <>
                        <Space>
                            <Button
                                type="text"
                                onClick={() => {
                                    setIsVisible(true)
                                    setSelectedPromotion(item)
                                }}
                                icon={<TbEdit color="" size={20}
                                    className="text-info"
                                />}
                            />
                            <Button
                                type="text"
                                onClick={() => confirm({
                                    title: "Confirm",
                                    content: "Are you sure you want to remove this promotion?",
                                    onOk: () => handleRemove(item._id)
                                })}
                                icon={<TbTrash size={20}
                                    className="text-danger"
                                />}
                            />
                        </Space>
                    </>
                )
            }
        }

    ]


    return (
        <>
            <div className="container p-4 rounded" style={{ backgroundColor: "white" }}>
                <div className="row">
                    <div className="col-12 mb-3">
                        <ProductInputSearch
                            setFilterQuery={setFilterQuery}
                        />
                    </div>
                    <div className="col-12">
                        <Table
                            loading={isLoading}
                            columns={columns}
                            dataSource={promotions}
                            rowKey={"_id"}
                            onChange={onChange}
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
                                y: 83 * 8
                            }}
                        />
                    </div>
                </div>
            </div>
            <ModalPromotion
                isVisible={isVisible}
                onClose={() => {
                    setIsVisible(false);
                    setSelectedPromotion(undefined);
                }}
                loadData={() => getPromotions()}
                promotion={selectedPromotion}
            />
        </>
    )
}

export default Promotions