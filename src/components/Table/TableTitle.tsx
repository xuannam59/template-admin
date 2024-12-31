import handleAPI from "@/apis/handleAPI";
import { downloadExcel } from "@/helpers/exportExcel";
import { replaceName } from "@/helpers/replaceName";
import { ExportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, message, notification, Typography } from "antd";
import React, { useState } from "react";
import { TbSearch } from "react-icons/tb";


interface IProps {
    setFilterQuery: (value: string) => void;
    setSortQuery: (value: string) => void;
    setCurrent: (value: number) => void;
    dataExport?: any[]
    openAddNew?: () => void;
    hiddenBtnAdd?: boolean;
    selectedIds: React.Key[];
    setSelectedIds: any;
    api: string
}

const { Text } = Typography

const TableTitle = (props: IProps) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const { setFilterQuery, setSortQuery, dataExport,
        openAddNew, hiddenBtnAdd, selectedIds,
        setSelectedIds, setCurrent, api } = props

    const [isLoading, setIsLoading] = useState(false);
    const exportData = () => {
        if (dataExport && dataExport.length > 0) {
            downloadExcel(dataExport, "DataProduct");
        } else {
            notification.error({
                message: "Export error",
                description: "Không lấy được dữ liệu để xuất"
            })
        }
    }

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        let query = "";
        const value = e.target.value;
        if (value.length > 3) {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                const title = replaceName(value);
                setFilterQuery(title);
                setCurrent(1);
            }, 1000);
        } else {
            clearTimeout(timeoutId)
            setFilterQuery(query);
        }

    }

    // đang bị lỗi nếu dùng cho các bảng khác không phải bảng products
    const DeleteSelectedItems = async () => {
        setIsLoading(true);
        try {
            const res = await handleAPI(`${api}/delete-multiple`, selectedIds, "delete");
            if (res.data) {
                message.success(`Successfully deleted ${selectedIds.length} items`);
                setSortQuery("-createdAt");
                setSelectedIds([]);
            } else {
                notification.error({
                    message: "Deletion error",
                    description: res.message && Array.isArray(res.message) ?
                        res.message.toString() :
                        res.message
                })
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-3">
                    {selectedIds.length > 0 &&
                        <>
                            <Button
                                loading={isLoading}
                                onClick={DeleteSelectedItems}
                                type="primary"
                                danger>Delete</Button>
                            <Text type="secondary" className="ms-2">{selectedIds.length} items selected</Text>
                        </>
                    }
                </div>
                {/* <Title level={5} className="col-2">Bảng dữ liệu</Title> */}
                <div className="col-6">
                    <Input
                        placeholder="Tìm kiếm ..."
                        onChange={onChangeSearch}
                        suffix={<TbSearch size={16} />}
                        maxLength={128}
                    />
                </div>
                <div className="col-3">
                    <div className="d-flex justify-content-end">
                        <Button
                            disabled={dataExport ? false : true}
                            icon={<ExportOutlined />}
                            type="primary"
                            onClick={() => exportData()}
                            className="me-2"
                        >Export
                        </Button>
                        {hiddenBtnAdd ??
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={openAddNew}
                                className="me-2"
                            >Thêm mới
                            </Button>
                        }
                        <Button onClick={() => {
                            setFilterQuery("")
                            setSortQuery("")
                        }}>
                            <ReloadOutlined />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default TableTitle;