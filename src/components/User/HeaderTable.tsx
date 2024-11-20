import { CloudUploadOutlined, ExportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";


interface IProps {
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    setSortQuery: React.Dispatch<React.SetStateAction<string>>;
    setIsModalOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModalOpenImport: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderTable = (props: IProps) => {
    const { setIsModalOpenCreate, setIsModalOpenImport } = props
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
                        onClick={() => setIsModalOpenImport(true)}
                    >Import</Button>

                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setIsModalOpenCreate(true)}
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