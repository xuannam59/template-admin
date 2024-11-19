import handleAPI from "@/apis/handleAPI"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { doLogOutAction } from "@/redux/reducers/auth.reducer"
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Dropdown, message, Space } from "antd"
import { Header } from "antd/es/layout/layout"
import { useNavigate } from "react-router-dom"

interface IProp {
    collapsed: boolean,
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderComponent = (props: IProp) => {
    const { collapsed, setCollapsed } = props;
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

    const handleLogout = async () => {
        const api = "/auth/logout"
        const res = await handleAPI(api, '', 'post');
        if (res && res.data) {
            dispatch(doLogOutAction(""));
            message.success("Đăng xuất thành công");
            navigate("/auth/login")
        }
    }

    return <>
        <Header style={{ backgroundColor: "white", borderBottom: "1px solid #f2f6fa", borderLeft: "1px solid #f2f6fa" }} >
            <div className="row">
                <div className="col">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </div>
                <div className="col text-end">
                    <Dropdown menu={{ items: items }} trigger={['click']}>
                        <span style={{ cursor: "pointer" }}>
                            <Space>
                                <Avatar size={38} src={user.avatar} />
                                {user?.name}
                            </Space>
                        </span>
                    </Dropdown>
                </div>
            </div>
        </Header>
    </>
}

export default HeaderComponent;