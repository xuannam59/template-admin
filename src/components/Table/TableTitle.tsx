import { downloadExcel } from "@/helpers/exportExcel";
import { replaceName } from "@/helpers/replaceName";
import { ExportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, notification, Typography } from "antd";
import React from "react";
import { TbSearch } from "react-icons/tb";


interface IProps {
    setFilterQuery: (value: string) => void;
    setSortQuery: (value: string) => void;
    dataExport?: any[]
    openAddNew?: () => void;
    hiddenBtnAdd?: boolean
}

const { Title } = Typography

const TableTitle = (props: IProps) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const { setFilterQuery, setSortQuery, dataExport,
        openAddNew, hiddenBtnAdd } = props
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
            }, 1000);
        } else {
            clearTimeout(timeoutId)
            setFilterQuery(query);
        }

    }

    return (
        <>
            <div className="row">
                <Title level={5} className="col-2">Bảng dữ liệu</Title>
                <div className="col-6">
                    <Input
                        placeholder="Tìm kiếm ..."
                        onChange={onChangeSearch}
                        suffix={<TbSearch size={16} />}
                        maxLength={128}
                    />
                </div>
                <div className="col-4">
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