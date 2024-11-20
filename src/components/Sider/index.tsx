import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface IProp {
    collapsed: boolean,
}

const SiderComponent = (props: IProp) => {
    const [activeMenu, setActiveMenu] = useState('');
    let location = useLocation();
    useEffect(() => {
        if (location && location.pathname) {
            const allRoute = ["", "users"];
            const currentRoute = allRoute.find((item) => location.pathname.split("/")[1] === item);
            if (currentRoute) {
                setActiveMenu(currentRoute);
            } else {
                setActiveMenu("dashboard");
            }
        }
    }, [location]);
    const { collapsed } = props;
    const items = [
        {
            key: 'dashboard',
            icon: <HomeOutlined />,
            label: <Link to={'/'}>Dashboard</Link>,
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: <Link to={'/users'}>Manage Users</Link>,
        },
    ]
    return <>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: "white" }}>
            <div style={{ height: 32, margin: 16, textAlign: 'center', lineHeight: "32px" }}>
                Admin
            </div>
            <Menu
                defaultSelectedKeys={['dashboard']}
                selectedKeys={[activeMenu]}
                theme="light"
                mode="inline"
                items={items}
                onClick={(e) => setActiveMenu(e.key)}
                style={{ borderTop: "1px solid #f2f6fa" }}
            />
        </Sider >
    </>
}

export default SiderComponent