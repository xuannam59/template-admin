import { CloudUploadOutlined, ExportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";


interface IProps {
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    setSortQuery: React.Dispatch<React.SetStateAction<string>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderTable = (props: IProps) => {
    const { setIsModalOpen } = props
    return (
        <>
            <div className="d-flex justify-content-between">
                <span>Table List Users</span>
                <span className="d-flex gap-3">
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >Export</Button>

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                    >Import</Button>

                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
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

export default HeaderTable;