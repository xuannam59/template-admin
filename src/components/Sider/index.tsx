import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd"
import Sider from "antd/es/layout/Sider"
import { Link } from "react-router-dom";

interface IProp {
    collapsed: boolean,
    activeMenu: string,
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>,
}

const SiderComponent = (props: IProp) => {
    const { collapsed, activeMenu, setActiveMenu } = props;
    const items = [
        {
            key: 'dashboard',
            icon: <HomeOutlined />,
            label: <Link to={'/'}>Dashboard</Link>,
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: <Link to={'/users'}>Users</Link>,
        },
    ]
    return <>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: "white" }}>
            <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                Admin
            </div>
            <Menu
                defaultSelectedKeys={[activeMenu]}
                theme="light"
                mode="inline"
                items={items}
                onClick={(e) => setActiveMenu(e.key)}
            />
        </Sider>
    </>
}

export default SiderComponent