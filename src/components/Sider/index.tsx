import { UserOutlined } from "@ant-design/icons";
import { Menu } from "antd"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react";
import { BsBox2 } from "react-icons/bs";
import { CiBoxList } from "react-icons/ci";
import { MdOutlineDashboard, MdOutlinePlaylistAdd } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

interface IProp {
    collapsed: boolean,
}

const SiderComponent = (props: IProp) => {
    const [activeMenu, setActiveMenu] = useState('');
    let location = useLocation();
    useEffect(() => {
        if (location && location.pathname) {
            const allRoute = ["", "users", "products",
                "addProduct", "add-product", "update-product"];
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
            icon: <MdOutlineDashboard size={20} />,
            label: <Link to={'/'}>Dashboard</Link>,
        },
        {
            key: "manageProducts",
            icon: <BsBox2 size={16} />,
            label: <span>Manage Products</span>,
            children: [
                {
                    key: "products",
                    icon: <CiBoxList size={20} />,
                    label: <Link to={'/products'}>Products</Link>,
                },
                {
                    key: "add-product",
                    icon: <MdOutlinePlaylistAdd size={20} />,
                    label: <Link to={'/add-product'}>Add product</Link>,
                }
            ]
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: <Link to={'/users'}>Manage Users</Link>,
        },
    ]
    return <>
        <Sider trigger={null} collapsible collapsed={collapsed} width={"220"} style={{ background: "white" }}>
            <div style={{ height: 32, margin: 16, textAlign: 'center', lineHeight: "32px" }}>
                Admin
            </div>
            <Menu
                className="menu-sider"
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