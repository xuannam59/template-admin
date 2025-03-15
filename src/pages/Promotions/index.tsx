import handleAPI from "@/apis/handleAPI";
import ModalPromotion from "@/components/Promotions/ModalPromotion";
import Access from "@/components/Share/Access";
import TableData from "@/components/Table/TableData";
import { ALL_PERMISSIONS } from "@/constants/permissions";
import { VND } from "@/helpers/handleCurrency";
import { Avatar, Button, message, Modal, notification, Space, Tag, Typography } from "antd";
import { icons } from "antd/es/image/PreviewGroup";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";

export interface IPromotions {
    _id: string
    title: string
    code: string
    value: number
    quantityAvailable: number
    descriptions: string;
    type: string
    startAt: string
    maxValue: number
    minValue: number
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

const { Text } = Typography
const Promotions = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState<IPromotions[]>([]);
    const [dataSelected, setDataSelected] = useState<IPromotions>();
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("-createdAt");
    const [filterQuery, setFilterQuery] = useState("");

    useEffect(() => {
        getPromotions()
    }, [current, pageSize, sortQuery, filterQuery]);

    const getPromotions = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}&sort=${sortQuery}`;
        if (filterQuery) {
            query += `&slug=/${filterQuery}/i`
        }
        try {
            const res = await handleAPI(`/promotions?${query}`);
            if (res.data && res) {
                setDataSource(res.data.result);
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

    const columns: ColumnProps<IPromotions>[] = [
        {
            title: 'STT',
            render: (_, _1, index) => {
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
            render: (code: string) => {
                return <>
                    <Text copyable code >{code}</Text>
                </>
            }
        },
        {
            title: 'Value',
            width: 100,
            render: (item: IPromotions) => {
                const suffix = item.type === "percent" ? `${item.value}%` : VND.format(item.value);
                return <>
                    <Tag>{suffix}</Tag>
                </>
            }
        },
        {
            title: 'Quantity available',
            dataIndex: 'quantityAvailable',
            width: 170,
            align: "center"
        },
        {
            title: "Maximum discount",
            dataIndex: "maxValue",
            render: (maxValue: number) => {
                return VND.format(maxValue)
            },
            minWidth: 160
        },
        {
            title: "Minimum value",
            dataIndex: "minValue",
            render: (minValue: number) => {
                return VND.format(minValue)
            },
            minWidth: 150
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
            render: (promotion: IPromotions) => {
                return (
                    <>
                        <Space>
                            <Access
                                permission={ALL_PERMISSIONS.PROMOTIONS.UPDATE}
                                hideChildren
                            >
                                <Button
                                    type="text"
                                    onClick={() => {
                                        setIsVisible(true)
                                        setDataSelected(promotion)
                                    }}
                                    icon={<TbEdit color="" size={20}
                                        className="text-info"
                                    />}
                                />
                            </Access>
                            <Access
                                permission={ALL_PERMISSIONS.PROMOTIONS.DELETE}
                                hideChildren
                            >
                                <Button
                                    type="text"
                                    onClick={() => Modal.confirm({
                                        title: "Xác nhận",
                                        content: "Bạn chắc chắn muốn xoá?",
                                        onOk: () => handleRemove(promotion._id)
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
        }

    ]


    return (
        <>
            <Access
                permission={ALL_PERMISSIONS.PROMOTIONS.GET}
            >
                <div className="container p-2 rounded" style={{ backgroundColor: "white" }}>
                    <div className="row">
                        <div className="col">
                            <TableData
                                api="promotions"
                                current={current}
                                pageSize={pageSize}
                                total={total}
                                setSortQuery={setSortQuery}
                                setCurrent={setCurrent}
                                setPageSize={setPageSize}
                                setFilterQuery={setFilterQuery}
                                openAddNew={() => { setIsVisible(true) }}
                                columns={columns}
                                dataSource={dataSource}
                                isLoading={isLoading}
                                permissionCreate={ALL_PERMISSIONS.PROMOTIONS.CREATE}
                                permissionDelete={ALL_PERMISSIONS.PROMOTIONS.DELETE}
                            />
                        </div>
                    </div>
                </div>
                <ModalPromotion
                    isVisible={isVisible}
                    onClose={() => {
                        setIsVisible(false);
                        setDataSelected(undefined);
                    }}
                    loadData={() => {
                        getPromotions()
                    }}
                    promotion={dataSelected}
                />
            </Access>
        </>
    )
}

export default Promotions