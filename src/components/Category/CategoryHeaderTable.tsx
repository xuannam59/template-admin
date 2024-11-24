import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, } from "antd";
import { useNavigate } from "react-router-dom";


interface IProps {
    setFilterQuery: React.Dispatch<React.SetStateAction<string>>;
    setSortQuery: React.Dispatch<React.SetStateAction<string>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CategoryHeaderTable = (props: IProps) => {
    const { setFilterQuery, setSortQuery, setIsModalOpen } = props
    const navigate = useNavigate()
    return (
        <>
            <div className="d-flex justify-content-between">
                <span>Table Product</span>
                <span className="d-flex gap-3">
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
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

export default CategoryHeaderTable;