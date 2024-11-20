import { Badge, Descriptions, Drawer } from "antd";
import { DataType } from "./UserTable";
import dayjs from "dayjs";

interface IProps {
    isOpenDetail: boolean,
    dataViewDetail: DataType | undefined,
    onClose: any
}

const UserViewDetail = (props: IProps) => {
    const { isOpenDetail, onClose, dataViewDetail } = props;

    return (
        <>
            <Drawer
                title={`Chức năng xem chi tiết`}
                onClose={onClose}
                open={isOpenDetail}
                width={"50vw"}
            >
                <Descriptions
                    size="middle"
                    title={`Thông tin: ${dataViewDetail?.name}`}
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiên thị">{dataViewDetail?.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        {dataViewDetail?.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Vai trò" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="CreatedAt">
                        {dayjs(dataViewDetail?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="UpdatedAt">
                        {dayjs(dataViewDetail?.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default UserViewDetail;