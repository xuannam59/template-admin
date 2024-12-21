import { Menu } from "antd"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react";
import {
    TbBrandProducthunt, TbCategory, TbChecklist,
    TbHome, TbPackages, TbPlaylistAdd,
    TbSettings, TbSquareRoundedPercentage,
    TbUsersGroup
} from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

interface IProp {
    collapsed: boolean,
}

const SiderComponent = (props: IProp) => {
    const [activeMenu, setActiveMenu] = useState('');
    let location = useLocation();
    useEffect(() => {
        if (location && location.pathname) {
            const allRoute = [
                "", "users", "products",
                "addProduct", "add-product", "update-product",
                "categories", "general-settings", "orders",
                "promotions"];
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
            icon: <TbHome size={24} />,
            label: <Link to={'/'}>Dashboard</Link>,
        },
        {
            key: "manageProducts",
            icon: <TbBrandProducthunt size={24} />,
            label: <span>Manage Products</span>,
            children: [
                {
                    key: "products",
                    icon: <TbChecklist size={24} />,
                    label: <Link to={'/products'}>Products</Link>,
                },
                {
                    key: "add-product",
                    icon: <TbPlaylistAdd size={24} />,
                    label: <Link to={'/add-product'}>Add product</Link>,
                }
            ]
        },
        {
            key: 'categories',
            icon: <TbCategory size={24} />,
            label: <Link to={'/categories'}>Manage categories</Link>,
        },
        {
            key: 'users',
            icon: <TbUsersGroup size={24} />,
            label: <Link to={'/users'}>Manage Users</Link>,
        },
        {
            key: 'orders',
            icon: <TbPackages size={24} />,
            label: <Link to={'/orders'}>Manage order</Link>,
        },
        {
            key: 'general-settings',
            icon: <TbSettings size={24} />,
            label: <Link to={'/general-settings'}>Settings</Link>,
        },
        {
            key: 'promotions',
            icon: <TbSquareRoundedPercentage size={24} />,
            label: <Link to={'/promotions'}>Promotions</Link>,
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