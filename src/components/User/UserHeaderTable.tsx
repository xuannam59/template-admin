import { downloadExcel } from "@/helpers/exportExcel";
import { IUser } from "@/pages/User";
import { CloudUploadOutlined, ExportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, notification, Typography } from "antd";
import dayjs from "dayjs";


interface IProps {
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    setSortQuery: React.Dispatch<React.SetStateAction<string>>;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModalOpenImport: React.Dispatch<React.SetStateAction<boolean>>;
    listUser: IUser[]
}

const UserHeaderTable = (props: IProps) => {
    const { setIsVisible, setIsModalOpenImport, listUser } = props
    const exportData = () => {
        const data = listUser.map((item) => {
            return {
                "ID": item._id,
                "Tên Hiên thị": item.name,
                "Email": item.email,
                "Số điện thoại": item.phone,
                "Vai trò": item.role,
                "Ngày tạo": dayjs(item.createdAt).format("DD/MM/YYYY"),
                "Ngày cập nhập": dayjs(item.updatedAt).format("DD/MM/YYYY"),
            }
        })
        if (data.length > 0) {
            downloadExcel(data, "DataUser");
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
                <span>Table List Users</span>
                <span className="d-flex gap-3">
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => exportData()}
                    >Export</Button>

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setIsModalOpenImport(true)}
                    >Import</Button>

                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setIsVisible(true)}
                    >Thêm mới</Button>
                    <Button onClick={() => {
                        props.setFilter("")
                        props.setSortQuery("")
                    }}>
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>

        </>
    )
}

export default UserHeaderTable;