import handleAPI from "@/apis/handleAPI"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { doLogOutAction } from "@/redux/reducers/auth.reducer"
import { Avatar, Badge, Button, Drawer, Dropdown, List, message, Space, Typography } from "antd"
import { Header } from "antd/es/layout/layout"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { TbBell, TbMenu2, TbMenuDeep } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);


interface IProp {
    collapsed: boolean,
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

interface INotifications {
    _id: string
    type: string
    typeId: string
    title: string
    content: string
    isRead: boolean
    from: string
    to: string
    createdAt?: string
    updatedAt?: string
}

const { Text } = Typography
const HeaderComponent = (props: IProp) => {
    const { collapsed, setCollapsed } = props;
    const [limit, setLimit] = useState(8);
    const [notifications, setNotifications] = useState<INotifications[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
    const user = useAppSelector(state => state.auth.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const items = [
        {
            label: <label style={{ cursor: "pointer" }} >
                Quản lý tài khoản
            </label>,
            key: 'account',
        },
        {
            label: <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
                Đăng xuất
            </label>,
            key: 'logout',

        },
    ]

    useEffect(() => {
        getNotification();
    }, [limit]);

    const handleLogout = async () => {
        const api = "/auth/logout"
        const res = await handleAPI(api, '', 'post');
        if (res && res.data) {
            dispatch(doLogOutAction(""));
            message.success("Đăng xuất thành công");
            navigate("/auth/login")
        }
    }

    const getNotification = async () => {
        const api = `/notifications?limit=${limit}`;
        try {
            const res = await handleAPI(api);
            if (res.data) {
                setNotifications(res.data.result);
                setTotalItems(res.data.totalItems);
            }
        } catch (error) {
            console.log(error)
        }
    }
    return <>
        <Header style={{ backgroundColor: "white", borderBottom: "1px solid #f2f6fa", borderLeft: "1px solid #f2f6fa", paddingLeft: "0" }} >
            <div className="row">
                <div className="col">
                    <Button
                        type="text"
                        icon={collapsed ? <TbMenu2 /> : <TbMenuDeep />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </div>
                <div className="col text-end">
                    <Space>
                        <Button type="text" onClick={() => setIsVisibleDrawer(true)}>
                            <Badge count={totalItems} showZero>
                                <TbBell size={25} style={{ cursor: "pointer" }} />
                            </Badge >
                        </Button>
                        <Dropdown menu={{ items: items }} arrow placement="bottomRight">
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar size={38} src={user.avatar} />
                                <Text>
                                    {user?.name}
                                </Text>
                            </Space>
                        </Dropdown>
                    </Space>
                </div>
            </div>
        </Header>
        <Drawer
            open={isVisibleDrawer}
            onClose={() => setIsVisibleDrawer(false)}
        >
            <List
                dataSource={notifications}
                renderItem={item => {
                    return <>
                        <List.Item key={item._id}>
                            <List.Item.Meta
                                title={<Text>{item.title}</Text>}
                                description={item.content}
                            />
                            <Text type="secondary">{dayjs(item.createdAt).fromNow()}</Text>
                        </List.Item>
                    </>
                }}
            />

        </Drawer>
    </>
}

export default HeaderComponent;