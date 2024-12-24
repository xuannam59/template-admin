import { downloadExcel } from "@/helpers/exportExcel";
import { IPDataType } from "@/pages/Product";
import { CloudUploadOutlined, ExportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, notification, Typography } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";


interface IProps {
    setFilterQuery: React.Dispatch<React.SetStateAction<string>>;
    setSortQuery: React.Dispatch<React.SetStateAction<string>>;
    listProduct: IPDataType[]
}

const ProductHeaderTable = (props: IProps) => {
    const { listProduct, setFilterQuery, setSortQuery } = props
    const navigate = useNavigate()
    const exportData = () => {
        const data = listProduct.map((item) => {
            return {
                "ID": item._id,
                "Tên sản phẩm": item.title,
                "Giá": `${item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}`,
                "Phần trăm giảm giá": `${item.discountPercentage}%`,
                "Số lượng": item.quantity,
                "Ngày tạo": dayjs(item.createdAt).format("DD/MM/YYYY"),
                "Ngày cập nhập": dayjs(item.updatedAt).format("DD/MM/YYYY"),
            }
        })
        if (data.length > 0) {
            downloadExcel(data, "DataProduct");
        } else {
            notification.error({
                message: "Export error",
                description: "Không lấy được dữ liệu để xuất"
            })
        }
    }
    return (
        <>
            <div className="d-flex justify-content-between">
                <span>Table Product</span>
                <span className="d-flex gap-3">
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => exportData()}
                    >Export</Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => navigate('/products/create')}
                    >Thêm mới</Button>
                    <Button onClick={() => {
                        setFilterQuery("")
                        setSortQuery("")
                    }}>
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>

        </>
    )
}

export default ProductHeaderTable;